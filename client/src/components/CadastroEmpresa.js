import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import InputCustomizado, { SubmitCustomizado } from './utils/CampoCustomizado';
import '../assets/css/usuario.css';

export default class CadastroEmpresa extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger',
			mostra: 1
		}
	}

	envia(event) {
		event.preventDefault();

		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({
				razaosocial: this.razaosocial.input.value,
				nomefantasia: this.nomefantasia.input.value,
				cnpj: this.cnpj.input.value,
				email: this.email.input.value,
				telefone: this.telefone.input.value,
				celular: this.celular.input.value,
				logradouro: this.logradouro.input.value,
				numero: this.numero.input.value,
				complemento: this.complemento.input.value,
				cep: this.cep.input.value,
				bairro: this.bairro.input.value,
				cidade: this.cidade.input.value,
				uf: this.uf.input.value,
				senha: this.senha.input.value,
				confirmaSenha: this.senhaConfirma.input.value,
				nivelAcesso: 1
			}),
			headers: new Headers({
				'Content-type': 'application/json'
			})
		}

		this.setState({mostra: 1});

		fetch('http://localhost:8080/usuarios', requestInfo)
			.then(response => {
				PubSub.publish('limpa-erros', {});
				if (response.ok) {
					return response.json();
				} else if (response.status === 400) {
					this.setState({mostra: 0});
					new TratadorErros().publicaErros(response.json());
				} else {
					this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
				}
			})
			.then(result => {
				if (result.token) {
					localStorage.setItem('auth-token', result.token);
					this.props.history.push('/reservas');
				} else {
					this.setState({msg: result});
				}
			})
			.catch(() => this.state.mostra === 1 ? this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger') : null);
	}

	mostraMensagem(mensagem, alerta) {
		this.setState({msg: mensagem, tipoAlerta: alerta});
		$('#notificacao-restaurante').show();
		setTimeout(() => {
			$('#notificacao-restaurante').fadeOut(1000);						
		}, 2000);
	}

	render() {
		return(
			<div className="fundo-tela">
				<Notificacao id="notificacao-restaurante" tipoAlerta="danger" texto={this.state.msg} />
				<div className="container card cadastro-usuario-form col-md-7">
					<h2 className="text-center">Cadastro de Restaurante</h2>
					<form className="cadastro-usuario" onSubmit={this.envia.bind(this)}>
						<InputCustomizado htmlFor="razao-social" titulo="Razão social"
							tipo="text" id="razao-social" required="true" nome="razaosocial"
							referencia={(input) => this.razaosocial = input}
							placeholder="Informe a razão social" />
						<InputCustomizado htmlFor="nome-fantasia" titulo="Nome fantasia"
							tipo="text" id="nome-fantasia" required="true" nome="nomefantasia"
							referencia={(input) => this.nomefantasia = input}
							placeholder="Informe o nome fantasia" />
						<InputCustomizado htmlFor="cnpj" titulo="CNPJ" mascara="99.999.999/9999-99"
							tipo="text" id="cnpj" required="true" nome="cnpj"
							referencia={(input) => this.cnpj = input}
							placeholder="Informe o CNPJ" />
						<InputCustomizado htmlFor="email" titulo="E-mail"
							tipo="email" id="email" required="true" nome="email"
							referencia={(input) => this.email = input}
							placeholder="Informe o e-mail" />
						<InputCustomizado htmlFor="telefone" titulo="Telefone" mascara="(99)9999-9999"
							tipo="text" id="telefone" required="true" nome="telefone"
							referencia={(input) => this.telefone = input}
							placeholder="Informe o telefone" />
						<InputCustomizado htmlFor="celular" titulo="Celular" mascara="(99)99999-9999"
							tipo="text" id="celular" required="true" nome="celular"
							referencia={(input) => this.celular = input}
							placeholder="Informe o celular" />
						<div className="row">
							<InputCustomizado htmlFor="logradouro" titulo="Logradouro"
								tipo="text" id="logradouro" required="true" nome="logradouro"
								referencia={(input) => this.logradouro = input} className="col-md-6"
								placeholder="Informe o logradouro" />
							<InputCustomizado htmlFor="número" titulo="N°"
								tipo="number" id="número" required="true" nome="número"
								referencia={(input) => this.numero = input} className="col-md-2"
								placeholder="N°" />
							<InputCustomizado htmlFor="complemento" titulo="Compl."
								tipo="text" id="complemento" nome="complemento"
								referencia={(input) => this.complemento = input} className="col-md-4"
								placeholder="Compl." />
						</div>
						<div className="row">
							<InputCustomizado htmlFor="cep" titulo="CEP" mascara="99.999-999"
								tipo="text" id="cep" required="true" nome="cep"
								referencia={(input) => this.cep = input} className="col-md-3"
								placeholder="CEP" />
							<InputCustomizado htmlFor="bairro" titulo="Bairro"
								tipo="text" id="bairro" required="true" nome="bairro"
								referencia={(input) => this.bairro = input} className="col-md-9"
								placeholder="Informe o bairro" />
						</div>
						<div className="row">
							<InputCustomizado htmlFor="cidade" titulo="Cidade"
								tipo="text" id="cidade" required="true" nome="cidade"
								referencia={(input) => this.cidade = input} className="col-md-6"
								placeholder="Informe a cidade" />
							<InputCustomizado htmlFor="uf" titulo="UF" maxlength="2"
								tipo="text" id="uf" required="true" nome="uf"
								referencia={(input) => this.uf = input} className="col-md-3"
								placeholder="UF" />
						</div>
						<InputCustomizado htmlFor="senha" titulo="Senha"
							tipo="password" id="senha" required="true" nome="senha" 
							referencia={(input) => this.senha = input}
							placeholder="Informe a sua senha aqui..." />
						<InputCustomizado htmlFor="senha-confirma" titulo="Confirme a senha"
							tipo="password" id="senha-confirma" required="true" nome="senha" 
							referencia={(input) => this.senhaConfirma = input}
							placeholder="Confirme a sua senha aqui..." />
						<div className="form-group">
							<SubmitCustomizado tipo="submit" 
								className="btn btn-black btn-lg btn-block" titulo="Criar Conta" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}