const Patient = require('../patient')('DATABASE');

exports.insert = function insert(patient, callback) {
    Patient.put(patient, function (err, patient) {
        debugger;
        if (err) {
            return callback(err);
        };

        return callback(null, patient);
    });
}

exports.getOne = function getOne(context, callback) {
    Patient.getOne(context, function (err, patient) {
        if (err) {
            return callback(err);
        };

        return callback(null, patient);
    });
}

exports.get = function get(context, callback) {
    if (!context) {
        return new Error('context empty');
    };

    var options = {
        limit: context.limit,
        page: context.page
    }

    Patient.getAll(options, function (err, patients) {
        return callback(err, patients);
    })
};