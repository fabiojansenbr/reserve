import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../assets/css/header.css';

export default class Header extends Component {

	componentDidMount() {
		$('#items-header li').click(function() {
			$('#items-header li').removeClass('active');

			if (!$(this).hasClass('active')) {
				$(this).addClass('active');
			}
		});

		$('.navbar-brand').click(() => {
			$('#items-header li').removeClass('active');
		});
	}

	render() {
		return(
			<nav key={1} className="navbar navbar-expand-md navbar-dark bg-dark">
				<Link className="navbar-brand" to={'/'}>Reserve</Link>
				<button id="botao-menu" className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-conteudo"
					aria-controls="navbar-conteudo" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbar-conteudo">
					{this.props.usuario.nivelAcesso === 2 ? (
						<ul id="items-header" className="nav navbar-nav mr-auto">
							<li className="nav-item active">
								<Link className="nav-link" to={'/buscar'}>Buscar<span className="sr-only">(current)</span></Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to={'/minhasreservas'}>Reservas</Link>
							</li>
						</ul> ) : (
						<ul id="items-header" className="navbar-nav mr-auto">
							<li id="li-cadastrar" className="nav-item active">
								<Link className="nav-link" to={'/cadastro'}>Cadastrar<span className="sr-only">(current)</span></Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to={'/reservas'}>Listar</Link>
							</li>
						</ul>
					)}

					<span>Olá, {this.props.usuario.nivelAcesso === 1 ? this.props.usuario.nomefantasia : this.props.usuario.nome}</span>

					<ul className="navbar-nav">					
						<li className="nav-item dropdown">
							<Link className="nav-link dropdown-toggle" to={''} id="perfil-dropdown" 
								role="button" data-toggle="dropdown" 
								aria-haspopup="true" aria-expanded="false">
								<i className="far fa-user fa-lg" style={{marginLeft: '20px'}}></i>
							</Link>
							<div className="dropdown-menu dropdown-menu-right" aria-labelledby="perfil-dropdown">
								<Link className="dropdown-item" to={'/perfil'}>Meu perfil</Link>
								<div className="dropdown-divider"></div>
								<Link className="dropdown-item" to={'/logout'}>Sair</Link>
							</div>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}