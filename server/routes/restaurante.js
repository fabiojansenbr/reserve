module.exports = app => {
    const api = app.controllers.restaurante;

    app.route('/api/restaurantes')
        .get(api.lista);
}