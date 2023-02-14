const tournaments = require("../../modules/mongoDB/tournament/tournaments");
const product = require("../../modules/mongoDB/store/products");

exports.api = (app) => {
    app.route('/api/search/:type/:query').get((req, res) => {
        // get data
        switch (req.params.type) {
            case "store":
                product.get(req.params.query).then((array) => {
                    res.status(200).send(array);
                }).catch((error) => {
                    res.status(404).send('failed to find products');
                })
                break;
            default:
                searchAll(req.params.query, res);
                break;
        }
    });
}

const searchAll = (param, res) => {
    try {
        tournaments.get(param).then((array) => {
            res.status(200).send(array);
        });
    } catch (error) {
        console.log(error);
        res.status(400).send("There was an error while trying to search");
    }

}