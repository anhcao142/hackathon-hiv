const ParseUser = require('../Parse/user');

exports.getUser = function getUser(req, res, next) {
    var username = req.params.username;
    var email = req.params.email;

    if (username) {
        ParseUser.getUser(username, function (err, user) {
            if (err) {
                return res.send(500, err);
            };

            return res.send(200, user);
        });
    };

    if (email) {
        ParseUser.getUserByEmail(email, function (err, user) {
            if (err) {
                return res.send(500, err);
            };

            return res.send(200, user);
        });
    };
}

exports.getCurrentUser = function getCurrentUser(req, res, next) {
    var user = req.session ? req.session.currentUser : null;
    
    return res.send(200, user);
}
