import React, { Component } from 'react';
import $ from 'jquery';
import swal from 'sweetalert2';
import PubSub from 'pubsub-js';
import Notificacao from './utils/Notificacao';
import { SubmitCustomizado } from './utils/CampoCustomizado';

export default class ReservasRestaurante extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger',
			usuario: {},
			reservas: []
		};
	}

	componentDidMount() {

		$('#items-header li').removeClass('active');
		$('#li-cadastrar').addClass('active');			

		if (this.props.location.state === undefined) {
			this.props.history.push('/');
		}

		if (this.props.usuario.id !== undefined) {
			this.setState({usuario: this.props.usuario});
		} else {
			PubSub.subscribe('usuario-canal', (topico, usuario) => {
				this.setState({usuario});
			});
		}

		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch(`http://localhost:8080/api/reserva/${this.props.location.state.id}`, requestInfo)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
					}
				})
				.then(reservas => this.setState({reservas}))
				.catch(() => this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger'));
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

		let pad = "00";
		let ans = pad.substring(0, pad.length - minuto.length) + minuto;


		return `${hora}:${ans}`;
	}

	reserva(id) {
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
					'Reservado!',
					'Você pode conferir os dados da sua reserva na aba de reservas.',
					'success'
				).then(() => {
					const requestInfo = {
						headers: new Headers({
							'Content-Type': 'application/json',
							'Authorization': `bearer ${localStorage.getItem('auth-token')}`
						}),
						method: 'PUT',
						body: JSON.stringify({clienteId: this.state.usuario.clienteId})
					};

					let linha = $('#reserva-mesa-' + id).closest('tr');

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
						.catch(error => console.log(error));
				});
			}
		});
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
								<th className="text-center" scope="col">Valor</th>
								<th className="text-center" scope="col">Nº Lugares</th>
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
										<td>
											<SubmitCustomizado id={"reserva-mesa-" + reserva.id} acao={() => this.reserva(reserva.id)} 
												className="btn btn-outline-info" valor="exclui" titulo="Reservar" />
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