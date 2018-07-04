export default (sequelize, DataType) => {

	const Pessoa = sequelize.define('pessoa', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		usuarioId: {
			type: DataType.INTEGER,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		}
	});

	Pessoa.associate = models => {
		const pessoa = models.pessoa;
		pessoa.belongsTo(models.usuario, {through: 'id'});
		pessoa.hasOne(models.cliente, {
			foreignKey: 'pessoaId'
		});
		pessoa.hasOne(models.restaurante, {
			foreignKey: 'pessoaId'
		});
		pessoa.hasOne(models.endereco, {
			foreignKey: 'pessoaId'
		});
		pessoa.hasOne(models.contato, {
			foreignKey: 'pessoaId'
		});
	};

	return Pessoa;
}