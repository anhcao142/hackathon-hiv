const UserPerformance = require('../userPerformance')('DATABASE');

exports.updateApplyCount = function updateApplyCount(userId, value, callback) {
    UserPerformance.getOne({userId: userId}, function (err, userPerformance) {
        if (err) {
            return callback(err);
        }

        if (userPerformance) {
            userPerformance.applyCount += value;

            UserPerformance.put(userPerformance, function (err, userPerformance) {
                if (err) {
                    return callback(err);
                };

                return callback(null, userPerformance);
            });
        } else {
            userPerformance = {
                userId: userId,
                applyCount: value
            }

            UserPerformance.put(userPerformance, function (err, userPerformance) {
                if (err) {
                    return callback(err);
                };

                return callback(null, userPerformance);
            });
        }
    })
}

exports.updateBadgeCount = function updateBadgeCount(userId, value, callback) {
    UserPerformance.getOne({userId: userId}, function (err, userPerformance) {
        if (err) {
            return callback(err);
        }

        if (userPerformance) {
            userPerformance.badgeCount += value;

            UserPerformance.put(userPerformance, function (err, userPerformance) {
                if (err) {
                    return callback(err);
                };

                return callback(null, userPerformance);
            });
        } else {
            userPerformance = {
                userId: userId,
                badgeCount: value
            }

            UserPerformance.put(userPerformance, function (err, userPerformance) {
                if (err) {
                    return callback(err);
                };

                return callback(null, userPerformance);
            });
        }
    })
}