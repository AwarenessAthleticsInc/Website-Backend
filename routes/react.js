const authenticateToken = require('../modules/Oauth/jwt').authenticateToken;
const authenticateAdmin = require('../modules/Oauth/jwt').authenticateAdmin;
const authenticateConvener = require('../modules/Oauth/jwt').authenticateConvener;
exports.getRoutes = (app) => {
    /**
     * website get routes
     */
    app.get('/', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });
    app.get('/tournaments', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });
    app.get('/store', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });
    app.get('/tournament-of-champions', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });
    app.get('/about-us', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });
    app.get('/rules-info', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });


    /**
     * dashboard get routes
     */
    app.get('/dashboard', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });
    app.get('/dashboard/:reactPage', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });

    /**
     * convener panel get routes
     */
    app.get('/conveners/:reactPage', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });

    /**
     * account routes
     */
    app.get('/login', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });
    app.get('/account', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });

    app.get('/error/404', (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    });
}