const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const orders = require('../../modules/mongoDB/store/invoice');

exports.api = (app) => {
    app.route('/api/dashboard/orders').get((req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        res.status(403).send('Not Allowed');
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        var errors = 0;
        req.body.orders.map((id) => {
            orders.updateStatus(id, req.body.marking).catch((err) => {
                console.log(err);
                errors++;
            });
        });
        if (errors > 0) {
            res.status(200).send(`${error} orders could not be updated. Please try again`);
        }
        res.status(200).send(`All selected orders have an updated status of ${req.body.marking}`);
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        try {
            req.body.selected.map((id) => {
                orders.delete(id).then((response) => {
                    res.status(200).send(response);
                }).catch((error) => {
                    res.status(400).send(error);
                })
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    });
}