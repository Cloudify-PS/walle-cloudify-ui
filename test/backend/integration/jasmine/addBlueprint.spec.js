'use strict';

describe('Integration: addBlueprint', function () {
    var cloudify4node = require('../../../../backend/Cloudify4node')
    // ./test/backend/resources/blueprint/blueprint.tar.gz

    it('has a cloudify4node', function () {
        expect(cloudify4node).not.toBeUndefined();
    });

    it('should have addBlueprint method', function () {
        expect(typeof(cloudify4node.addBlueprint)).toBe('function');
    });

    it('should add blueprint successfully', function() {

    });
});
