const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const Registration = require('../../modules/mongoDB/tournament/registrations');
const Order = require('../../modules/mongoDB/store/invoice');
const Payment = require('../../modules/mongoDB/payment');
const Team = require('../../modules/mongoDB/tournament/teams');
const User = require('../../modules/mongoDB/Users');

exports.api = (app) => {
    app.route('/api/user').get(checkAuthentication, authenticateToken, async (req, res) => {
        const account = req.session.user;
        const registrations = await Registration.getByTeam(`${req.session.user.name.givenName} ${req.session.user.familyName}`, req.session.user.cell);
        const orders = await Order.getByClientsId(req.session.passport.user);
        const registrationPayments = await Promise.all(await registrations.map(async (registration) => {
            const payments = await Payment.getByOrder(registration._id);
            return payments;
        }));
        const orderPayments = await Promise.all(await orders.map((order) => {
            return Payment.getByOrder(order._id).then((payments) => {
                return payments
            });
        }));
        const payments = [...registrationPayments, ...orderPayments];
        res.status(200).send({
            account,
            registrations,
            orders,
            payments
        });
    }).post(authenticateToken, (req, res) => {
        // register a user
        User.register(req, res).then((user) => {
            res.status(200).send("Account created successfully!")
        }).catch((error) => {
            res.status(400).send(error);
        });
    }).put(authenticateToken, (req, res) => {
        // update exciting data 
    }).delete(authenticateToken, (req, res) => {
        // delete data  
        User.logout(req).then(() => {
            res.status(200).send("Logged out");
        }).catch((error) => {
            console.log(error);
            res.status(400).send(error);
        });
    });

    app.route('/api/teamsByUser').post((req, res) => {
        // get data
        Team.getByCapCell(req.body.captain, req.body.cell).then((teams) => {
            res.status(200).send(teams);
        }).catch(() => {
            res.status(404).send("There was an error while trying to get your team");
        })
    });

    app.route('/api/forgotpassword').post((req, res) => {
        //set email with forgot password link
        User.generateToke(req.body.email).then(() => {
            res.status(200).send("A password reset link was sent to your email. Please check your email to continue");
        }).catch((error) => {
            console.log(error);
            res.status(400).send(error);
        })
    });
    app.route('/reset/:token').get((req, res) => {
        //reset email password
        User.tokenCheck(req.params.token).then(() => {
            res.sendFile('/website/build/index.html', { root: './' });
        }).catch((error) => {
            res.status(400).send(error);
        })

    }).post((req, res) => {
        User.resetPassowrd(req.params.token, req.body.password).then(() => {
            res.status(200).send("Your password was reset!");
        }).catch((error) => {
            console.log(error);
            res.status(400).send("There was an error while trying to reset your password");
        })
    });
}