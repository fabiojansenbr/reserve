import HttpStatus from 'http-status';

module.exports = app => {
	const api = {};
	const { pessoa } = app.database.models;
	const { cliente, restaurante, contato, endereco } = app.controllers;

	api.validaDados = dados => {
		let erros = [];
		
		if (dados.nivelAcesso === 1) {
			erros = erros.concat(restaurante.validaDados(dados));
		} else if (dados.nivelAcesso === 2) {
			erros = erros.concat(cliente.validaDados(dados));
		}

		erros = erros.concat(contato.validaDados(dados));
		erros = erros.concat(endereco.validaDados(dados));

		return erros;
	}

	api.adiciona = (dados, res) => {

		pessoa.create(dados)
			.then(result => {
				dados.pessoaId = result.id;
				if (dados.nivelAcesso === 1) {
					restaurante.adiciona(dados, res);
				} else if (dados.nivelAcesso === 2) {
					cliente.adiciona(dados, res);
				}
				contato.adiciona(dados, res);
				endereco.adiciona(dados, res);
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	return api;
}