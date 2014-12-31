/**
 * @module GsHttpUtils
 *
 * @description utilities we need that involve HTTP requests
 *
 * We only add here if no other library implemented our requirements.
 *
 *
 **/


/**
 *
 * @description
 * a function to invoke a GET request on a url.<br/>
 * supports HTTPS and HTTP.<br/>
 * supports redirect.<br/>
 * returns error or an untouched HTTP Response.<br/>
 *<br/>
 * Tried to use <a href="https://www.npmjs.com/package/request">npm's request module</a> which claim to do the same
 * thing but for no reason, their responses `read chunk` always gave an empty chunk.
 * <br/>
 * This function expects to get status code of 200, otherwise it will treat it as an error.
 *
 * @see http://stackoverflow.com/questions/27717294/nodejs-request-module-why-am-i-getting-empty-chunks-when-i-read-from-response
 *
 * @param {string} url the url to read.
 * @param {function} callback e.g. myCallback( err, res );
 */
exports.getUrl = function(url, callback) {

    if ( !url ){
        callback( new Error('url is empty' ));
        return;
    }

    url = url.trim();

    if ( url.indexOf('http') !== 0 && url.indexOf('https') !== 0){
        callback(new Error('expected url with http/https at the beginning. got [' + url + ']'));
        return;
    }

    var ajax = require('http');
    if (url.indexOf('https') === 0) {
        ajax = require('https');
    }

    ajax.get(url, function (res) {
        if (res.statusCode !== 200) {
            if ( !!res.headers && !!res.headers.location) {
                exports.getUrl(res.headers.location, callback );
                return;
            } else {
                callback(new Error('unable to read request. status code was', res.statusCode));
            }

        } else {
            callback(null, res);
        }

    });
};


