import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Notificacao from './utils/Notificacao';
import '../assets/css/login.css';
import logo from '../assets/img/random-logo2.png';

export default class Login extends Component {
	
	constructor() {
		super();
		this.state = {
			msg: '',
			mostra: 1
		}
	}

	envia(event) {
		event.preventDefault();

		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({
				email: this.email.value,
				senha: this.senha.value
			}),
			headers: new Headers({
				'Content-type': 'application/json'
			})
		};

		this.setState({mostra: 1});

		fetch('http://localhost:8080/autentica', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else if (response.status === 401) {
					this.setState({mostra: 0});
					this.mostraMensagem('Usuário ou senha inválidos.', 'danger');					
				} else {
					this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');					
				}
			})
			.then(result => {
				localStorage.setItem('auth-token', result.token);
				this.props.history.push('/');
			})
			.catch(() => this.state.mostra === 1 ? this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger') : null)
	}

	mostraMensagem(mensagem, alerta) {
		this.setState({msg: mensagem, tipoAlerta: alerta});
		$('#notificacao-login').show();
		setTimeout(() => {
			$('#notificacao-login').fadeOut(1000);						
		}, 2000);
	}

	render() {
		return(
			<div className="fundo-tela">
				<Notificacao id="notificacao-login" tipoAlerta="danger" texto={this.state.msg} />
				<div className="container">
					<div className="card card-container">
						<img src={logo} alt="logo" className="img-card" />
						<form onSubmit={this.envia.bind(this)} className="form-signin">
							<input type="email" id="email" className="form-control" 
								ref={(input) => this.email = input} placeholder="E-mail" required autoFocus />
							<input type="password" id="password" className="form-control" 
								ref={(input) => this.senha = input} placeholder="Senha" required />
							<button className="btn-log btn-lg btn-primary btn-block btn-signin" type="submit">Entrar</button>
						</form>
						<div className="row">
							<div className="col-md-6">
								<Link to={'/usuario/empresa'} className="link-nova-conta">Cadastrar como restaurante?</Link>							
							</div>
							<div className="col-md-6">
								<Link to={'/usuario/cliente'} className="link-nova-conta">Cadastrar como cliente?</Link>							
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}