export default (sequelize, DataType) => {

	const Endereco = sequelize.define('endereco', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		logradouro: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		numero: {
			type: DataType.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		complemento: {
            type: DataType.STRING
		},
		cep: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
		},
		bairro: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
		},
		cidade: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
		},
		uf: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
		pessoaId: {
			type: DataType.INTEGER,
			allowNull: false, 
			validate: {
				notEmpty: true
			}
		}
	});

	Endereco.associate = models => {
		const endereco = models.endereco;
		endereco.belongsTo(models.pessoa);
	};

	return Endereco;
}