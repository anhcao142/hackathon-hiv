var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "CREATE TABLE IF NOT EXISTS `patient` ("
            + "`id`               BIGINT AUTO_INCREMENT PRIMARY KEY,"
            + "`resp`             TINYINT(1),"
            + "`pr_seq`           VARCHAR(2000),"
            + "`rt_seq`           VARCHAR(2000),"
            + "`vl_t0`            DECIMAL(2,1),"
            + "`cd4_t0`           BIGINT"
            + ") ENGINE=InnoDB;")
        ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TABLE IF EXISTS `patient`;"),
        ], callback);
};
