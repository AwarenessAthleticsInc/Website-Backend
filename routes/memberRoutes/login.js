const User = require('../../modules/mongoDB/Users');
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const checkPasswordResetToken = require('../../modules/Oauth/resetPasswordTokenAuth').checkPasswordResetToken

exports.api = (app) => {
    app.route('/api/login').post((req, res) => {
        //login a user and send back a token
        User.login(req, res).then((jwtToken) => {
            res.status(200).send(jwtToken);
        }).catch((error) => {
            console.log(error);
            res.status(400).send(error);
        });
    });
    app.route('/api/register').post((req, res) => {
        //register a new user and send back a token
        User.register(req, res).then((user) => {
            res.status(200).send(user)
        }).catch((error) => {
            res.status(400).send(error);
        });
    });

    app.route('/api/authenticate').get(checkAuthentication, (req, res) => {
        try {
            const token = require('../../modules/Oauth/jwt').generateAccessToken({ id: req.session.passport.user });
            res.status(200).send(token);
        } catch(err) {
            console.log(err);
        }
    });

    app.route('/api/forgotpassword').post((req, res) => {
        User.generateToke(req.body.email).then(() => {
            res.status(200).send("Reset email was sent. Please check your email to continue");
        }).catch((error) => {
            res.status(400).send("Failed To make token");
        });
    });

    app.route('/reset/:token').get(checkPasswordResetToken, (req, res) => {
        res.sendFile('/build/index.html', { root: './' });
    }).post(checkPasswordResetToken, (req, res) => {
        User.resetPassowrd(req.params.token, req.body.password).then(() => {
            res.status(200).send("Your password was reset!");
        }).catch((error) => {
            console.log(error);
            res.status(400).send("There was an error while trying to reset your password");
        })
    })
}