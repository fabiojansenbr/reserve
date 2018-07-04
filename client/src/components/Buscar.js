import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Notificacao from './utils/Notificacao';
import '../assets/css/buscar.css';

export default class Buscar extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger',
			restaurantes: []
		};
	}

	componentDidMount() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch('http://localhost:8080/api/restaurantes', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
				}
			})
			.then(restaurantes => this.setState({restaurantes}))
			.catch(() => this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger'));
	}

	mostraMensagem(mensagem, alerta) {
		this.setState({msg: mensagem, tipoAlerta: alerta});
		$('#notificacao-buscar').show();
		setTimeout(() => {
			$('#notificacao-buscar').fadeOut(1000);						
		}, 2000);
	}

	render() {
		return(
			<div className="container" style={{paddingTop: '30px'}}>
				<Notificacao id="notificacao-buscar" estilo={{marginTop: '70px', marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<h2>Restaurantes</h2>				
				{this.state.restaurantes.map(restaurante => {
					return(
						<div key={restaurante.id} className="restaurante-row" style={{paddingBottom: '16px'}}>
							<Link className="restaurante-link" style={{textDecoration: 'none', color: 'black'}} to={{pathname: '/reservasrestaurante', state: {id: restaurante.id}}}>
								<hr style={{marginTop: '0'}} />
								<div style={{paddingLeft: '10px', paddingRight: '10px'}}>
									<h5 className="card-title">{restaurante.nomefantasia}</h5>
									<div className="row" style={{marginLeft: '0'}}>
										<span style={{fontSize: '90%'}}>{`${restaurante.pessoa.endereco.logradouro}, ${restaurante.pessoa.endereco.numero}, ${restaurante.pessoa.endereco.bairro}, ${restaurante.pessoa.endereco.cidade} - ${restaurante.pessoa.endereco.uf}`}</span>
										<span style={{fontSize: '90%', marginLeft: '15px'}}>|</span>
										<span style={{fontSize: '90%', marginLeft: '15px'}}>{restaurante.pessoa.contato.email}</span>
										<span style={{fontSize: '90%', marginLeft: '15px'}}>|</span>
										<span style={{fontSize: '90%', marginLeft: '15px'}}>{restaurante.pessoa.contato.celular}</span>
									</div>
									<div style={{position: 'relative', float: 'right', marginTop: '-37px'}}><i className="fas fa-chevron-right"></i></div>
								</div>
							</Link>
						</div>
					);
				})
				}
				<hr style={{marginTop: '0'}} />
			</div>
		);
	}
}