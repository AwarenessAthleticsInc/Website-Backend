const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const Payment = require('../../modules/mongoDB/payment');

exports.api = (app) => {
    app.post('/api/payments', (req, res) => {
        //add a new payments
        try {
            req.body.ids.map((id) => {
                Payment.add(id,
                    req.body.paymentData ? req.body.paymentData.id : 'Manual',
                    req.body.paymentData ? req.body.paymentData.status : 'Paid',
                    req.body.paymentData ? req.body.paymentData.purchase_units[0].amount.value : req.body.amount,
                    req.body.paymentData ? req.body.paymentData.purchase_units[0].amount.currency_code : 'CAD',
                    req.body.paymentData ? req.body.paymentData.create_time : new Date().toDateString(),
                    req.body.type).then(() => {
                        return;
                    }).catch(() => {
                        return;
                    });
            });
            res.status(200).send('All payments were added');
        } catch {
            res.status(400).send('Failed to update all payments');
        }
    });
    //admin User Route
    app.route('/api/payments').put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
    });
}