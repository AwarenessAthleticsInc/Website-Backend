const User = require('../mongoDB/Users');

exports.checkPasswordResetToken = (req, res, next) => {
    User.tokenCheck(req.params.token).then(() => {
        next();
    }).catch((error) => {
        res.status(400).send(error);
    });
}