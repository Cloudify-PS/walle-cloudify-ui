'use strict';

describe('Integration: addDeployment', function () {
//    var fs = require('fs');
    var cloudify4node = require('../../../../backend/Cloudify4node');
//    var fileData = require('../../resources/blueprint/fileData.json');
//    var logger = require('log4js').getLogger('addDeployment');

    it('has a cloudify4node', function () {
        expect(cloudify4node).not.toBeUndefined();
    });

    it('should have addBlueprint method', function () {
        expect(typeof(cloudify4node.addDeployment)).toBe('function');
    });

    it('should add deployment successfully', function() {
        // add deployment with inputs
    });
});