/**
 * Bearer Token Routes
 */
const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
//Standard User Route
exports.api = (app) => {
    app.route('/').get(checkAuthentication, authenticateToken, (req, res) => {
        // get data
    }).post(authenticateToken, (req, res) => {
        // add new data 
    }).put(authenticateToken, (req, res) => {
        // update exciting data
    }).delete(authenticateToken, (req, res) => {
        // delete data 
    });
}
//admin User Route
exports.api = (app) => {
    app.route('/').get(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // get data
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
    });
}
//Convner User Route
exports.api = (app) => {
    app.route('/').get(checkAuthentication, authenticateToken, authenticateConvner, (req, res) => {
        // get data
    }).post(authenticateToken, (req, res) => {
        // add new data 
    }).put(authenticateToken, (req, res) => {
        // update exciting data
    }).delete(authenticateToken, (req, res) => {
        // delete data 
    });
}


/**
 * Standard Routes
 */
exports.api = (app) => {
    app.route('/').get((req, res) => {
        // get data
    }).post((req, res) => {
        // add new data 
    }).put((req, res) => {
        // update exciting data
    }).delete((req, res) => {
        // delete data 
    });
}