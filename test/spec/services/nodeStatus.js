'use strict';

describe('Service: nodeStatus', function () {
    // load the service's module
    beforeEach(module('cosmoUiApp','backend-mock'));

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
        expect(nodeStatus.getStatusClass(0)).toBe('install');
    });

    it('should have done status in status id 1', function () {
        expect(nodeStatus.getStatusClass(1)).toBe('done');
    });

    it('should have alerts status in status id 2', function () {
        expect(nodeStatus.getStatusClass(2)).toBe('alerts');
    });

    it('should have failed status in status id 3', function () {
        expect(nodeStatus.getStatusClass(3)).toBe('failed');
    });

    it('should return empty status as default', function () {
        expect(nodeStatus.getStatusClass()).toBe('');
    });

    it('should return loading icon in status id 0', function () {
        expect(nodeStatus.getIconClass(0)).toBe(' icon-gs-node-status-loading');
    });

    it('should return success icon in status id 1', function () {
        expect(nodeStatus.getIconClass(1)).toBe(' icon-gs-node-status-success');
    });

    it('should return alerts icon in status id 2', function () {
        expect(nodeStatus.getIconClass(2)).toBe(' icon-gs-node-status-alert');
    });

    it('should return failed icon in status id 3', function () {
        expect(nodeStatus.getIconClass(3)).toBe(' icon-gs-node-status-fail');
    });

    it('should return no icon in status as default', function () {
        expect(nodeStatus.getIconClass()).toBe('');
    });

    it('should test getNodeStatus', function () {
        var deployment = {
            completed: 0
        };

        expect(nodeStatus.getNodeStatus(deployment, undefined, false)).toBe(0);
        expect(nodeStatus.getNodeStatus(deployment, undefined, 100)).toBe(1);
        expect(nodeStatus.getNodeStatus(deployment, {}, 55)).toBe(0);
        expect(nodeStatus.getNodeStatus(deployment, undefined, 55)).toBe(3);

        deployment.completed = 2;
        expect(nodeStatus.getNodeStatus(deployment, undefined, 55)).toBe(2);
        expect(nodeStatus.getNodeStatus(deployment, undefined, 0)).toBe(0);

    });
});
