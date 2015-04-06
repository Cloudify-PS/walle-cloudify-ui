'use strict';

describe('Service: nodeStatus', function () {
    // load the service's module
    beforeEach(module('cosmoUiApp', 'gsUiHelper'));

    // instantiate service
    var nodeStatus;
    beforeEach(inject(function (_nodeStatus_) {
        nodeStatus = _nodeStatus_;
    }));

    it('should have nodeStatus service available', function () {
        expect(!!nodeStatus).toBe(true);
    });

    it('should have install status in status id 0', function() {
        expect(nodeStatus.getStatus(0)).toBe('install');
    });

    it('should have done status in status id 1', function() {
        expect(nodeStatus.getStatus(1)).toBe('done');
    });

    it('should have install status in status id 2', function() {
        expect(nodeStatus.getStatus(2)).toBe('install');
    });

    it('should have failed status in status id 3', function() {
        expect(nodeStatus.getStatus(3)).toBe('failed');
    });

    it('should return empty status as default', function() {
        expect(nodeStatus.getStatus()).toBe('');
    });
});
