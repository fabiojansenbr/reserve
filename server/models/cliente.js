export default (sequelize, DataType) => {

    const Cliente = sequelize.define('cliente', {
        id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
        },
        nome: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        sobrenome: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        cpf: {
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

    Cliente.associate = models => {
		const cliente = models.cliente;
		cliente.belongsTo(models.pessoa, {through: 'id'});
    };
    
    return Cliente;
}