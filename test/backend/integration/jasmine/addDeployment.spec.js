'use strict';

/*jshint camelcase: false */
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
        var blueprints = null;
        var result = null;
        var successResult = null;
        var blueprintName = 'blueprint' + new Date().getTime();
        var deploymentName = 'deployment' + new Date().getTime();
        var requestBody = {
            'blueprint_id': blueprintName,
            'deployment_id': deploymentName,
            'inputs': {
                'webserver_port': 8080,
                'image_name': 'image_name',
                'agent_user': 'agent_user',
                'flavor_name': 'flavor_name'
            }
        };
        fs.readFile('./test/backend/resources/deployment/createSuccessResult.json', 'utf-8', function (err, data) {
            successResult = JSON.parse(data);
            successResult.id = deploymentName;
            successResult.blueprint_id = blueprintName;
        });

        cloudify4node.getBlueprints(function(err, data) {
            blueprints = JSON.parse(data);
        });

        waitsFor(function () {
            return blueprints !== null;
        }, 'waiting for blueprints list to be loaded', 5000);

        runs(function() {
            logger.info('blueprints loaded, creating deployment');
            requestBody.blueprint_id = blueprints[0].id;
            cloudify4node.addDeployment(requestBody, function (err, data) {
                result = JSON.parse(data);
            });
        });

        waitsFor(function () {
            return result !== null && successResult !== null;
        }, 'waiting for deployment creation result', 5000);

        runs(function () {
            logger.info('deployment creation result returned, checking if result is as expected');
            successResult.updated_at = result.updated_at;
            successResult.created_at = result.created_at;
            successResult.blueprint_id = blueprints[0].id;

            expect(result).toEqual(successResult);
        });
    });
});