const authenticateToken = require('../../modules/Oauth/jwt').authenticateToken;
const checkAuthentication = require('../../modules/Oauth/user').checkAuthentication;
const authenticateAdmin = require('../../modules/Oauth/jwt').authenticateAdmin;
const staff = require('../../modules/mongoDB/staff');

exports.api = (app) => {
    app.route('/api/dashboard/staff').get(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // get data
        res.status(403).send('Not Allowed');
    }).post(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // add new data 
        staff.add(req.body.staff).then(() => {
            res.status(200).send(`${req.body.staff.details.name.givenName} ${req.body.staff.details.name.familyName} was added to your staff list`);
        }).catch((error) => {
            console.error(error);
            res.status(400).send('There was an error while trying to add this staff member')
        });
    }).put(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // update exciting data
        staff.update(req.body.id, req.body.staff).then(() => {
            res.status(200).send(`${req.body.staff.details.name.givenName} ${req.body.staff.details.name.familyName} was updated successfully!`);
        }).catch((error) => {
            console.error(error);
            res.status(400).send('There was an error while trying to update this staff member')
        });
    }).delete(checkAuthentication, authenticateToken, authenticateAdmin, (req, res) => {
        // delete data 
        let errors = 0;
        req.body.selected.map((id) => {
            staff.delete(id).catch((error) => {
                console.error(error);
                errors++;
            })
        });
        if (errors === 0) {
            res.status(200).send('All selected staff member were deleted successfully!');
            return;
        }
        res.status(200).send(`${Number(req.body.selected.length - errors)} out of ${req.body.selected.length} were deleted successfully!`);
    });
}