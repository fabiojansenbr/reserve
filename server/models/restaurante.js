export default (sequelize, DataType) => {

    const Restaurante = sequelize.define('restaurante', {
        id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
        },
        razaosocial: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        nomefantasia: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        cnpj: {
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

    Restaurante.associate = models => {
		const restaurante = models.restaurante;
		restaurante.belongsTo(models.pessoa);
    };
    
    return Restaurante;
}