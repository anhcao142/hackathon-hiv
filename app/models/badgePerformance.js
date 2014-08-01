var getDb = require('../lib/db').getDb;

module.exports = function getBadgePerformanceModel(key) {
    var db = getDb(key);

    function updateEarnerCount(badgeSlug, value, callback) {
        if (typeof value === 'function') {
            callback = value;
            value = 1;
        };

        var badgePerformance = this;
        if (badgePerformance) {
            badgePerformance.earnerCount += value;
        } else {
            badgePerformance = {
                badgeSlug: badgeSlug,
                earnerCount: value
            }
        }

        BadgePerformance.put(badgePerformance, function (err, badgePerformance) {
            if (err) {
                return callback(err);
            };

            return callback(null, badgePerformance);
        })
    }

    function updateApplyCount(value, callback) {
        if (typeof value === 'function') {
            callback = value;
            value = 1;
        };

        var badgePerformance = this;
        if (badgePerformance) {
            badgePerformance.applyCount += value;
        } else {
            badgePerformance = {
                badgeSlug: badgeSlug,
                applyCount: value
            }
        }

        BadgePerformance.put(badgePerformance, function (err, badgePerformance) {
            if (err) {
                return callback(err);
            };

            return callback(null, badgePerformance);
        })
    }

    function updateViewCount(value, callback) {
        if (typeof value === 'function') {
            callback = value;
            value = 1;
        };

        var badgePerformance = this;
        if (badgePerformance) {
            badgePerformance.viewCount += value;
        } else {
            badgePerformance = {
                badgeSlug: badgeSlug,
                viewCount: value
            }
        }

        BadgePerformance.put(badgePerformance, function (err, badgePerformance) {
            if (err) {
                return callback(err);
            };

            return callback(null, badgePerformance);
        })
    }

    function updateShareCount(value, callback) {
        if (typeof value === 'function') {
            callback = value;
            value = 1;
        };

        var badgePerformance = this;
        if (badgePerformance) {
            badgePerformance.shareCount += value;
        } else {
            badgePerformance = {
                badgeSlug: badgeSlug,
                shareCount: value
            }
        }

        BadgePerformance.put(badgePerformance, function (err, badgePerformance) {
            if (err) {
                return callback(err);
            };

            return callback(null, badgePerformance);
        })
    }

    var BadgePerformance = db.table('badgePerformance', {
        fields: [
            'id',
            'badgeSlug',
            'earnerCount',
            'applyCount',
            'shareCount',
            'viewCount'
        ],
        methods: {
            updateEarnerCount: updateEarnerCount,
            updateApplyCount: updateApplyCount,
            updateShareCount: updateShareCount,
            updateViewCount: updateViewCount,
        }
    });

    return BadgePerformance;
};