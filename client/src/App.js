import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import Header from './components/Header';
import './assets/css/main.css';

export default class App extends Component {

	constructor() {
		super();
		this.state = {
			usuario: {}
		};
	}

	componentWillMount() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		setTimeout(() => {
			fetch('http://localhost:8080/api/usuarios', requestInfo)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						localStorage.removeItem('auth-token');
						this.props.history.push('/');
					}
				})
				.then(result => {
					let usuario = {};

					usuario.id = result.id;
					usuario.email = result.email;
					usuario.nivelAcesso = parseInt(result.nivelAcesso, 10);
					
					if (usuario.nivelAcesso === 1) {
						usuario.razaosocial = result.pessoa.restaurante.razaosocial;
						usuario.nomefantasia = result.pessoa.restaurante.nomefantasia;
						usuario.cnpj = result.pessoa.restaurante.cnpj;
						usuario.restauranteId = result.pessoa.restaurante.id;
					} else if (usuario.nivelAcesso === 2) {
						usuario.nome = result.pessoa.cliente.nome;
						usuario.sobrenome = result.pessoa.cliente.sobrenome;
						usuario.cpf = result.pessoa.cliente.cpf;
						usuario.clienteId = result.pessoa.cliente.id;
					}

					this.setState({usuario});
					this.publicaUsuario();
				});
		}, 300);
	}

	publicaUsuario() {
		PubSub.publish('usuario-canal', this.state.usuario);
	}

	render() {
		const { children } = this.props;
    	let childrenWithProps = React.Children.map(children, child =>
      		React.cloneElement(child, { usuario: this.state.usuario }));

		return (
			<div className="App">
				<Header usuario={this.state.usuario} />
				<div id="principal" style={{marginTop: '56px'}}>				
					{childrenWithProps}
				</div>
			</div>
		);
	}
}