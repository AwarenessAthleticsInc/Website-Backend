require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
/**
 * App Setup
 */
const app = express();
app.use(require('compression')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(express.static('./assets'));
app.use(express.static('./build'));


require('./modules/configs/session').config(app);
require('./modules/configs/passport').config(app);

/**
 * Routes
 */
require('./routes/routes').config(app);

const redirectUnmatched = (req, res) => {
    res.redirect('/error/404');
}
app.use(redirectUnmatched);

/**
 * Node Cluster Configuration
 */
require('./modules/configs/cluster').config(app);