var newrelic;
if (process.env.NEW_RELIC_ENABLED) {
    newrelic = require('newrelic');
} else {
    newrelic = {
        getBrowserTimingHeader: function () {
            return "<!-- New Relic RUM disabled -->";
        }
    };
}

const config = require('./lib/config');
const nunjucks = require('nunjucks');
const express = require('express');
const path = require('path');
const middleware = require('./middleware');
const views = require('./views');
const http = require('http');
const i18n = require('./lib/utils').i18n;
const api = require('./api');

//might not need for cedar website
//const api = require('./api');
var app = express();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader([
    path.join(__dirname, './templates'),
    path.join(__dirname, './static/templates')
]), {
    autoescape: true,
    watch: true
});

env.express(app);

app.locals.newrelic = newrelic;

require('express-monkey-patch')(app);

var staticDir = path.join(__dirname, '/static');
var staticRoot = '/static';

app.use(function (req, res, next) {
    res.locals.static = function static(staticPath) {
        //For some reasons, path.join always return path with backslash (\) instead of slash (/)
        //base on Node Path document, this behavior only appear in Window user.
        //Therefore, after get the fullpath we have to replace backslash (\) with slash (/) manually
        var filePath = path.join(app.mountPoint, staticRoot, staticPath);
        filePath = filePath.replace(/\\/gi, "/");
        return filePath;
    };
    next();
});

var CSRF_OPTIONS = {
    whitelist: [
        '/login-facebook',
        '/persona/login',
        '/persona/logout',
        '/persona/verify',
        '/api/user',
        '/hook'
    ]
};

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(middleware.session());
app.use(middleware.domainWrapper());
app.use(middleware.csrf(CSRF_OPTIONS));
app.use(middleware.sass(staticDir, staticRoot));
app.use(middleware.addCsrfToken);
app.use(middleware.debug);
app.use(middleware.initLocalData);
app.use(i18n);
app.use(staticRoot, express.static(staticDir));
app.use(express.favicon("app/static/images/favicon.ico"));

var debug = (config('NODE_ENV', '') === 'test') || config('DEBUG', false);
if (debug) {
    console.info("Debug is ON");
}

var LOGIN_PAGE_REDIRECT_TO = '/login';
var secureRouteHandlers = [middleware.cedarUserAware(LOGIN_PAGE_REDIRECT_TO)];
//var secureRouteHandlers = [persona.ensureLoggedIn(), middleware.cedarUserAware()];
var secureApiHandlers = [middleware.verifyApiRequest()];
//
//app.get('/', 'home', [persona.ensureLoggedOut()], views.home);
//app.get('/directory', 'directory', secureRouteHandlers, views.directory.home);
//app.get('/directory/addBadge', 'directory.addBadge', secureRouteHandlers, views.directory.addBadge);
//app.get('/directory/useTemplate', 'directory.useTemplate', secureRouteHandlers, views.directory.useTemplate);
//
//app.get('/badge/:badgeId', 'badge', secureRouteHandlers, views.badge.home);
//app.get('/badge/:badgeId/edit', 'badge.edit', secureRouteHandlers, views.badge.edit);
//app.del('/badge/:badgeId/delete', 'badge.delete', secureRouteHandlers, views.badge.del);
//app.get('/badge/:badgeId/criteria', 'badge.criteria', views.badge.criteria);
//app.post('/badge/:badgeId/edit', 'badge.save', secureRouteHandlers, views.badge.save);
//app.post('/badge/:badgeId/archive', 'badge.archive', secureRouteHandlers, views.badge.archive);
//app.post('/badge/:badgeId/publish', 'badge.publish', secureRouteHandlers, views.badge.publish);
//app.post('/badge/:badgeId/copy', 'badge.copy', secureRouteHandlers, views.badge.copy);
//
//app.get('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', secureRouteHandlers, views.badge.renderIssueByEmail);
//app.post('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', secureRouteHandlers, views.badge.issueByEmail);
//
//app.get('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', secureRouteHandlers, views.badge.renderIssueByClaimCode);
//app.post('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', secureRouteHandlers, views.badge.issueByClaimCode);
//
//app.get('/images/badge/:badgeId', 'badge.image', views.badge.image);
//
//app.get('/settings', 'settings', secureRouteHandlers, views.settings.home);
//app.get('/settings/systems', 'settings.systems', secureRouteHandlers, views.settings.systems);
//app.get('/settings/issuers', 'settings.issuers', secureRouteHandlers, views.settings.issuers);
//app.get('/settings/programs', 'settings.programs', secureRouteHandlers, views.settings.programs);
//app.get('/settings/users', 'settings.users', secureRouteHandlers, views.settings.users);
//app.post('/settings/users', 'settings.editUser', secureRouteHandlers, views.settings.editUser);
//app.del('/settings/users', 'settings.deleteUser', secureRouteHandlers, views.settings.deleteUser);
//
//app.get('/studio/backgrounds', 'studio.backgrounds', secureRouteHandlers, views.badge.getBackgrounds);
//app.get('/studio/texts', 'studio.texts', secureRouteHandlers, views.badge.getTexts);
//app.get('/studio/icons', 'studio.icons', secureRouteHandlers, views.badge.getIcons);
//app.get('/studio/colors', 'studio.colors', secureRouteHandlers, views.badge.getColors);

//app.get('/help', 'help', views.help.home);
app.get('/', 'home', views.home);
app.get('/profile', 'myprofile', secureRouteHandlers, views.profile.viewMyProfile);
app.get('/profile/:externalId', 'profile', views.profile.viewProfile);
app.get('/profile/:externalId/update', 'profile.update', secureRouteHandlers, views.profile.updateProfile);
app.post('/profile/:externalId/save', 'profile.save', secureRouteHandlers, views.profile.saveProfile);
app.get('/profile/:externalId/changePass', 'pass.view', secureRouteHandlers, views.profile.viewChangePassPage);
app.post('/profile/:externalId/updatePass', 'pass.change', secureRouteHandlers, views.profile.changePass);
app.get('/forgotpass', 'forgotPass', views.profile.forgotPassPage);
app.post('/forgotpass/send', 'forgotPass.send', views.profile.forgotPass);
app.get('/images/defaultUser', 'image.defaultUser', views.profile.image);

app.get('/issuers', 'issuers', views.issuer.view);
app.get('/issuer/:issuerSlug', 'issuer', views.issuer.viewIssuer);

app.get('/feedback/new', 'feedback.new', views.feedback.newFeedback);
app.get('/feedback/:idCard/view', 'feedback.view', views.feedback.viewFeedback);
app.get('/feedback', 'feedback.all', views.feedback.viewAllFeedback);
app.post('/feedback/send', 'feedback.send', views.feedback.postFeedback);

app.get('/explorer', 'explorer', views.explorer.view);
app.get('/explorer/issuers', 'explorer.issuers', views.explorer.getIssuers);
//app.post('/api/user', 'api.user.add', secureApiHandlers, api.user.addUser);
//app.del('/api/user', 'api.user.delete', secureApiHandlers, api.user.deleteUser);
//app.post('/badge/awardByClaimCode', 'badge.awardByClaimCode', views.badge.awardByClaimCode);
//app.get('/apply', 'apply', views.application.apply);
//app.post('/sendApp', 'sendApp', views.application.applicationSend)

app.get('/api/user/email/:email', 'api.user.email', secureApiHandlers, api.user.getUser);
app.get('/api/user/current', 'api.user.current', api.user.getCurrentUser);
app.get('/api/user/username/:username', 'api.user.username', secureApiHandlers, api.user.getUser);

app.get('/badge/:badgeId/apply', 'badge.apply', secureRouteHandlers, views.badge.apply);
app.get('/badge/:badgeSlug', 'badge', views.badge.viewBadge);

app.post('/badge/apply', 'badge.sendApplication', secureRouteHandlers, views.badge.sendApplication);
app.post('/hook', 'hook', views.hook.process);
//app.get('/accept', 'accept', views.hook.acceptBadge);
app.get('/code/claim', 'code.confirm', views.badge.claimCodeConfirm);
app.post('/code/:claimCode/claim', 'code.claim', views.badge.claimCodeClaim);

app.get('/register', 'account.register', views.account.register);
app.get('/login', 'account.login', views.account.viewLogin);
app.get('/login-facebook', 'account.loginFacebook', views.account.loginFacebook)
app.get('/register/check-email', 'account.checkEmail', views.account.checkEmail);
app.get('/register/check-username', 'account.checkUsername', views.account.checkUsername);
app.get('/register/verify-fb', 'account.viewVerifyFb', views.account.viewVerifyFb);
app.get('/logout', 'account.logout', views.account.logout);
app.post('/register', 'account.createUser', views.account.createUser);
app.post('/register/verify-fb', 'account.verifyFb', views.account.verifyFb);
app.post('/login', 'account.authenticate', views.account.login);

app.get('/users', 'users', views.getUsers);

app.get('/lang/:locale', 'changeLanguage', views.changeLanguage);
app.post('/subscribe', 'emailSubscription.subscribe', views.emailSubscribtion.subscribe);

app.get('/announce', 'announce', views.announce);
app.get('/statistic', 'statistic', views.statistic.viewStatistic);
app.post('/statistic', 'statistic.access', views.statistic.accessStatistic);

app.get('*', function (req, res, next) {
    var error = new Error('Page not found');

    Object.defineProperties(error, {
        name: {value: 'ResourceNotFoundError'},
        code: {value: 404},
    });

    next(error);
});

app.all('*', function (req, res, next) {
    var error = new Error('Method not allowed');

    Object.defineProperties(error, {
        name: {value: 'MethodNotAllowedError'},
        code: {value: 405},
    });

    next(error);
});

app.use(function (err, req, res, next) {
    const status = err.code || 500;
    const msg = http.STATUS_CODES[status] || err.message;

    console.info('Url: %s', req.url);
    console.info(err);
    console.info(err.stack);

    switch(status) {
        case 404:
            return res.render('404.html');
        default:
            return res.render('500.html');
    }

    // res.status(status).render('error.html', {
    //     message: msg,
    //     error: err
    // });
});

if (!module.parent) {
    const port = config('PORT', 7743);

    app.listen(port, function (err) {
        if (err) {
            throw err;
        }

        console.log('Listening on port ' + port + '.');
    });
} else {
    module.exports = http.createServer(app);
}
