import HttpStatus from 'http-status';

module.exports = app => {
	const api = {};
	const { restaurante, pessoa, contato, endereco } = app.database.models;

	api.validaDados = dados => {
		let erros = [];

		if (dados.razaosocial.length < 1) { 
			erros.push({field: 'razaosocial', message: 'Você deve informar uma Razão Social.'});
		}

		if (dados.nomefantasia.length < 1) { 
			erros.push({field: 'nomefantasia', message: 'Você deve informar um Nome Fantasia.'});
		}
	
		// contando . e -
		if (dados.cnpj.replace('_', '').length < 18) { 
			erros.push({field: 'cnpj', message: 'O CNPJ deve ser informado no formato XX.XXX.XXX/XXXX-XX.'});
		}

		return erros;
	};

	api.adiciona = (dados, res) => {
		restaurante.create(dados)
			.then(result => result)
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	}

	api.lista = (req, res) => {
		restaurante.findAll({
			include: [{
				model: pessoa,
				include: [{model: contato}, {model: endereco}]
			}]
		})
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	}

	return api;
}