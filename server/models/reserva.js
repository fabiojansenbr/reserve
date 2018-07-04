export default (sequelize, DataType) => {

	const Reserva = sequelize.define('reserva', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		numeromesa: {
            type: DataType.INTEGER,
			allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        datainicio: {
            type: DataType.DATE,
			allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        datafim: {
            type: DataType.DATE,
			allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        valorreserva: {
            type: DataType.DECIMAL(10, 2),
			allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        numerolugares: {
            type: DataType.INTEGER,
			allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        confirmada: {
            type: DataType.BOOLEAN
        },
		restauranteId: {
			type: DataType.INTEGER,
			allowNull: false, 
			validate: {
				notEmpty: true
			}
        },
        clienteId: {
			type: DataType.INTEGER
		}
	});

	Reserva.associate = models => {
		const reserva = models.reserva;
        reserva.belongsTo(models.restaurante);
		reserva.belongsTo(models.cliente);        
    };
    
    return Reserva;
}