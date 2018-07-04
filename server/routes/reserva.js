module.exports = app => {
	const api = app.controllers.reserva;

	app.route('/api/reservas')
		.post(api.adiciona)
		.put(api.altera);

	app.route('/api/reservas/:id')
		.get(api.lista)
		.put(api.atualiza)
		.delete(api.deleta);

	app.route('/api/minhasreservas/:id')
		.get(api.minhasReservas);

	app.route('/api/reserva/:id/:restauranteId')
		.get(api.buscaPorId);

	app.route('/api/reserva/:id')
		.get(api.listaReservasDisponiveis);
}