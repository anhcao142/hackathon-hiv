const Patient = require('../models/wrapper/patient');
const fs = require('fs');
const async = require('async')

exports.home = function home(req, res, next) {

    var context = {
        limit: 5,
        page: 1
    }
    Patient.get(context, function (err, patients) {
        res.render('home.html', {patients: patients});
    });
};

exports.insertData = function insertData(req, res, next) {
    fs.readFile('training_data.csv', 'utf8', function (err, data) {
        var listData = data.split('\n');
        var listPatient = [listData.length - 2];
        for (var i = 1; i < listData.length - 1; i++) {
            var ls = listData[i].split(',');
            listPatient[i-1] = {
                resp: Number(ls[1]),
                pr_seq: String(ls[2]).replace(/"/gi, ''),
                rt_seq: String(ls[3]).replace(/"/gi, ''),
                vl_t0: Number(ls[4]),
                cd4_t0: Number(ls[5]),
            }
        };

        async.each(listPatient, function (patient, innerCallback) {
            Patient.insert(patient, function (err, insertPatient) {
                if (err) {
                    return innerCallback(err);
                };

                return innerCallback();
            });
        }, function (err) {
            if (err) {
                return next(err);
            };

            return res.send(200, listPatient.length + ' row insert ok');
        })
    })
}

exports.predict = function predict(req, res, next) {
    var context = {
        pr_seq: req.body.pr_seq.trim(),
        rt_seq: req.body.rt_seq.trim()
    }

    Patient.getOne(context, function (err, patient) {
        if (err) {
            if (req.xhr) {
                return res.send(err);
            };
            return next(err);
        };

        if (req.xhr) {
            return res.send(200, patient);
        };

        res.send(patient);
    });
}