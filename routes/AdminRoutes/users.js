const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const users = require('../../modules/mongoDB/Users');

exports.api = (app) => {
    app.route('/api/dashboard/users').get(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        users.search(req.body.query).then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            console.log(error);
            res.status(400).send('There was an error while trying to get users');
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        var error = 0;
        try {
            req.body.selected.map((id) => {
                users.updateRole(id, req.body.role).then(() => {
                    if (error === 0) {
                        res.status(200).send(`All selected users have been change to ${req.body.role}`);
                        return;
                    }
                    res.status(200).send(`Only ${Number(req.body.ids.length) - error} out of ${req.body.ids.length} where update to ${req.body.role} successfilly please try again`);
                }).catch((error) => {
                    console.error(error);
                    res.status(400).send('There was an error while trying to update the selected users roles');
                });
            });
        } catch (error) {
            console.error(error);
            res.status(400).send(`There was an error while trying to upodate these user(s).`);
        }
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        var error = 0;
        try {
            req.body.selected.map((id) => {
                users.delete(id).catch((error) => {
                    console.log(error);
                    error++
                });
            });
            if (error === 0) {
                res.status(200).send("All selected users were deleted successfully");
                return;
            }
            res.status(200).send(`Only ${Number(req.body.ids.length) - error} out of ${req.body.ids.length} where deleted successfilly please try again`);
        } catch (error) {
            console.error(error);
            res.status(400).send(`There was an error while trying to delete these user(s).`);
        }
    });

    app.route('/api/dashboard/user/setPassword').put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        users.setPassword(req.body.data.username, req.body.password).then(() => {
            res.status(200).send(`${req.body.data.name.givenName} ${req.body.data.name.familyName}'s password was update successfully!`);
        }).catch((error) => {
            console.error(error);
            res.status(400).send(`There was an error while trying to update ${req.body.data.name.givenName} ${req.body.data.name.familyName}'s password`);
        });
    });
}