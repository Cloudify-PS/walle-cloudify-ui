'use strict';

describe('Integration: addDeployment', function () {
    var fs = require('fs');
    var cloudify4node = require('../../../../backend/Cloudify4node');
    var logger = require('log4js').getLogger('addDeployment');

    it('has a cloudify4node', function () {
        expect(cloudify4node).not.toBeUndefined();
    });

    it('should have addBlueprint method', function () {
        expect(typeof(cloudify4node.addDeployment)).toBe('function');
    });

    it('should add deployment successfully', function() {
        // add deployment with inputs
        var result;
        var successResult;
        var blueprintName = 'blueprint' + new Date().getTime();
        var deploymentName = 'deployment' + new Date().getTime();
        var requestBody = {
            "blueprint_id": "blueprint1",
            "deployment_id": "deployment1",
            "inputs": {
                "webserver_port": 8080,
                "image_name": "image_name",
                "agent_user": "agent_user",
                "flavor_name": "flavor_name"
            }
        };
        fs.readFile('./test/backend/resources/deployment/createSuccessResult.json', 'utf-8', function (err, data) {
            data = data.replace(/blueprint1/g, blueprintName);
            data = data.replace(/deployment1/g, deploymentName);
            successResult = JSON.parse(data);
        });

        cloudify4node.addDeployment(requestBody, function (data) {
            result = JSON.parse(data);
        });

        waitsFor(function () {
            return result !== undefined && successResult !== undefined;
        }, "waiting for deployment creation result", 5000);

        runs(function () {
            logger.info('deployment creation result returned, checking if result is as expected');
            successResult.updated_at = result.updated_at;
            successResult.created_at = result.created_at;

            expect(JSON.stringify(result)).toBe(JSON.stringify(successResult));
        });
    });
});