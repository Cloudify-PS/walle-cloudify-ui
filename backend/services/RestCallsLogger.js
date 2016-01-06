'use strict';
/**
 * This service makes sure rest calls logs are written or not to a separate file
 * and packs them to tar.gz on demand.
 *
 * COMMENT: currently not in use !!!
 * https://cloudifysource.atlassian.net/browse/CFY-2446
 *
 *
 * @type {exports}
 */
//var compressSrv = require('./services/CompressService');
//var fs = require('fs');

exports.getLogsExportFile = function (/*conf,callback*/) {
    //var filePath = path.join(conf.logs.folder, conf.logs.file);
    //
    //compressSrv.pack(conf.logs.file, conf.logs.folder, function(err) {
    //    fs.exists(filePath, function (exists) {
    //        if (exists) {
    //            var stat = fs.statSync(filePath);
    //            response.writeHead(200, {
    //                'Content-Type': 'application/x-gzip',
    //                'Content-Length': stat.size
    //            });
    //            var readStream = fs.createReadStream(filePath);
    //            readStream.pipe(response);
    //        } else {
    //            callback(err, null);
    //        }
    //    });
    //});
};
