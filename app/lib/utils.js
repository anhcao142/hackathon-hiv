const PARSE = require('parse').Parse;
const config = require('./config');
const i18n = require('i18n');

//Now Parse will only initialize once
PARSE.initialize(config('PARSE_APPID'), config('PARSE_JAVASCRIPTKEY'));

exports.Parse = PARSE;

//i18n
i18n.configure({
    locales: ['en', 'vi'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    cookie: 'lang'
})

exports.i18n = function i18nFnc(req, res, next) {
    i18n.init(req, res);

    return next();
}
