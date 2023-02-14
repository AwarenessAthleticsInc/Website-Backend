const Orders = require('../../modules/mongoDB/store/invoice');
const Payments = require('../../modules/mongoDB/payment');
const Stock = require('../../modules/mongoDB/store/stock');
const email = require('../../modules/mail/email');

exports.api = (app) => {
    app.route('/api/orders/').post(async (req, res) => {
        // add new order
        var clientEmt = {}
        if (req.session.user) {
            clientEmt = {
                account: {
                    id: req.session.user._id,
                    name: {
                        givenName: req.session.user.name.givenName,
                        middleName: req.session.user.name.middleName,
                        familyName: req.session.user.name.familyName
                    },
                    username: req.session.user.username,
                    cell: req.session.user.phones
                },
                shippingAddress: req.body.shippingAddress,
                billingAddress: req.body.billingAddress
            };
        } else {
            clientEmt = {
                account: {
                    id: 'Manual',
                    name: {
                        givenName: req.body.billingAddress.firstName,
                        familyName: req.body.billingAddress.lastName
                    },
                    username: req.body.billingAddress.email,
                    cell: 'N/A'
                },
                shippingAddress: req.body.shippingAddress,
                billingAddress: req.body.billingAddress
            };
        }
        const orderEmt = {
            items: req.session.cart.items,
            totalQty: req.session.cart.totalQty,
            subtotal: req.session.cart.totalPrice
        };
        const shippingEmt = {
            carrier: `${req.body.shipping.shipper} (${req.body.shipping.rate})`,
            weight: req.session.cart.totalWeight,
            total: req.body.shipping.cost
        };
        const invoiceEmt = await Orders.create(new Date(), clientEmt, orderEmt, shippingEmt, Number(Number(req.body.cart.totalPrice) + Number(req.body.shipping.cost)), "new").then((invoice) => {
            return invoice;
        }).catch((error) => {
            console.log(error);
            res.status(400).send("There was an error while trying to place your order");
        });
        for (var i = 0; i < req.session.cart.items.length; i++) {
            Stock.sell(req.session.cart.items[i].color, req.session.cart.items[i].size, req.session.cart.items[i].name, req.session.cart.items[i].qty).then((stock) => {
                return stock;
            }).catch((error) => {
                console.log(error);
            });
        }
        req.session.cart = null;
        req.session.save();
        try {
            email.EmailStoreNotification(invoiceEmt);
            email.EmailReceipt(invoiceEmt, clientEmt.account.username);
        } catch (error) {
            console.log(error);
        }

        res.status(200).send(invoiceEmt._id);
    });
}