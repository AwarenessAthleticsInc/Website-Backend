const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const products = require('../../modules/mongoDB/store/products');
const stock = require('../../modules/mongoDB/store/stock');

exports.api = (app) => {
    app.route('/api/dashboard/products').get(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // get data
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        products.get(req.body.query).then((products) => {
            res.status(200).send(products);
        }).catch((error) => {
            res.status(400).send(error);
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        try {
            products.add(req.body.product).then((product) => {
                const productID = product._id;
                req.body.stock.map((stockItem) => {
                    stock.add(productID, stockItem.name, stockItem.size, stockItem.color, stockItem.stock).catch((error) => {
                        console.log(error);
                    });
                });
            }).catch((error) => {
                console.log(error);
                res.status(400).send(`Failed to add ${req.body.product.name} to your store. Please try again`);
            });
            res.status(200).send(`${req.body.product.name} was successfully add to your store`);
        } catch (error) {
            console.log(error);
            res.status(400).send(`Failed to add ${req.body.product.name} to your store. Please try again`);
        }
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        try {
            req.body.selected.map((id) => {
                products.delete(id).then((response) => {
                    res.status(200).send('Selected Products were deleted successfully.');
                }).catch((error) => {
                    res.status(400).send(error);
                });
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    });

    app.route('/api/dashboard/products/:id').put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        try {
            products.update(req.params.id, req.body.product).then((product) => {
                req.body.stock.map((stockItem) => {
                    stock.update(stockItem._id, stockItem.ItemID, stockItem.name, stockItem.size, stockItem.color, stockItem.stock).catch((error) => {
                        console.log(error);
                    });
                });
            }).catch((error) => {
                console.log(error);
                res.status(400).send(`Failed to add ${req.body.product.name} to your store. Please try again`);
            });
            res.status(200).send(`${req.body.product.name} was successfully add to your store`);
        } catch (error) {
            console.log(error);
            res.status(400).send(`Failed to add ${req.body.product.name} to your store. Please try again`);
        }
    });
}