'use strict';

describe('Integration: addBlueprint', function () {
    var fs = require('fs');
    var cloudify4node = require('../../../../backend/Cloudify4node');
    var fileData = require('../../resources/blueprint/fileData.json');
    var logger = require('log4js').getLogger('addBlueprint');

    it('has a cloudify4node', function () {
        expect(cloudify4node).not.toBeUndefined();
    });

    it('should have addBlueprint method', function () {
        expect(typeof(cloudify4node.addBlueprint)).toBe('function');
    });

    it('should add blueprint successfully', function() {
        var result;
        var successResult;
        var blueprintName = 'blueprint' + new Date().getTime();

        logger.info('reading the expected result for further comparison');
        fs.readFile('./test/backend/resources/blueprint/successResult.json', 'utf-8', function (err, data) {
            successResult = JSON.parse(data);
            successResult.id = blueprintName;
        });

        waitsFor(function () {
            return fileData !== undefined;
        }, "waiting for success result file to be loaded", 3000);

        runs(function () {
            logger.info('fileData loaded, uploading blueprint to manager');
            cloudify4node.addBlueprint(fileData, blueprintName, function (data) {
                result = JSON.parse(data);
            });
        });

        waitsFor(function () {
            return result !== undefined && successResult !== undefined;
        }, "waiting for upload result", 10000);

        runs(function () {
            logger.info('blueprint upload result returned, checking if result is as expected');
            successResult.updated_at = result.updated_at;
            successResult.created_at = result.created_at;

            expect(JSON.stringify(result)).toBe(JSON.stringify(successResult));
        });
    });
});
