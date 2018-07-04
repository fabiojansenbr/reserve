import HttpStatus from 'http-status';

module.exports = app => {
	const api = {};
	const { contato } = app.database.models;

	api.validaDados = dados => {
		let erros = [];
		
		if (dados.email.length < 1) { 
			erros.push({field: 'email', message: 'Você deve informar um e-mail.'});
		}

		// contando () e -
		if (dados.telefone.replace('_', '').length < 13) {
			erros.push({field: 'telefone', message: 'O telefone deve ser informado no formato (XX)XXXX-XXXX.'});
		}

		// contando () e -
		if (dados.celular.replace('_', '').length < 14) {
			erros.push({field: 'celular', message: 'O celular deve ser informado no formato (XX)XXXXX-XXXX.'});
		}

		return erros;
	}

	api.adiciona = (dados, res) => {
		
		contato.create(dados)
			.then(result => result)
			.catch(err => console.log(err));
	}

	return api;
}