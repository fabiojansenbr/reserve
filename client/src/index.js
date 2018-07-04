import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './assets/css/reset.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import App from './App';
import Login from './components/Login';
import Logout from './components/Logout';
import CadastroEmpresa from './components/CadastroEmpresa';
import CadastroCliente from './components/CadastroCliente';
import Buscar from './components/Buscar';
import Reservas from './components/Reservas';
import CadastroReserva from './components/CadastroReserva';
import Perfil from './components/Perfil';
import MinhasReservas from './components/MinhasReservas';
import ReservasRestaurante from './components/ReservasRestaurante';
import registerServiceWorker from './registerServiceWorker';

function verificaAutenticacao(component) {
	if (localStorage.getItem('auth-token') === null) {
		return <Redirect to={{pathname: '/login'}} />
	} else {
		return component;
	}
}

ReactDOM.render(
	(<Router>
		<Switch>
			<Route exact path="/" render={props => (verificaAutenticacao(<App {...props}/>))} />
			<Route path="/login" render={props => 
				localStorage.getItem('auth-token') === null ? <Login {...props} /> : <Redirect to="/" />} />
			<Route path="/logout" component={Logout} />
			<Route path="/usuario/empresa" component={CadastroEmpresa} />
			<Route path="/usuario/cliente" component={CadastroCliente} />
			<Route path="/buscar" render={props => (verificaAutenticacao(<App {...props} children={<Buscar {...props}/>} />))} />
			<Route path="/reservas" render={props => (verificaAutenticacao(<App {...props} children={<Reservas {...props}/>} />))} />
			<Route path="/cadastro" render={props => (verificaAutenticacao(<App {...props} children={<CadastroReserva {...props}/>} />))} />		
			<Route path="/perfil" render={props => (verificaAutenticacao(<App {...props} children={<Perfil {...props}/>} />))} />					
			<Route path="/minhasreservas" render={props => (verificaAutenticacao(<App {...props} children={<MinhasReservas {...props}/>} />))} />					
			<Route path="/reservasrestaurante" render={props => (verificaAutenticacao(<App {...props} children={<ReservasRestaurante {...props}/>} />))} />								
			<Route path="/*" render={() => (<Redirect to={'/'}/>)} />				
		</Switch>
	</Router>)
	, document.getElementById('root')
);
registerServiceWorker();
