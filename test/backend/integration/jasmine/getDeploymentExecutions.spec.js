'use strict';

describe('Integration: getDeploymentExecutions', function () {
    var fs = require('fs');
    var cloudify4node = require('../../../../backend/Cloudify4node');
    var logger = require('log4js').getLogger('getDeploymentExecutions');

    it('has a cloudify4node', function () {
        expect(cloudify4node).not.toBeUndefined();
    });

    it('should have getDeploymentExecutions method', function () {
        expect(typeof(cloudify4node.getDeploymentExecutions)).toBe('function');
    });

    it('should get deployment executions successfully', function() {
        // add deployment with inputs
        var result;
        var deployments = null;
        var deploymentId = null;

        cloudify4node.getDeployments(function(err, data) {
            deployments = JSON.parse(data);
        });

        waitsFor(function() {
            return deployments !== null;
        });

        runs(function() {
            deploymentId = deployments[0].id;
            cloudify4node.getDeploymentExecutions(deploymentId, function (err, data) {
                result = JSON.parse(data);
            });
        });

        waitsFor(function () {
            return result !== undefined;
        }, "waiting for deployment executions list result", 5000);

        runs(function () {
            logger.info('deployment executions result returned, checking if all executions are related to the requested deployment');
            var wrongDeploymentId = false;

            if (result.length > 0) {
                for(var i = 0; i < result.length; i++) {
                    if (result[i].deployment_id !== deploymentId) {
                        wrongDeploymentId = true;
                    }
                }
            }

            expect(wrongDeploymentId).toBe(false);
        });
    });
});