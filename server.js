'use strict';

// allow self signed certificates
// https://github.com/request/request/issues/418
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/*
 * Express Dependencies
 */

function isLocalhost(){
    return process.env.GS_UI_NODE_ENV === 'localhost';
}

if ( isLocalhost() ){
    console.log('running in localhost');
}

var express = require('express');


var middlewares = require('./backend/middlewares');

require('express-params');
/*jshint -W079 */
var _ = require('lodash');
var url = require('url');
var nodeRequest = require('request');
var app = express();

app.use(function (req, res, next) {
    var CONTENT_TYPE_HEADER = 'content-type';
    var contentType = req.get(CONTENT_TYPE_HEADER);
    if (contentType && (contentType.indexOf('application/json') >= 0)) {
        req.headers[CONTENT_TYPE_HEADER] = 'application/json';
    }
    next();
});

var gsSettings = require('./backend/gsSettings');

var services = require('./backend/services');

var conf = services.conf;
var cloudify4node = services.cloudify4node;

var port = conf.bindPort || 9001;
var ip = conf.bindIp || '0.0.0.0';

var log4js = require('log4js');
var logger = log4js.getLogger('server');
var influx = require('influx');
var fs = require('fs');
var http = require('http');
var controllers = require('./backend/controllers');

logger.debug(JSON.stringify(conf));

if (conf.cloudifyLicense !== 'tempLicense') {
    throw new Error('invalid license');
}

app.enable('jsonp callback');

// app.use(express.favicon());
app.use(express.cookieParser(/* 'some secret key to sign cookies' */ conf.secretValue ));
app.use(express.cookieSession());

app.use( '/backend/cloudify-api', middlewares.cloudifyAuthentication );
app.use( '/backend/cloudify-api', middlewares.cloudifyProxy(conf) );

app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());
/*
 * Set app settings depending on environment mode.
 * Express automatically sets the environment to 'development'
 */
if (process.env.NODE_ENV === 'production' || process.argv[2] === 'production') {
    logger.debug('Setting production env variable');
    app.set('env', 'production');

    // this 'dev' variable is available to Jade templates
    app.locals.dev = false;
} else {
    app.locals.dev = true;
}


// Cloudify REST APIs

/* login */

function checkLoginData( creds, callback ){
    nodeRequest({
        'method' : 'GET',
        'headers' : {
            'authorization': 'Basic ' + new Buffer(creds.username + ':' + creds.password).toString('base64') // todo: make reuse of code with AuthenticationMiddleware
        },
        'url' : url.resolve(conf.cloudifyManagerEndpoint, '/status')
    }, callback );
}

app.post('/backend/login', function(request, response){

    var loginData = request.body;
    checkLoginData( loginData , function(err, result){


        if ( err ){
            response.status(500).send();
            return;
        }

        try{  // identify error response
            if ( JSON.parse(result.body).error_code ) {
                response.status(500).send();
                return;
            }
        }catch(e){
            response.status(500).send();
            return;
        }

        if ( loginData.remember ){
            request.session.cookie.maxAge = 315360000;
        }
        request.session.cloudifyCredentials = loginData;
        response.send({'message' : 'ok'});
        return;
    });

    //try{
    //
    //
    //
    //
    //}catch(e){
    //    logger.error('error while login',e);
    //    response.status(500).send({'details' : e});
    //}

});

/**
 * An action that sends back whether a user is logged in or not.
 */
app.get('/backend/isLoggedIn', function( req, res ){
   res.send({'result' : !!req.session.cloudifyCredentials, 'username' : !req.session.cloudifyCredentials ? '' : req.session.cloudifyCredentials.username });
});

app.post('/backend/logout', function(req, res){
    req.session = null;
    res.send({'message': 'ok'});
});


/* blueprints */

var defaultResponseCallback = function(response){
    return function(err, data ){
        if ( !!err ){
            response.status(500).send({'error' : err instanceof Error ? err.toString() : err });
            return;
        }
        response.send(data);
    }
};

app.get('/backend/blueprints/browse', middlewares.cloudifyAuthentication, function(request, response) {
   services.browseBlueprint.browseBlueprint( { authHeader : request.cloudifyAuthHeader }, request.query.id,request.query.last_update, defaultResponseCallback(response) );
});

app.get('/backend/blueprints/browse/file', middlewares.cloudifyAuthentication, function(request, response) {
    services.browseBlueprint.browseBlueprintFile( request.query.id,request.query.path, defaultResponseCallback(response) );
});

app.post('/backend/blueprints/add', function(request, response){
    services.browseBlueprint.browseBlueprintFile( request.query.id, request.query.path, function(err, data){
        if ( !!err ){
            response.status(500).send({'error' : err.toString()});
            return;
        }
        response.send(data);
    } );
});

app.post('/backend/blueprints/upload', middlewares.cloudifyAuthentication, controllers.blueprints.upload);


/* deployments */


app.post('/backend/influx', function(request, response) {

    var influxClient = influx({
        host: conf.influx.host,
        username : conf.influx.user,
        password : conf.influx.pass,
        database : conf.influx.dbname
    });

    influxClient.query(request.body.query, function(err, data){
        response.send(err !== null ? err : data);
    });

});

app.get('/backend/grafana/series', function(request, response){
    services.monitoring.getDashboardSeries(request.query, function(err, data){
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/grafana/series/list', function(request, response){
    services.monitoring.getDashboardSeriesList(request.query, function(err, data){
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/grafana/dashboards/:dashboardId', function(request, response){
    services.monitoring.getDeploymentDashboard(request.params, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

app.get('/backend/apidocs', function(request, response) {
    response.writeHead(301, {Location: 'http://' + conf.cosmoServer + '/api/spec.html'});
    response.end();
});

app.get('/backend/versions/ui', function(request, response) {
    try {
        response.send(require('./package.json'));
    }catch(e){
        response.status(500).send({'error':e.toString()});
    }
});

app.get('/backend/logsfile', function(request, response) {
    cloudify4node.getLogsExportFile(response, function(err, data) {
        response.send(err !== null ? err : data);
    });
});

// ui settings REST APIs

app.post('/backend/settings', function(request, response) {
    conf.applyConfiguration(request.body.settings);
    response.send(200);
});

app.get('/backend/settings', function(request, response) {
    response.send(gsSettings.read());
});

app.get('/backend/homepage', function(request, response) {
    var fileExists = gsSettings.read() !== undefined;
    response.send('function isSettingsExists(){return ' + fileExists + ';}');
});

app.get('/backend/configuration', function (request, response) {
    var access = request.query.access,
        dto = {};
    if (access === 'public') {
        _.extend(dto, conf.getPublicConfiguration());
    } else if (access === 'private') {
        _.extend(dto, conf.getPrivateConfiguration());
    } else if (access === 'all') {
        _.extend(dto, conf.getPrivateConfiguration(), conf.getPublicConfiguration());
    }
    response.json(dto);
});

app.get('/backend/version/latest', function(request, response) {
    var currentVersion = request.query.version;
    http.get('http://www.gigaspaces.com/downloadgen/latest-cloudify-version?build=' + currentVersion, function(res) {
        res.on('data', function(chunk) {
            response.send(chunk);
        });
    }).on('error', function(e) {
        response.send('Got error: ' + e.message);
    });
});


// our custom 'verbose errors' setting
// which we can use in the templates
// via settings['verbose errors']
app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node server.js
if (app.get('env') === 'production') {
    app.disable('verbose errors');
}


// 'app.router' positions our routes
// above the middleware defined below,
// this means that Express will attempt
// to match & call routes _before_ continuing
// on, at which point we assume it's a 404 because
// no route has handled the request.
app.use(app.router);


// host dev files if in dev mode
if (app.get('env') === 'development') {
    app.use(express.static('.tmp'));
    app.use(express.static('app'));
} else {
    app.use(express.static('.'));
}

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

app.use(function(req, res) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || (err.status = 500));

    logger.debug('Server error catch-all says: ', err);

    // prevent users from seeing specific error messages in production
    if (app.get('env') !== 'development') {
        var newErr = new Error('Something went wrong. Sorry!');
        newErr.status = err.status;
        err = newErr;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({
            data: err,
            message: err.message
        });

        return;
    }

    if (req.accepts('html')) {
        res.render('errors', {
            data: err,
            message: err.message
        });

        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Error ' + err.status);
});

/*
 * Status Code pages
 */
app.get('/404', function(req, res, next){
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    next();
});

app.get('/403', function(req, res, next){
    // trigger a 403 error
    var err = new Error('not allowed!');
    err.status = 403;
    next(err);
});
// todo: do we need this?
app.get('/500', function(req, res, next){
    // trigger a generic (500) error
    next(new Error('keyboard cat!'));
});

// todo: do we need this?
//app.get('/', function(/*req, res, next*/){
//
//});


app.listen(port, ip);
logger.debug('Express started on ip ' + ip + ' port ' + port);

process.on('uncaughtException', function (err) {
    logger.error('catchall error happened',err);
});
