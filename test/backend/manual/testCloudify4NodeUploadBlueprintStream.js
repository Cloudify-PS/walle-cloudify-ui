'use strict';

var logger = require('log4js').getLogger('testCloudify4NodeUploadBlueprintStream');
var fs = require('fs');
var request = require('request');
var Cloudify4node = require('../../../backend/Cloudify4node');
/***************** main *****************/
function main() {
    function loadFromFile() {
        var fs = require('fs');
        var readStream = fs.createReadStream('../../../dev/master.tar.gz', {bufferSize: 64 * 1024});
        logger.info('opened readStream');
        Cloudify4node.uploadBlueprint(readStream, {
            'blueprint_id': 'guy' + new Date().getTime(),
            'params': {'application_file_name': 'ec2-blueprint.yaml'}
        }, function () {
            logger.info('upload callback', arguments);
        });
    }

    function oldFashionedUpload() {
        Cloudify4node.addBlueprint({'path': '../../../dev/master.tar.gz'}, 'guy1234', function () {
            logger.info('old fashioned callback', arguments);
        });
    }

    function urlStreamUpload(url) {

        var myWriteStream = fs.createWriteStream('myBlueprint.tar.gz');

        function readResponse(streamReader) {
            streamReader
                .on('readable', function () {
                    logger.info('stream is readable');

                    var chunk;
                    while (null !== (chunk = streamReader.read())) {
                        logger.info('writing chunk', chunk);
                        myWriteStream.write(chunk);
                    }
                    logger.info('chunk not writeable', chunk);
                }).on('end', function () {
                    logger.info('stream end');
                    myWriteStream.end();
                });
        }

        //var ajax = require('http');
        //if ( url.indexOf('https') === 0){
        //    ajax = require('https');
        //}
        //
        //ajax.get(url, function(res){
        //
        //    if ( res.statusCode !== 200 ){
        //        if ( !!res.headers.location ){
        //            urlStreamUpload(res.headers.location);
        //            return;
        //        }else{
        //            logger.error('unable to read request. status code was', res.statusCode );
        //        }
        //
        //    }else{
        //        readResponse(res);
        //    }
        //
        //});

        request.get(url).on('response', function (response) {

            //logger.info('http read stream!!! go!!!', response.statusCode, response.headers );
            //logger.info(response);
            readResponse(response);
            //Cloudify4node.uploadBlueprint(response, { 'blueprint_id': 'guy' + new Date().getTime(), 'params': { 'application_file_name': 'ec2-blueprint.yaml'} }, function () {
            //    logger.info('upload callback', arguments);
        });

        //}).on('error', function(err){
        //    logger.error('got error', err);
        //});
        //
        //logger.info('this is theresponse headers', theResponse.headers);

    }

    process.on('uncaughtException', function (err) {
        logger.error('uncaught error', err);
    });
    urlStreamUpload('https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/master.tar.gz');
    loadFromFile();
    oldFashionedUpload();
}

if (require.main === module) {
    main();
}
