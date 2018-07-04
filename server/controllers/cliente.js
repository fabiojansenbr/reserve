import HttpStatus from 'http-status';

module.exports = app => {
	const api = {};
	const { cliente } = app.database.models;

	api.validaDados = dados => {
		let erros = [];

		if (dados.nome.length < 1) { 
			erros.push({field: 'nome', message: 'Você deve informar um nome.'});
		}

		if (dados.sobrenome.length < 1) { 
			erros.push({field: 'sobrenome', message: 'Você deve informar um sobrenome.'});
		}
	
		// contando . e -
		if (dados.cpf.replace('_', '').length < 14) { 
			erros.push({field: 'cpf', message: 'O CPF deve ser informado no formato XXX.XXX.XXX-XX.'});
		}

		return erros;		
	};

	api.adiciona = (dados, res) => {
		cliente.create(dados)
			.then(result => result)
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	}

	return api;
}