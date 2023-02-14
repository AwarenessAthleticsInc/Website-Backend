const passport = require("passport");
const User = require('../mongoDB/Users');

exports.config = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(User.model.createStrategy());
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.model.findById(id, function (err, user) {
            done(err, user);
        });
    });
}