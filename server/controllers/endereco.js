import HttpStatus from 'http-status';

module.exports = app => {
    const api = {};
    const { endereco } = app.database.models;

    api.validaDados = dados => {
        let erros = [];
        
        if (dados.logradouro.length < 1) { 
			erros.push({field: 'logradouro', message: 'Você deve informar um logradouro.'});
		}

		if (dados.numero.length < 1) { 
			erros.push({field: 'numero', message: 'Você deve informar um número.'});
		}

		// contando . e -
		if (dados.cep.replace('_', '').length < 10) { 
			erros.push({field: 'cep', message: 'O CEP deve ser informado no formato XX.XXX-XXX.'});
		}

		if (dados.bairro.length < 1) { 
			erros.push({field: 'bairro', message: 'Você deve informar um bairro.'});
		}

		if (dados.cidade.length < 1) { 
			erros.push({field: 'cidade', message: 'Você deve informar uma cidade.'});
		}

		if (dados.uf.length < 1) { 
			erros.push({field: 'uf', message: 'Você deve informar uma UF.'});
		}

        return erros;
    }

    api.adiciona = (dados, res) => {
        
        endereco.create(dados)
            .then(result => result)
            .catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
    }

    return api;
}