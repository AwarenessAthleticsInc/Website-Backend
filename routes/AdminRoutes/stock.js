const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const stock = require('../../modules/mongoDB/store/stock');

exports.api = (app) => {
    app.route('/api/dashboard/stock').get(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        res.status(403).send('Not Allowed');
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        stock.updateQty(req.body.id, req.body.value).then(() => {
            res.status(200).send('Stock updated successfully!');
        }).catch((error) => {
            res.status(400).send('Stock Failed to update please try again');
        });
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        try {
            req.body.stock.map((id) => {
                stock.delete(id).catch((error) => {
                    console.log(error);
                });
            });
            res.status(200).send('All selected stock was deleted successfully!');
        } catch (error) {
            console.log(error);
            res.status(400).send('Stock Failed to delete please try again');
        }
    });
}