var getDb = require('../lib/db').getDb;

module.exports = function getCedarUserModel(key) {
    var db = getDb(key);

    var CedarUser = db.table('cedar_users', {
        fields: ['id',
            'external_identifier',
            'persona_id',
            'email',
            'password',
            'avatar_url',
            'name'
        ]
    });

    return CedarUser;
};