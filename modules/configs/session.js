const session = require("express-session");
const mongoose = require('mongoose');
const mongoStore = require("connect-mongo");

exports.config = (app) => {
    /**
     * Standard session config
     */
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: mongoStore.create({
            mongoUrl: process.env.NODE_ENV === "development" ? process.env.LOCAL_CONNECTION : process.env.MONGOOSE_CONNECTION,
            ttl: 14 * 24 * 60 * 60
        }),
        cookie: {
            secure: false, //change this when production is done { secure: true }
            maxAge: 5184000000 // 60 days
        }
    }));
    mongoose.set('strictQuery', false);

    /**
     *  mongoose connection config
     */ 
    mongoose.connect(process.env.NODE_ENV === "development" ? process.env.LOCAL_CONNECTION : process.env.MONGOOSE_CONNECTION,
        {
            useNewUrlParser: true
        });
}

