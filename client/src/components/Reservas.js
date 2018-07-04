import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import Notificacao from './utils/Notificacao';
import { SubmitCustomizado } from './utils/CampoCustomizado';

export default class Reservas extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: '',
			usuario: {},
			reservas: []
		}
	}

	componentWillMount() {
		if (this.props.location.state !== undefined) {
			$('#items-header li').removeClass('active');
			$('#li-cadastrar').addClass('active');			
		}

		this.recebeReservas();		
	}

	componentWillReceiveProps() {
		this.recebeReservas();
	}

	componentWillUnmount() {
		PubSub.unsubscribe('usuario-canal');
	}

	recebeReservas() {
		setTimeout(() => {
			const requestInfo = {
				headers: new Headers({
					'Authorization': `bearer ${localStorage.getItem('auth-token')}`
				})
			};

			if (this.props.usuario !== {}) {
				this.setState({usuario: this.props.usuario});
			} else {
				PubSub.subscribe('usuario-canal', (topico, usuario) => {
					this.setState({usuario});
				});
			}

			fetch(`http://localhost:8080/api/reservas/${this.state.usuario.restauranteId}`, requestInfo)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
					}
				})
				.then(reservas => this.setState({reservas}));
		}, 300);
	}

	mostraMensagem(mensagem, alerta) {
		this.setState({msg: mensagem, tipoAlerta: alerta});
		$('#notificacao-reservas').show();
		setTimeout(() => {
			$('#notificacao-reservas').fadeOut(1000);						
		}, 2000);
	}

	formataData(date) {
		let data = new Date(date);
		let dia = data.getDate();
		let mes = data.getMonth() + 1;
		let ano = data.getFullYear();

		return `${(dia > 9 ? '' : '0') + dia}/${(mes > 9 ? '' : '0') + mes}/${ano}`;
	}

	formataHora(date) {
		let data = new Date(date);
		let hora = data.getHours();
		let minuto = "" + data.getMinutes();

		let pad = "00"
		let ans = pad.substring(0, pad.length - minuto.length) + minuto


		return `${hora}:${ans}`;
	}

	exclui(id) {
		const requestInfo = {
			method: 'DELETE',
			body: JSON.stringify({id: id}),
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		let linha = $('#exclui-reserva-' + id).closest('tr');

		fetch(`http://localhost:8080/api/reservas/${id}`, requestInfo)
			.then(response => {
				if (response.ok) {
					linha.fadeOut(400);
					setTimeout(() => {
						linha.remove();
					}, 400);
					this.setState({reservas: this.state.reservas.filter(r => r.id !== id)});
				} else {
					this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
				}
			})
			.then(() => this.mostraMensagem('A reserva foi excluída com sucesso.', 'success'))
			.catch(() => this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger'));
	}

	render() {
		return(
			<div className="container">
				<Notificacao id="notificacao-reservas" estilo={{marginTop: '70px', marginBottom: '30px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<h2 style={{paddingTop: '30px', marginBottom: '40px'}}
					className="text-center">Reservas</h2>
				<div className="table-responsive">
					<table className="table table-hover">
						<thead>
							<tr>
								<th className="text-center" scope="col">Nº Mesa</th>
								<th className="text-center" scope="col">Data Reserva</th>
								<th className="text-center" scope="col">Hora Ínicio</th>								
								<th className="text-center" scope="col">Hora Fim</th>
								<th className="text-center" scope="col">Confirmada</th>
								<th scope="col"></th>
								<th scope="col"></th>
							</tr>
						</thead>
						<tbody>
							{this.state.reservas.map(reserva => {
								return(
									<tr key={reserva.id}>
										<td align="center">{reserva.numeromesa}</td>
										<td align="center">{this.formataData(reserva.datainicio)}</td>
										<td align="center">{this.formataHora(reserva.datainicio)}</td>
										<td align="center">{this.formataHora(reserva.datafim)}</td>
										<td align="center">{reserva.confirmada ? 'Sim' : 'Não'}</td>
										<td>
											<Link to={{pathname: '/cadastro/edit', state: {id: reserva.id}}}>
												<SubmitCustomizado className="btn btn-outline-info" 
													valor="edita" titulo={<i className="far fa-edit"></i>}/>
											</Link>
										</td>
										<td>
											<SubmitCustomizado id={"exclui-reserva-" + reserva.id} acao={() => this.exclui(reserva.id)} 
												className="btn btn-outline-danger" valor="exclui" titulo={<i className="far fa-trash-alt"></i>} />
										</td>	
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}