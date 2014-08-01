const BadgePerformance = require('../badgePerformance')('DATABASE');

exports.update = function updateBadgePerformance(context, callback) {
    if (!context.badgeSlug) {
        throw new Error('badgeSlug is null');
    };

    BadgePerformance.getOne({badgeSlug: context.badgeSlug}, function (err, badgePerformance) {
        if (err) {
            return callback(err);
        }

        if (badgePerformance) {
            badgePerformance.earnerCount += context.earnerCount ? context.earnerCount : 0;
            badgePerformance.applyCount += context.applyCount ? context.applyCount : 0;
            badgePerformance.shareCount += context.shareCount ? context.shareCount : 0;
            badgePerformance.viewCount += context.viewCount ? context.viewCount : 0;
        } else {
            badgePerformance = {
                badgeSlug: context.badgeSlug,
                earnerCount: context.earnerCount ? context.earnerCount : 0,
                applyCount: context.applyCount ? context.applyCount : 0,
                shareCount: context.shareCount ? context.shareCount : 0,
                viewCount: context.viewCount ? context.viewCount : 0
            }
        }

        BadgePerformance.put(badgePerformance, function (err, badgePerformance) {
            if (err) {
                return callback(err);
            };

            return callback(null, badgePerformance.row);
        });
    })
}