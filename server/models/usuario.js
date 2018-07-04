import bcrypt from 'bcrypt-nodejs';

export default (sequelize, DataType) => {
	const Usuario = sequelize.define('usuario', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		senha: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		nivelAcesso: {
			type: DataType.DECIMAL(1),
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		}
	},
	{
		hooks: {
			beforeCreate: user => {
				const salt = bcrypt.genSaltSync();
				user.set('senha', bcrypt.hashSync(user.senha, salt));
			},
			beforeUpdate: user => {
				if (user._changed.senha) {
					const salt = bcrypt.genSaltSync();
					user.set('senha', bcrypt.hashSync(user.senha, salt));
				}
			}
		}
	});

	Usuario.associate = models => {
		const usuario = models.usuario;		
		usuario.hasOne(models.pessoa, {
			foreignKey: 'usuarioId'
		});
	};

	Usuario.isPassword = (encodedPassword, password) => bcrypt.compareSync(password, encodedPassword)	;
	return Usuario;
}