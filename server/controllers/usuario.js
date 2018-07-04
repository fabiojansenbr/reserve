import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status';
import Sequelize from 'sequelize';

module.exports = app => {
	const api = {};
	const config = app.config;
	const { usuario, cliente, restaurante, pessoa } = app.database.models;
	const pessoaController = app.controllers.pessoa;
	const Op = Sequelize.Op;

	const validaDados = dados => {
		let erros = [];

		erros = erros.concat(pessoaController.validaDados(dados));

		if (typeof dados.senha != 'undefined' && dados.senha.length < 6) {
			erros.push({field: 'senha', message: 'A senha deve ter no mínimo 6 dígitos.'});
		} 
		
		if (dados.senha !== dados.confirmaSenha) {
			erros.push({field: 'senha', message: 'As senhas digitadas não conferem.'});
			erros.push({field: 'confirmaSenha', message: 'As senhas digitadas não conferem.'});
		}

		return erros;
	};

	const criaUsuario = (dados, res) => {
		usuario.findOrCreate({where: {email: dados.email}, defaults: dados})
			.spread((user, created) => {
				if (created) {
					let usuario =  user.get({
						plain: true
					});
					dados.usuarioId = usuario.id;
					pessoaController.adiciona(dados, res);
					const payload = {id: usuario.id};
					res.json({
						token: jwt.sign(payload, config.jwtSecret, {expiresIn: 84600})
					});
				} else {
					res.status(HttpStatus.BAD_REQUEST).json([{field: 'email', message: 'Já existe uma conta utilizando este e-mail.'}]);
					return;
				}
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	}

	api.adiciona = (req, res) => {
		let dados = req.body;
		let erros = validaDados(dados);

		if (erros.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(erros);
			return;
		}

		if (dados.nivelAcesso === 1) {
			restaurante.findOne({where: {cnpj: dados.cnpj}})
				.then(result => {
					if (result) {
						res.status(HttpStatus.BAD_REQUEST).json([{field: 'cnpj', message: 'Já existe uma conta utilizando este CNPJ.'}]);
						return;
					} else {
						criaUsuario(dados, res);
					}
				})
				.catch(err => console.log(err));
		} else if (dados.nivelAcesso === 2) {
			cliente.findOne({where: {cpf: dados.cpf}})
				.then(result => {
					if (result) {
						res.status(HttpStatus.BAD_REQUEST).json([{field: 'cpf', message: 'Já existe uma conta utilizando este CPF.'}]);
						return;
					} else {
						criaUsuario(dados, res);
					}
				})
				.catch(err => console.log(err));
		}
	};

	api.lista = (req, res) => {
		usuario.findOne({where: req.user.id, 
			include: [{
				model: pessoa,
				include: [{model: cliente}, {model: restaurante}]
			}]})
			.then(result => res.json(result))
			.catch(() => res.sendStatus(HttpStatus.PRECONDITION_FAILED));
	};

	api.atualiza = (req, res) => {

	};

	api.deleta = (req, res) => {

	};

	return api;
}