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

    it('should return the states index', function () {
        var statesIndex = nodeStatus.getStatesIndex();

        expect(statesIndex).not.toBe(undefined);
        expect(statesIndex.length).toEqual(9);
    });

    it('should return the state by index', function () {
        expect(nodeStatus.getStateByIndex(0)).toBe('uninitialized');
        expect(nodeStatus.getStateByIndex(1)).toBe('initializing');
        expect(nodeStatus.getStateByIndex(2)).toBe('creating');
        expect(nodeStatus.getStateByIndex(3)).toBe('created');
        expect(nodeStatus.getStateByIndex(4)).toBe('configuring');
        expect(nodeStatus.getStateByIndex(5)).toBe('configured');
        expect(nodeStatus.getStateByIndex(6)).toBe('starting');
        expect(nodeStatus.getStateByIndex(7)).toBe('started');
        expect(nodeStatus.getStateByIndex(8)).toBe('deleted');
    });

    it('should have install status in status id 0', function () {
        expect(nodeStatus.getStatus(0)).toBe('install');
    });

    it('should have done status in status id 1', function () {
        expect(nodeStatus.getStatus(1)).toBe('done');
    });

    it('should have install status in status id 2', function () {
        expect(nodeStatus.getStatus(2)).toBe('install');
    });

    it('should have failed status in status id 3', function () {
        expect(nodeStatus.getStatus(3)).toBe('failed');
    });

    it('should return empty status as default', function () {
        expect(nodeStatus.getStatus()).toBe('');
    });

    it('should return loading icon in status id 0', function () {
        expect(nodeStatus.getIcon(0)).toBe(' icon-gs-node-status-loading');
    });

    it('should return success icon in status id 1', function () {
        expect(nodeStatus.getIcon(1)).toBe(' icon-gs-node-status-success');
    });

    it('should return loading icon in status id 2', function () {
        expect(nodeStatus.getIcon(2)).toBe(' icon-gs-node-status-loading');
    });

    it('should return failed icon in status id 3', function () {
        expect(nodeStatus.getIcon(3)).toBe(' icon-gs-node-status-fail');
    });

    it('should return no icon in status as default', function () {
        expect(nodeStatus.getIcon()).toBe('');
    });
});
