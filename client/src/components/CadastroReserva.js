import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import InputCustomizado, { SubmitCustomizado } from './utils/CampoCustomizado';

export default class CadastroReserva extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger',
			mostra: 1,
			id: 0,
			usuario: {}
		};
	}

	componentDidMount() {
		if (this.props.location.state !== undefined) {
			$('#items-header li').removeClass('active');
			$('#li-cadastrar').addClass('active');			
		}

		setTimeout(() => {		
			const requestInfo = {
				headers: new Headers({
					'Authorization': `bearer ${localStorage.getItem('auth-token')}`
				})
			};

			if (this.props.usuario.id !== undefined) {
				this.setState({usuario: this.props.usuario});
			} else {
				PubSub.subscribe('usuario-canal', (topico, usuario) => {
					this.setState({usuario});
				});
			}

			if (this.props.location.state !== undefined && this.state.usuario.restauranteId !== undefined) {
				fetch(`http://localhost:8080/api/reserva/${this.props.location.state.id}/${this.state.usuario.restauranteId}`, requestInfo)
					.then(response => {
						if (response.ok) {
							return response.json();
						} else {
							this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger');
						}
					})
					.then(result => {
						this.setState({id: result.id});
						this.numeromesa.input.value = result.numeromesa;
					})
					.catch(() => this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger'));
			}
		}, 300);
	}

	componentWillUnmount() {
		PubSub.unsubscribe('usuario-canal');
	}

	envia(event) {
		event.preventDefault();

		const requestInfo = {
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.state.id === 0) {
			requestInfo.method = 'POST';
			requestInfo.body = JSON.stringify({
				numeromesa: this.numeromesa.input.value,
				datareserva: this.datareserva.input.value,
				horainicio: this.horainicio.input.value,
				horafim: this.horafim.input.value,
				valorreserva: this.valorreserva.input.value,
				numerolugares: this.numerolugares.input.value,
				restauranteId: this.props.usuario.restauranteId
			});
		} else {
			requestInfo.method = 'PUT';
			requestInfo.body = JSON.stringify({
				id: this.state.id,
				numeromesa: this.numeromesa.input.value,
				datareserva: this.datareserva.input.value,
				horainicio: this.horainicio.input.value,
				horafim: this.horafim.input.value,
				valorreserva: this.valorreserva.input.value,
				numerolugares: this.numerolugares.input.value,
				restauranteId: this.props.usuario.restauranteId
			});
		}

		this.setState({mostra: 1});

		fetch('http://localhost:8080/api/reservas', requestInfo)
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
				if (result !== undefined) {
					this.mostraMensagem('Dados gravados com sucesso.', 'success');
					this.limpaForm();					
				}
			})
			.catch(() => this.mostraMensagem('Não foi possível acessar o recurso no sistema.', 'danger'));
	}

	limpaForm() {
		this.numeromesa.input.value = ''; 
		this.datareserva.value = '';
		this.datareserva.input.value = '';
		this.horainicio.value = '';
		this.horainicio.input.value = '';
		this.horafim.value = '';
		this.horafim.input.value = '';
		this.valorreserva.input.value = '';
		this.numerolugares.input.value = '';
	}

	mostraMensagem(mensagem, alerta) {
		this.setState({msg: mensagem, tipoAlerta: alerta});
		$('#notificacao-cadastro-reserva').show();
		setTimeout(() => {
			$('#notificacao-cadastro-reserva').fadeOut(1000);						
		}, 2000);
	}

	render() {
		return(
			<div className="container">
				<Notificacao id="notificacao-cadastro-reserva" estilo={{marginTop: '70px', marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<h2 style={{paddingTop: '30px', marginBottom: '40px'}}
					className="text-center">Cadastro de Reserva</h2>
				<div className="row">
					<div className="col-md-2"></div>
					<form onSubmit={this.envia.bind(this)} className="row col-md-8">
						<InputCustomizado htmlFor="numeromesa" titulo="Nº Mesa (para identificação)" className="col-md-5"
							tipo="number" id="numeromesa" required="true" nome="numeromesa"
							referencia={(input) => this.numeromesa = input}
							placeholder="Informe o nº da mesa" />
						<div className="row col-md-12">
							<InputCustomizado htmlFor="datareserva" titulo="Data da Reserva" className="col-md-6"
								tipo="text" id="datareserva" required="true" nome="datareserva"
								referencia={(input) => this.datareserva = input} mascara="99/99/9999"
								placeholder="Informe a data da reserva" />
							<InputCustomizado htmlFor="horainicio" titulo="Hora Ínicio" className="col-md-3"
								tipo="text" id="horainicio" required="true" nome="horainicio"
								referencia={(input) => this.horainicio = input} mascara="99:99"
								placeholder="Ínicio" />
							<InputCustomizado htmlFor="horafim" titulo="Hora Fim" className="col-md-3"
								tipo="text" id="horafim" required="true" nome="horafim"
								referencia={(input) => this.horafim = input} mascara="99:99"
								placeholder="Fim" />
						</div>
						<div className="row col-md-12">
							<InputCustomizado htmlFor="valorreserva" titulo="Valor da Reserva" className="col-md-6"
								tipo="number" id="valorreserva" required="true" nome="valorreserva"
								referencia={(input) => this.valorreserva = input}
								placeholder="Informe o valor da mesa" />
							<InputCustomizado htmlFor="numerolugares" titulo="Nº de Lugares" className="col-md-3"
								tipo="number" id="numerolugares" required="true" nome="numerolugares"
								referencia={(input) => this.numerolugares = input}
								placeholder="Nº lugares" />
						</div>
						<div className="form-group col-md-12 text-center" style={{marginTop: '20px'}}>
							<SubmitCustomizado tipo="submit"
								className="btn btn-lg btn-block btn-success" valor="salva" titulo="Gravar" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}