import HttpStatus from 'http-status';
import Sequelize from 'sequelize';

module.exports = app => {
	let api = {};
	const { reserva } = app.database.models;
	const Op = Sequelize.Op;

	const validaData = data => {
		let errors = [];
		let	date = data.split('/');
		let day = parseInt(date[0]);
		let month = parseInt(date[1]);
		let year = parseInt(date[2]);

		if (isNaN(year) || isNaN(month) || isNaN(day)) {
			return true;
		}

		if (month < 1 || month > 12) {
			return true;
		}

		if (month === 1 || month === 3 || month === 5 || month === 7 || month === 9 || month === 11) {
			if (day < 1 || day > 31) {
				return true;
			}
		}

		if (month === 4 || month === 6 || month === 8 || month === 10 || month === 12) {
			if (day < 1 || day > 30) {
				return true;
			}
		}

		if (month === 2) {
			if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
				if (day < 1 || day > 29) {
					return true;
				}
			} else {
				if (day < 1 || day > 28) {
					return true;
				}
			}
		}

		return false;
	};
	
	const validaHora = hora => {
		let hour = hora.split(':');

		if (hour[0] < 0 || hour[0] > 23) {
			return true;
		}

		if (hour[1] < 0 || hour[1] > 59) {
			return true;
		}

		return false;
	}

	const formataData = data => {
		let	date = data.split('/');
		return new Date(date[2], date[1] - 1, date[0]);
	}

	const validaDados = dados => {
		let erros = [];

		if (dados.codigomesa < 1) {
			erros.push({field: 'codigomesa', message: 'O código da mesa deve ser informado.'});
		}

		if (validaData(dados.datareserva)) {
			erros.push({field: 'datareserva', message: 'Data inválida. Por favor, informe a data no formato dd/mm/yyyy.'});
		}

		let d = new Date();
		d.setHours(0, 0, 0, 0);

		if (formataData(dados.datareserva) < d) {
			erros.push({field: 'datareserva', message: 'A data informada é menor que a data de hoje.'});
		}

		if (validaHora(dados.horainicio)) {
			erros.push({field: 'horainicio', message: 'Informe uma hora entre 00:00 e 23:59.'});
		}

		if (validaHora(dados.horafim)) {
			erros.push({field: 'horafim', message: 'Informe uma hora entre 00:00 e 23:59.'});
		}

		if (dados.numerolugares < 1) {
			erros.push({field: 'numerolugares', message: 'Informe o número de lugares.'});
		}

		if (dados.valorreserva < 0) {
			erros.push({field: 'valorreserva', message: 'Informe um valor válido.'});
		}

		if (parseInt(dados.horainicio.substring(0, 2)) > parseInt(dados.horafim.substring(0, 2))) {
			erros.push({field: 'horainicio', message: 'Hora inicial maior que hora final.'});
		}
 
		return erros;
	};

	const dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
		if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
		if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
		if (b_start <  a_start && a_end   <  b_end) return true; // a in b
		return false;
	}

	const difDates = (date) => {
		let data = new Date(date);
		let hoje = new Date();

		if (data.getDay() === hoje.getDay() && data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear()) {
			return true;
		}

		return false;
	};

	api.adiciona = (req, res) => {
		let dados = req.body;
		let erros = validaDados(dados);
		let hora;

		if (erros.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(erros);
			return;
		}

		dados.datainicio = formataData(dados.datareserva);
		dados.datafim = formataData(dados.datareserva);
		hora = dados.horainicio.split(':');
		dados.datainicio.setHours(hora[0], hora[1]);
		hora = dados.horafim.split(':');
		dados.datafim.setHours(hora[0], hora[1]);		
		dados.confirmada = false;

		let cria = true;

		reserva.findAll({where: {numeromesa: dados.numeromesa, restauranteId: dados.restauranteId}})
			.then(result => {
				if (result) {
					result.forEach(r => {
						if (dateRangeOverlaps(dados.datainicio, dados.datafim, r.datainicio, r.datafim)) {
							cria = false;
						}
					});
				}
				if (cria) {
					reserva.create(dados)
						.then(result => res.json(result))
						.catch(err => console.log(err));
				} else {
					res.status(HttpStatus.BAD_REQUEST).json([{field: 'numeromesa', message: 'Já existe uma reserva nesta mesa para este horário.'}]);
				}
			})
			.catch(err => console.log(err));
	};

	api.atualiza = (req, res) => {
		let dados = req.body;

		if (dados.clienteId === null) {
			reserva.findOne({where: {id: req.params.id}})
				.then(result => {
					if (difDates(result.datainicio)) {
						res.status(HttpStatus.BAD_REQUEST).json({msg: 'Você tem somente até 1 dia antes da reserva para efetuar o cancelamento.'});
						return;
					} else {
						reserva.update(dados, {where: {id: req.params.id, confirmada: false}})
							.then(result => res.json(result))
							.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
					}
				})
				.catch(() => res.sendStatus(HttpStatus.PRECONDITION_FAILED));
		} else {
			reserva.update(dados, {where: {id: req.params.id, confirmada: false}})
				.then(result => res.json(result))
				.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
		}
		
	};

	api.lista = (req, res) => {
		reserva.findAll({where: {restauranteId: req.params.id}, order: ['datainicio']})
			.then(result => res.json(result))
			.catch(() => res.sendStatus(HttpStatus.PRECONDITION_FAILED));
	};

	api.listaReservasDisponiveis = (req, res) => {
		reserva.findAll({where: {restauranteId: req.params.id, clienteId: null, datainicio: {[Op.gt]: new Date()}}, order: ['datainicio']})
			.then(result => res.json(result))
			.catch(() => res.sendStatus(HttpStatus.PRECONDITION_FAILED));
	};

	api.minhasReservas = (req, res) => {
		reserva.findAll({where: {clienteId: req.params.id, datainicio: {[Op.gt]: new Date()}}, order: ['datainicio']})
			.then(result => res.json(result))
			.catch(() => res.sendStatus(HttpStatus.PRECONDITION_FAILED));
	};

	api.deleta = (req, res) => {
		reserva.destroy({where: {id: req.params.id}})
			.then(() => res.sendStatus(HttpStatus.NO_CONTENT))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.buscaPorId = (req, res) => {
		reserva.findOne({where: {id: req.params.id, restauranteId: req.params.restauranteId}})
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	return api;
}