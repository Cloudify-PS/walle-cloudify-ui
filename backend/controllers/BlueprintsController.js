'use strict';


var logger = require('log4js').getLogger('BlueprintsController');
logger.info('loaded');

var services = require('../services');
var _ = require('lodash');
var fs = require('fs');

/**
 * @typedef UploadTypes
 * @name UploadTypes
 * @class
 *
 * @description
 * This class describes the possible ways to upload a blueprint.
 *
 * @constructor
 */
var UploadTypes = function(){

    this.ids = {
        FILE: 'file'
    };

    this.types = [
        {
            id: this.ids.FILE
        }
    ];

    this.isValid = function(type){
        return !!_.find(this.types, { id : type } );
    };
};

/**
 * @type {UploadTypes}
 */
var uploadTypes = new UploadTypes();




/**
 *
 * @description
 * supports upload blueprint both as file and URL.
 *
 * @param {object} req the request
 * @param {object} req.files files uploaded on request
 * @param {string} req.files.application_archive the body parser will read the uploaded blueprint, save it to a file and will put the name of the file to this property. request should specify this name in order for it to work.
 * @param {object} req.body
 * @param {object} req.body.type [file] url/file
 * @param {object} req.body.url url to upload from in case the upload is URL type.
 * @param {object} req.body.opts options to send to cloudify on upload request
 * @param {string} req.body.opts.blueprint_id the blueprint's ID. cloudify also uses this as name.
 * @param {object} req.body.opts.params query params to put on request.
 * @param {string} req.body.opts.params.application_file_name the yaml filename to look for in the tar.
 * @param {object} req.cloudifyClientConf - see CloudifyMiddleware
 * @param {object} res response
 */
exports.upload = function( req, res ){
    var cloudifyConf = { authHeader :  req.cloudifyAuthHeader };
    var blueprintUploadData = req.body;

    if ( !blueprintUploadData ){
        res.status(400).send({'message' : 'body is missing'});
        return;
    }

    // resolve upload type
    var type = uploadTypes.ids.FILE;
    if ( blueprintUploadData.hasOwnProperty('type') ){
        type = blueprintUploadData.type;
        logger.debug('request overrides type with value', type);
    } else {
        logger.debug('request does not override type');
    }

    if ( !uploadTypes.isValid(type) ){
        res.status(400).send( { 'message' : 'invalid upload type [' + type + ']' } );
        return;
    } else {
        logger.debug(type, 'is valid upload type');
    }

    function uploadCallback( err, data, statusCode ){
        //logger.info('handling upload callback', err, data );
        if ( !!err ){
            if ( !!err.status ){
                res.status(err.status).send(err);
                return;
            }else{
                res.status(500).send(err);
                return;
            }
            return;
        }

        if ( !!statusCode ){
            res.status(statusCode);
        }
        res.send(data);
    }

    if ( type === uploadTypes.ids.FILE ){
        var readStream = fs.createReadStream( req.files.application_archive.path, { bufferSize: 64 * 1024 });
        services.cloudify4node.uploadBlueprint( cloudifyConf, readStream, blueprintUploadData.opts , uploadCallback);
    }
};
