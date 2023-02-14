const shipping = require('../../modules/mongoDB/store/shipping');

exports.api = (app) => {
    app.route('/api/shipping/rates').post((req, res) => {
        // get shipping rates
        shipping.calculateShipping(req.body.address, req.session.cart).then((response) => {
            res.status(200).send(response);
        }).catch((error) => {
            console.log(error);
            res.send(error);
        });
    });
} 
