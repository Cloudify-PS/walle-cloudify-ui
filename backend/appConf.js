'use strict';

/**
 * <h1> Configuration file.</h1>
 *
 *
 * public configuration goes under 'publicConfiguration' variable.
 * private configuration gets defaults at 'privateConfiguration' variable.
 *
 * overrides are at me.conf.
 *
 * overriding logic is:
 *
 * <li> Public - looks for keys it has </li>
 * <li> Private - first we merge it with public (we assume no overrides here ) and then we meConf. We do not filter keys  </li>
 *
 *
 * <h1> Conventions</h1>
 * <p>
 *      null value means the property is optional
 * </p>
 * <p>
 *      undefined means the property is required
 * </p>
 *
 * <h1> meConf.js </h1>
 *
 * <p>
 *     The idea behind 'meConf' is that your vcs ignores it.<br/>
 *     meConf should export a simple json with the key-values it wants to override.<br/>
 * </p>
 *
 * <h2> Serving the public configuration </h2>
 * <p>
 *     This module exposes a route to serve public configuration for the front-end. <br/>
 *     The name of the global variable is passed by the request. by default it is conf<br/>
 * </p>
 *
 */

var log4js = require('log4js');
var request = require('request');
var logger = log4js.getLogger('appConf');
var os = require('os');

var publicConfiguration = {
    i18n: {
        language: 'en'
    }
};

var privateConfiguration = {
    autoDetectProtocol:true, // automatically detect if cloudify is listening on http or https
    cloudifyManagerEndpoint: 'http://localhost:80/api/v2/', // require('url').parse(href) ==> protocol+hostname+port+pathname ... (hostname+port == host)
    cloudifyLicense: 'tempLicense',
    secretValue: 'WmLaL99qM95260zZE460d5t2BM4B34yo370447J3f8456F57wrq1Qd653g6s',
    log4js: {
        appenders: [
            { 'type': 'console' },
            {
                'type': 'file',
                'filename': 'logs/application.log',
                'maxLogSize': 20480,
                'backups': 3
            }
        ],
        replaceConsole: true
    },
    logs: {
        folder: 'logs/',
        file: 'logs.tar.gz'
    },
    browseBlueprint: {
        path: os.tmpdir() + '/blueprints'
    },
    influx: {
        host: 'localhost',
        user: 'root',
        pass: 'root',
        dbname: 'cloudify'
    }
};
logger.debug('browseBlueprint path: ' + privateConfiguration.browseBlueprint.path);


/*************************************************************************************/
/*************************************************************************************/
/************************** Initialization Code - Don't Touch ************************/
/*************************************************************************************/
/*************************************************************************************/


var meConf = null;
try {
    meConf = require('../conf/dev/meConf');
} catch (e) {
    logger.debug('meConf does not exist. ignoring.. ' + e);
}

var gsSettings = null;
try {
    gsSettings = require('./gsSettings');
} catch (e) {
    logger.debug('gsSettings does not exist. ignoring.. ' + e);
}

var publicConfigurationInitialized = false;
var privateConfigurationInitialized = false;

function getPublicConfiguration() {
    if (!publicConfigurationInitialized) {
        publicConfigurationInitialized = true;
        if (meConf !== null) {
            for (var i in publicConfiguration) {
                if (meConf.hasOwnProperty(i)) {
                    publicConfiguration[i] = meConf[i];
                }
            }
        }
    }
    return publicConfiguration;
}

function getPrivateConfiguration() {
    if (!privateConfigurationInitialized) {
        privateConfigurationInitialized = true;

        var pubConf = getPublicConfiguration();
        var i;
        if (pubConf !== null) {
            for (i in pubConf) {
                privateConfiguration[i] = pubConf[i];
            }
        }

        if (meConf !== null) {
            for (i in meConf) {
                privateConfiguration[i] = meConf[i];
            }
        }

        if (gsSettings !== null) {
            var settings = gsSettings.read();
            for (i in settings) {
                privateConfiguration[i] = settings[i];
            }
        }
    }
    return privateConfiguration;
}

exports.sendPublicConfiguration = function (req, res) {
    var name = req.param('name') || 'conf';

    res.send('window.' + name + ' = ' + JSON.stringify(getPublicConfiguration()) + ';');
};

exports.applyConfiguration = function (settings) {
    // todo : add support for public configuration
    for (var i in settings) {
        exports[i] = settings[i];
    }
    gsSettings.write(settings);

};


var prConf = getPrivateConfiguration();
if (prConf !== null) {
    for (var i in prConf) {
        if (prConf[i] === undefined) {

//            throw new Error('undefined configuration [' + i + ']');
        }
        exports[i] = prConf[i];
    }
}



exports.getPublicConfiguration = getPublicConfiguration;

exports.getPrivateConfiguration = getPrivateConfiguration;

function discoverProtocol( endpoint, usingPath, callback ){
    var prefix = endpoint.split(':')[0];
    var other = prefix === 'https' ? 'http' : 'https';

    request({'url' : endpoint + usingPath }, function(err){
        if ( !err ){
            callback(null, endpoint);
        }else{
            callback(null, endpoint.replace(prefix,other));
        }
    });
}

if ( prConf.autoDetectProtocol ) {
    discoverProtocol(privateConfiguration.cloudifyManagerEndpoint, '/blueprints', function (err, endpoint) {
        if (!err && !!endpoint) {
            logger.trace('setting endpoint protocol. new endpoint is', endpoint);
            exports.cloudifyManagerEndpoint = privateConfiguration.cloudifyManagerEndpoint = endpoint;
        } else {
            logger.error('unable to decide protocol', err);
        }
    });
}else{
    logger.info('auto detect protocol off, will not detect');
}


