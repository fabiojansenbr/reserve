import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import InputMask from 'react-input-mask';

export class SubmitCustomizado extends Component {

	render() {
		return(
			<button id={this.props.id} onClick={this.props.acao} 
				style={this.props.estilo} type={this.props.tipo} 
				className={this.props.className} value={this.props.valor}>
				{this.props.titulo}
			</button>
		);
	}
}

export default class InputCustomizado extends Component {

	constructor() {
		super();
		this.state = {msgErro: ''};
	}

	componentDidMount() {
		PubSub.subscribe('erro-validacao', (topico, erro) => {
			if (erro.field === this.props.nome) {
				this.setState({msgErro: erro.message});	
			}
		});

		PubSub.subscribe('limpa-erros', topico => {
			this.setState({msgErro: ''});
		});
	}

	componentWillUnmount() {
		PubSub.unsubscribe('erro-validacao');
		PubSub.unsubscribe('limpa-erros');
	}

	render() {
		return(
			<div className={'form-group ' + this.props.className}>
				<label htmlFor={this.props.htmlFor}>{this.props.titulo}</label>
				<InputMask mask={this.props.mascara} type={this.props.tipo} 
					className="form-control" id={this.props.id} 
					required={this.props.required} name={this.props.nome}
					disabled={this.props.disabled} step={this.props.step}
					maxLength={this.props.maxlength} ref={this.props.referencia} 
					placeholder={this.props.placeholder} />
				<span className="error">{this.state.msgErro}</span>
			</div>
		);
	}
}