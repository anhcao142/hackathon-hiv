var clientSessions = require('client-sessions');
var formatUrl = require('url').format;
var parseUrl = require('url').parse;
var sass = require('node-sass');
var xtend = require('xtend');
var jwt = require('jwt-simple');
var domain = require('domain');

var config = require('../lib/config');
var utils = require('../lib/utils');

exports.csrf = require('./csrf');

var COOKIE_KEY = config('COOKIE_KEY', 'session');
var COOKIE_SECRET = config('COOKIE_SECRET');

exports.session = function session() {
    return clientSessions({
        cookieName: COOKIE_KEY,
        secret: COOKIE_SECRET,
        maxAge: (7 * 24 * 60 * 60 * 1000), //one week
        cookie: {
            httpOnly: true
        }
    });
};

exports.addCsrfToken = function addCsrfToken(req, res, next) {
    res.locals.csrfToken = req.session._csrf;
    next();
};

exports.debug = function debug(req, res, next) {
    const debug = (config('NODE_ENV', '') === 'test') || config('DEBUG', false);
    res.locals.debug = debug;
    next();
}

exports.redirect = function (target, params, status) {
    if (typeof params === 'number') {
        status = params;
        params = {};
    }

    return function (req, res, next) {
        var url;
        try {
            url = res.locals.url(target, params);
        } catch (e) {
            url = target;
        }

        if (params._qsa && req.query) {
            url = parseUrl(url, true);
            if (!url.query) url.query = {};

            Object.keys(req.query).forEach(function (key) {
                if (!url.query.hasOwnProperty(key))
                    url.query[key] = req.query[key];
            });

            url = formatUrl(url);
        }

        return res.redirect(status || 302, url);
    };
};

exports.sass = function (root, prefix) {
    return sass.middleware({
        root: root,
        src: 'scss',
        dest: 'css',
        prefix: prefix,
        outputStyle: 'compressed',
        debug: config('DEBUG', false)
    });
};

exports.verifyPermission = function verifyPermission(siteAdminList, deniedPage) {
    if (typeof siteAdminList === 'string' || siteAdminList instanceof String) {
        siteAdminList = JSON.parse(siteAdminList);
    }

    siteAdminList = siteAdminList || [];

    return function (req, res, next) {
        function makeContext(context) {
            context = context || {};

            return function (data) {
                return xtend(context, data);
            }
        }

        function sendDenied() {
            if (!deniedPage){
                return res.send(403, 'Access Denied');
            } else {
                res.status(403);
            }
            return res.render(deniedPage);
        }

        if (req.fromLoggedInUser()) {
            if (siteAdminList.some(function (email) {
                return new RegExp(email.replace('*', '.+?')).test(req.session.email)
            })) {
                res.locals.isSiteAdmin = true;
                res.locals.hasPermission = function () {
                    return true;
                }
                res.locals.makeContext = makeContext({
                    system: config('OPENBADGER_SYSTEM')
                });
                res.locals.canCreateDraft = true;
                return next();
            } else {
                return Account.getOne({email: req.session.email}, {relationships: true}, function (err, row) {
                    if (err) {
                        return res.send(500, err);
                    }
                    if (!row || !row.accountPermissions.length) {
                        return sendDenied();
                    }

                    res.locals.hasPermission = row.hasPermission.bind(row);
                    // This isn't a good solution, as it is basically assuming one permission per account,
                    // particularly at the issuer level and above.  While this currently matches the design, I doubt we can count
                    // on this being true for long.
                    var context = {};
                    if (row.accountPermissions[0].system)
                        context.system = row.accountPermissions[0].system;
                    if (row.accountPermissions[0].issuer)
                        context.issuer = row.accountPermissions[0].issuer;
                    if (row.accountPermissions[0].program)
                        context.program = row.accountPermissions[0].program;

                    res.locals.makeContext = makeContext(context);
                    res.locals.canCreateDraft = row.hasPermission(context, 'draft');
                    return next();
                });

                return sendDenied();
            }
        }
        return sendDenied();
    };
};

exports.initLocalData = function initLocalData(req, res, next) {
    if (req.session.cedarFilter) {
        res.locals.cedarFilter = req.session.cedarFilter;
    };

    if (req.session.currentUser) {
        res.locals.currentUser = req.session.currentUser;
    };

    return next();
}

exports.cedarUserAware = function cedarUserAware(redirectTo) {
    return function(req, res, next) {
        if (req.session.currentUser) {
            return next();
        } else {
            res.redirect(redirectTo);
        }
    };
};

// const monthNamesByLanguage = {
// en: {
// fullNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
// 'August', 'September', 'October', 'November', 'December'],
//    shortNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//  }
//}
//
//exports.getMonthName = function getMonthName (monthNum, getShort, lang) {
//  lang = (lang && (lang in monthNamesByLanguage)) ? lang : 'en';
//
//  if (!getShort) {
//    return monthNamesByLanguage[lang].fullNames[monthNum];
//  }
//  else {
//    return monthNamesByLanguage[lang].shortNames[monthNum];
//  }
//}

function createForbiddenError(message) {
    var err = new Error(message);
    err.code = 403;
    return err;
}

exports.verifyApiRequest = function verifyApiRequest() {
    return function (req, res, next) {
        const param = req.method === "GET" ? req.query : req.body;
        const token = param.auth;
        const email = param.email;

        const now = Date.now() / 1000 | 0;
        var decodedToken, msg;
        if (!token)
            return next(createForbiddenError('missing mandatory `auth` param'));
        try {
            decodedToken = jwt.decode(token, API_SECRET);
        } catch (err) {
            return next(createForbiddenError('error decoding JWT: ' + err.message));
        }

        if (decodedToken.prn !== email) {
            msg = '`prn` mismatch: given %s, expected %s';
            return next(createForbiddenError(util.format(msg, decodedToken.prn, email)));
        }

        if (!decodedToken.exp)
            return next(createForbiddenError('Token must have exp (expiration) set'));

        if (decodedToken.exp < now)
            return next(createForbiddenError('Token has expired'));

        return next();
    }
}

exports.domainWrapper = function domainWrapper() {
    return function (req, res, next) {
        var domainWrapper = domain.create();
        domainWrapper.add(req);
        domainWrapper.add(res);
        domainWrapper.on('error', function(err) {
            //TODO: How we handle error here
            return next(err);
        })
        domainWrapper.run(next);
    }
}
