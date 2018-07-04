export default (sequelize, DataType) => {

	const Contato = sequelize.define('contato', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		telefone: {
            type: DataType.STRING,
			allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        celular: {
            type: DataType.STRING,
			allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
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

	Contato.associate = models => {
		const contato = models.contato;
		contato.belongsTo(models.pessoa);
    };
    
    return Contato;
}