const BadgeInstance = require('../badgeInstance')('DATABASE');
const async = require('async');

exports.createBadgeInstance = function createBadgeInstance(badgeInstance, callback) {
    BadgeInstance.put(badgeInstance, function (err, badgeInstance) {
        if (err) {
            return callback(err);
        };

        BadgeInstance.getOne({id: badgeInstance.insertId}, function (err, badgeInstance) {
            if (err) {
                return callback(err);
            };

            if (badgeInstance) {
                async.parallel([
                    function (innerCallback) {
                        badgeInstance.updateBadgeCount(1, function (err) {
                            if (err) {
                                return innerCallback(err);
                            };

                            return innerCallback();
                        });
                    },
                    function (innerCallback) {
                        badgeInstance.updateEarnerCount(1, function (err) {
                            if (err) {
                                return innerCallback(err);
                            };

                            return innerCallback();
                        });
                    }],
                    function (err) {
                        if (err) {
                            return callback(err);
                        };

                        return callback(null, badgeInstance);
                    });
            };
        });
    })
}