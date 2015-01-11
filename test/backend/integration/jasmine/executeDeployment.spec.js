'use strict';

/*jshint camelcase: false */
describe('Integration: executeDeployment', function () {
    var fs = require('fs');
    var cloudify4node = require('../../../../backend/Cloudify4node');
    var logger = require('log4js').getLogger('executeDeployment');

    it('has a cloudify4node', function () {
        expect(cloudify4node).not.toBeUndefined();
    });

    it('should have executeDeployment method', function () {
        expect(typeof(cloudify4node.executeDeployment)).toBe('function');
    });

    it('should execute deployment successfully', function() {
        // add deployment with inputs
        var result;
        var successResult = null;
        var deployments = null;
        var requestBody = {
            'workflow_id': 'install',
            'deployment_id': null
        };

        cloudify4node.getDeployments(function(err, data) {
            deployments = JSON.parse(data);
        });

        waitsFor(function() {
            return deployments !== null;
        });

        runs(function() {
            fs.readFile('./test/backend/resources/execution/executionSuccessResult.json', 'utf-8', function (err, data) {
                successResult = JSON.parse(data);
                successResult.blueprint_id = deployments[0].blueprint_id;
                successResult.deployment_id = deployments[0].id;
            });

            requestBody.deployment_id = deployments[0].id;
            cloudify4node.executeDeployment(requestBody, function (err, data) {
                result = JSON.parse(data);
            });
        });

        waitsFor(function () {
            return result !== undefined;
        }, 'waiting for deployment execution result', 5000);

        runs(function () {
            logger.info('deployment execution result returned, checking if as expected');
            successResult.id = result.id;
            successResult.created_at = result.created_at;

            expect(JSON.stringify(result)).toBe(JSON.stringify(successResult));
        });
    });
});