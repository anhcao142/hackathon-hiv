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

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(middleware.session());
app.use(middleware.domainWrapper());
app.use(middleware.sass(staticDir, staticRoot));
app.use(middleware.debug);
app.use(middleware.initLocalData);
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

app.get('/', 'home', views.home);
app.post('/uploadcsv', views.uploadCsv);
app.post('/predict', views.predict);
app.get('/insertdata', views.insertData);

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
