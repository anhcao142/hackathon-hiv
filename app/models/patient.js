var getDb = require('../lib/db').getDb;

module.exports = function getPatientModel(key) {
    var db = getDb(key);

    var patient = db.table('patient', {
        fields: ['id',
            'resp',
            'pr_seq',
            'rt_seq',
            'vl_t0',
            'cd4_t0'
        ]
    });

    return patient;
};