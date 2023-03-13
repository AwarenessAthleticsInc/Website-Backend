const email = require('../mail/email');
const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require("mongoose-findorcreate");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    startDate: Date,
    username: String,
    password: String,
    name: {
        givenName: String,
        middleName: String,
        familyName: String
    },
    phone: String,
    DateOfBirth: Date,
    roles: String,
    photos: Array,
    profileImage: String,
    team: {
        name: String,
        status: String,
        notes: String
    },
    address: Array,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
exports.model = User;

/**
 * Login / Register
 */
exports.register = (req, res) => {
    return new Promise((resolve, reject) => {
        // check to see if user already has an account
        User.find({
            username: req.body.username
        }, function (error, userCheck) {
            if (userCheck.length > 0) {
                console.log(error);
                reject("A User with this email already excits!");
                return;
            }
        });
        //start registraion process
        User.register({
            username: req.body.username,
            active: false
        }, req.body.password, function (err, user) {
            if (err) {
                console.log("Date: " + Date() + "\n File: users.js module:\n" + err);
                reject("A User with this email already exists within our system.");
            }
            User.updateOne({
                username: user.username
            }, {
                startDate: new Date(),
                name: {
                    familyName: req.body.lastName,
                    givenName: req.body.firstName
                },
                phone: req.body.phone,
                roles: "Standard"
            }, function (err, updatedUser) {
                if (err) {
                    console.log("Date: " + Date() + "\n File: users.js module:\n" + err);
                    reject("Could not update your account details. Please login and change your details manually");
                }
                generateConfirmationToken(user.username); // will be used when wanting to confirm user accounts
                try {
                    findTeamAndAdd(user.username);
                } catch {
                    return;
                }
                User.findOne({
                    username: user.username
                }, function (err, foundUser) {
                    req.session.user = foundUser;
                    req.session.save(function (saveError) {
                        if (saveError) {
                            reject("There was an error while trying to session your user account. Please ensure your browser allows cookies");
                        }
                        passport.authenticate("local")(req, res, function () {
                            const token = require('./modules/Oauth/jwt').generateAccessToken({ id: req.session.passprt.user });
                            resolve(token);
                        });
                    });
                });
            });
        });
    });
}

exports.login = (req, res) => {
    return new Promise((resolve, reject) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        User.findOne({ username: user.username }).then((user) => {
            if (!user) {
                reject(`No account with the email ${user.username} exists. Please click here to register`);
            }
        }).catch((error) => {
            reject(`No account with the email ${user.username} exists. Please click here to register`);
        });
        try {
            findTeamAndAdd(user.username);
        } catch(error) {
            return console.log(error);
        }

        req.login(user, function (err) {
            if (err) {
                console.log("Date: " + Date() + "\n File: users.js module:\n" + err);
                reject(req.body.username + " does NOT have an spfa account please register your account");
                return;
            }
            passport.authenticate("local")(req, res, function () {
                User.findOne({
                    username: req.body.username
                }, function (err, foundUser) {
                    if (err) {
                        onsole.log("Date: " + Date() + "\n File: users.js module:\n" + err);
                        reject(req.body.username + " does NOT have an spfa account please register your account");
                    }
                    req.session.user = foundUser;
                    req.session.save(function (saveError) {
                        if (saveError) {
                            onsole.log("Date: " + Date() + "\n File: users.js module:\n" + saveError);
                            reject("There was an error while trying to session this user. Please ensure your browser allows cookies");
                        }
                        const token = require('../Oauth/jwt').generateAccessToken({ id: req.session.passport.user });
                        resolve(token);
                    });
                });
            });
        });
    });
}

exports.logout = (req) => {
    return new Promise((resolve, reject) => {
        req.session.user = null;
        req.session.save((error) => {
            if (error) {
                reject(error);
            }
        });
        req.logout();
        resolve("User was logged out successfully");
    });
}

/**
 * Password Management
 */
const generateConfirmationToken = (username) => {
    return new Promise(async (resolve, reject) => {
        const token = require('crypto').randomBytes(64).toString('hex');
        User.findOneAndUpdate({
            username: username
        }, {
            confirmToken: token,
        }).then((user) => {
            email.sendConfirmationToken(token, username, user.name.givenName);
        }).catch((error) => {
            reject(error);
        });
    });
}
exports.resetPassowrd = (token, password) => {
    return new Promise(async (resolve, reject) => {
        const username = await User.findOne({
            resetPasswordToken: token
        }).then((user) => {
            return user.username;
        }).catch((error) => {
            reject(error);
        });
        User.findByUsername(username).then(function (sanitizedUser) {
            if (sanitizedUser) {
                sanitizedUser.setPassword(password, function () {
                    sanitizedUser.save();
                    resolve("password reset successful");
                });
            } else {
                reject("This user does not exist");
            }
        },
            function (err) {
                reject(err);
            });
    });
}
exports.changePassword = (username, oldPassword, password) => {
    return new Promise(async (resolve, reject) => {
        User.findByUsername(username).then(function (sanitizedUser) {
            if (sanitizedUser) {
                sanitizedUser.changePassword(oldPassword, password, function (error) {
                    if (error) {
                        if (error.contains("Incorrect password")) {
                            reject("Current password field didn't match please double check you have entered your current password correctly");
                        }
                        console.log(error);
                        reject("There was an error while trying to change your password");
                    }
                    sanitizedUser.save();
                    resolve("password changed successfully!");
                });
            } else {
                reject("This user does not exist");
            }
        },
            function (err) {
                reject(err);
            });
    });
}
exports.setPassword = (username, password) => {
    return new Promise(async (resolve, reject) => {
        User.findByUsername(username).then(function (sanitizedUser) {
            if (sanitizedUser) {
                sanitizedUser.setPassword(password, function (error) {
                    if (error) {
                        if (error.contains("Incorrect password")) {
                            reject("Current password field didn't match please double check you have entered your current password correctly");
                        }
                        console.log(error);
                        reject("There was an error while trying to change your password");
                    }
                    sanitizedUser.save();
                    resolve("password changed successfully!");
                });
            } else {
                reject("This user does not exist");
            }
        },
            function (err) {
                reject(err);
            });
    });
}
exports.generateToke = (username) => {
    return new Promise(async (resolve, reject) => {
        const token = await makeToken();
        User.findOneAndUpdate({
            username: username
        }, {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000
        }).then((user) => {
            return user;
        }).catch((error) => {
            reject(error)
        });
        const user = await User.findOne({
            username: username
        }).then((user) => {
            return user
        });
        email.resetPassowrdEmail(token, user.username, user.name.givenName);
        resolve(user);
    });
}
exports.tokenCheck = (token) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            resetPasswordToken: token
        }).then((user) => {
            const date = new Date();
            const expire = new Date(user.resetPasswordExpires);
            if (date.getTime() < expire.getTime()) {
                resolve("true");
            } else {
                reject("Token as expired and is no longer active");
            }
        }).catch((err) => {
            reject("Token does not exsit");
        })
    });
}
const makeToken = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(20, function (err, buf) {
            if (err) {
                reject(err);
            }
            resolve(buf.toString('hex'))
        });
    });
}
/**
 * C.R.U.D
 */

//create

//read
exports.search = (query) => {
    return new Promise((resolve, reject) => {
        User.find({
            $or: [{
                "name.givenName": {
                    $regex: query,
                    $options: "i"
                }
            },
            {
                "name.familyName": {
                    $regex: query,
                    $options: "i"
                }
            },
            {
                "username": {
                    $regex: query,
                    $options: "i"
                }
            },
            {
                "phone": {
                    $regex: query,
                    $options: "i"
                }
            }
            ]
        }).lean().then((userList) => {
            resolve(userList);
        }).catch((error) => {
            reject(error);
        });
    });
}
exports.getAll = () => {
    return new Promise((resolve, reject) => {
        User.find({}).sort("name.givenName").then((users) => {
            resolve(users);
        }).catch((error) => {
            reject(error);
        });
    });
}
//update
exports.updateProfilePicture = (id, imagePath) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            profileImage: imagePath
        }).then((user) => {
            resolve("Profile Image for " + user.name.givenName + " was updated successfully");
        }).catch((error) => {
            reject(error);
        });
    });
}
exports.updateRole = (id, role) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, {
            roles: role
        }).then((user) => {
            resolve("Udated successful");
        }).catch((error) => {
            reject(error);
        });
    });
}
//delete
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndDelete(id).then(() => {
            resolve("User was deleted successfully!");
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 * Team Management
 */
const team = require('./tournament/teams');
const findTeamAndAdd = (username) => {
    User.find({ username: username }).then((user) => {
        const name = user[0].name.givenName + " " + user[0].name.familyName;
        team.getByCapCell(name, user[0].phone).then(async (team) => {
            if (team[0] === null) {
                return;
            }
            if (team.length > 0) {
                const newUser = await User.findOneAndUpdate({ username: username },
                    {
                        team: {
                            name: team[0].team,
                            status: team[0].status
                        }
                    });
            }
            return;
        }).catch((error) => {
            console.log(error);
            return;
        })
    }).catch((error) => {
        console.log(error);
        return;
    });
}