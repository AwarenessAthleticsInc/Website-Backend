const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null && req.method === 'GET') return res.redirect('/login');
    if (token == null && req.method !== 'GET') return res.status(403).send('Failed to authenticate token');
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.redirect('/error/403');
        if (user.id !== req.session.passport.user) {
            return res.status(403).send('Token does not belong to user');
        }
        next();
    })
}
exports.authenticateAdmin = (req, res, next) => {
    if (req.session.user.roles !== 'admin') {
        return res.status(403).send('User does not have the right permissions to preform this action');
    }
    next();
}
exports.authenticateConvener = (req, res, next) => {
    if (req.session.user.roles === 'admin') {
        next();
    } else if (req.session.user.roles !== 'Convener') {
        next();
    } else {
        return res.status(403).send('User does not have the right permissions to preform this action');
    }
}
exports.generateAccessToken = (mongoID) => {
    try {
        return jwt.sign(mongoID, process.env.TOKEN_SECRET, { expiresIn: '24h' });
        /**
        * everytime a user loads the website and they are logged in
        * a new session token will be issues for that user
        */
    } catch (err) {
        console.log(err);
    }

}



/**
 * app.get('/', (req, res) => {
    const token = require('./modules/Oauth/jwt').generateAccessToken({Id: `awhfoh1098324u02quqkkgajkg`});
    res.json(token);
});

app.get('/tokenCheck', authenticateToken, (req, res) => {
   res.send('yay it works')
});
 */