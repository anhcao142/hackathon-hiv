var getDb = require('../lib/db').getDb;
var async = require('async');

module.exports = function getBadgeInstance(key) {
    var db = getDb(key);
    var badgePerformanceWrapper = require('./wrapper/badgePerformance');
    var userPerformanceWrapper = require('./wrapper/userPerformance');

    function updateBadgeCount(value, callback) {
        var badgeInstance = this;

        userPerformanceWrapper.updateBadgeCount(badgeInstance.userId, 1, function (err, userPerformance) {
            if (err) {
                return callback(err);
            };

            return callback();
        });
    }

    function updateEarnerCount(value, callback) {
        var badgeInstance = this;

        var context = {
            badgeSlug: badgeInstance.badgeSlug,
            earnerCount: value
        }
        badgePerformanceWrapper.update(context, function (err, badgePerformance) {
            if (err) {
                return callback(err);
            };

            return callback();
        })
    }

    var BadgeInstance = db.table('badgeinstance', {
        fields: ['id',
            'userId',
            'issuedOn',
            'badgeSlug',
            'badgeName',
            'badgeImageUrl',
            'userName',
            'userImageUrl',
            'issuer'
        ],
        methods: {
            updateBadgeCount: updateBadgeCount,
            updateEarnerCount: updateEarnerCount
        }
    });

    return BadgeInstance;
};
