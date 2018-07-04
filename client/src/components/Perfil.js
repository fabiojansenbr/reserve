import React, { Component } from 'react';
import Notificacao from './utils/Notificacao';
import InputCustomizado from './utils/CampoCustomizado';

export default class Perfil extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger'
		};
	}

	componentDidMount() {
	}

	render() {
		return(
			<div>
				<Notificacao id="notificacao-perfil" estilo={{marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<h1 style={{paddingTop: '20px', marginBottom: '40px'}} 
					className="text-center">Meu perfil</h1>
				<div className="row">			
					<div className="col-md-2"></div>
					<form className="col-md-8">
						<div className="row">
							<InputCustomizado className="col-md-6" htmlFor="nome"
								titulo="Nome" tipo="text" id="nome" 
								required="true" nome="nome"
								referencia={(input) => this.nome = input} />
							<InputCustomizado className="col-md-6" htmlFor="sobrenome" 
								titulo="Sobrenome" tipo="text" id="sobrenome" 
								required="true" nome="sobrenome"
								referencia={(input) => this.sobrenome = input} />
						</div>
					</form>
				</div>
			</div>
		);
	}
}