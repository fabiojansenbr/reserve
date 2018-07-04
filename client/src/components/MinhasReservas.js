import React, { Component } from 'react';
import $ from 'jquery';
import swal from 'sweetalert2';
import PubSub from 'pubsub-js';
import Notificacao from './utils/Notificacao';
import { SubmitCustomizado } from './utils/CampoCustomizado';

export default class MinhasReservas extends Component{

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger',
			usuario: {},
			reservas: [],
			mostra: 1
		};
	}

	componentDidMount() {
		if (this.props.usuario.id !== undefined) {
			this.setState({usuario: this.props.usuario});
		} else {
			PubSub.subscribe('usuario-canal', (topico, usuario) => {
				this.setState({usuario});
			});
		}
		
		this.atualizaReservas();
	}

	atualizaReservas() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};
		
		setTimeout(() => {
			fetch(`http://localhost:8080/api/minhasreservas/${this.state.usuario.clienteId}`, requestInfo)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
					}
				})
				.then(reservas => this.setState({reservas}))
				.catch(() => this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger'));
		}, 400);
	}

	mostraMensagem(mensagem, alerta) {
		this.setState({msg: mensagem, tipoAlerta: alerta});
		$('#notificacao-minhasreservas').show();
		setTimeout(() => {
			$('#notificacao-minhasreservas').fadeOut(1000);						
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

		let pad = "00";
		let ans = pad.substring(0, pad.length - minuto.length) + minuto;


		return `${hora}:${ans}`;
	}

	paga(id) {
		swal({
			title: 'Você tem certeza?',
			text: "Confirmar reserva da mesa.",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sim, estou de acordo.',
			cancelButtonText: 'Não, cancelar.'
		}).then((result) => {
			if (result.value) {
				swal(
					'Confirmado!',
					'A reserva será confirmada em seu nome no restaurante.',
					'success'
				).then(() => {
					const requestInfo = {
						headers: new Headers({
							'Content-Type': 'application/json',
							'Authorization': `bearer ${localStorage.getItem('auth-token')}`
						}),
						method: 'PUT',
						body: JSON.stringify({confirmada: true})
					};

					fetch(`http://localhost:8080/api/reservas/${id}`, requestInfo)
						.then(response => {
							if (response.ok) {
								return response.json();
							} else {
								this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
							}
						})
						.then(result => {
							if (result[0] !== 0) {
								this.atualizaReservas();
							} else {
								this.mostraMensagem('A reserva já está confirmada, não foi possível realizar a confirmação.', 'danger')
							}
						})
						.catch(error => this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger'));
				});
			}
		});
	}

	cancela(id) {
		swal({
			title: 'Você tem certeza?',
			text: "Cancelar reserva da mesa.",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sim, estou de acordo.',
			cancelButtonText: 'Não, cancelar.'
		}).then((result) => {
			if (result.value) {
				swal(
					'Confirmado!',
					'A reserva será excluída da sua lista.',
					'success'
				).then(() => {
					const requestInfo = {
						headers: new Headers({
							'Content-Type': 'application/json',
							'Authorization': `bearer ${localStorage.getItem('auth-token')}`
						}),
						method: 'PUT',
						body: JSON.stringify({clienteId: null})
					};

					let linha = $('#cancela-reserva-' + id).closest('tr');
					this.setState({mostra: 1});

					fetch(`http://localhost:8080/api/reservas/${id}`, requestInfo)
						.then(response => {
							if (response.ok) {
								return response.json();
							} else if (response.status === 400) {
								this.setState({mostra: 0});
								return response.json();
							} else {
								this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
							}
						})
						.then(result => {
							if (result.msg !== undefined) {
								this.mostraMensagem(result.msg, 'danger');	
							}else if (result[0] !== 0) {
								linha.fadeOut(400);
								setTimeout(() => {
									linha.remove();
								}, 400);
								this.setState({reservas: this.state.reservas.filter(r => r.id !== id)});
							} else {
								this.mostraMensagem('A reserva já está confirmada, não foi possível realizar o cancelamento.', 'danger')
							}
						})
						.catch(() => this.state.mostra === 1 ? this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger') : null);
				});
			}
		});
	}

	render() {
		return(
			<div className="container">
				<Notificacao id="notificacao-minhasreservas" estilo={{marginTop: '70px', marginBottom: '30px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<h2 style={{paddingTop: '30px', marginBottom: '40px'}}
					className="text-center">Minhas Reservas</h2>
				<div className="table-responsive">
					<table className="table table-hover">
						<thead>
							<tr>
								<th className="text-center" scope="col">Nº Mesa</th>
								<th className="text-center" scope="col">Data Reserva</th>
								<th className="text-center" scope="col">Hora Ínicio</th>								
								<th className="text-center" scope="col">Hora Fim</th>
								<th className="text-center" scope="col">Valor</th>
								<th className="text-center" scope="col">Nº Lugares</th>
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
										<td align="center">R$ {reserva.valorreserva}</td>
										<td align="center">{reserva.numerolugares}</td>
										<td align="center">{reserva.confirmada ? 'Sim' : 'Não'}</td>
										<td>
											<SubmitCustomizado id={"reserva-mesa-" + reserva.id} acao={() => this.paga(reserva.id)} 
												className="btn btn-outline-success" valor="exclui" titulo={<i className="fas fa-money-bill-wave"></i>} />
										</td>
										<td>
											<SubmitCustomizado id={"cancela-reserva-" + reserva.id} acao={() => this.cancela(reserva.id)} 
												className="btn btn-outline-danger" valor="exclui" titulo={<i className="fas fa-ban"></i>} />
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