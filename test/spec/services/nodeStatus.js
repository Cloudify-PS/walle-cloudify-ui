'use strict';

describe('Service: nodeStatus', function () {
    // load the service's module
    beforeEach(module('cosmoUiApp','backend-mock'));

    // instantiate service
    var nodeStatus;
    beforeEach(inject(function (_nodeStatus_) {
        nodeStatus = _nodeStatus_;
    }));


    describe('get states index', function(){
        it('should return statesIndex', function(){
            expect(nodeStatus.getStatesIndex().length > 0).toBe(true);
        });
    });

    describe('getStateByIndex', function(){
        it('should return state by index' ,function(){
            expect(nodeStatus.getStateByIndex(7)).toBe('started');
        });
    });

    describe('getNodeStatus', function(){
        it('should return 0 if no process', function(){
            expect(nodeStatus.getNodeStatus(null,null,false)).toBe(0);
            expect(nodeStatus.getNodeStatus(null,null,0)).toBe(0);
        });

        it('should return 1 if process is 100', function(){
            expect(nodeStatus.getNodeStatus(null,null,100)).toBe(1);
        });

        it('should return undefined if process is negative or over 100', function(){
            expect(nodeStatus.getNodeStatus(null,null,101)).toBe(undefined);
            expect(nodeStatus.getNodeStatus(null,null,-1)).toBe(undefined);
        });

        describe('other values of process ', function(){
            var process = 80;
            it('should return 0 if deploymentInProgress ', function(){
                expect(nodeStatus.getNodeStatus(null,true, process)).toBe(0);
            });

            it('should return 3 if not in progress and completed=0', function(){
                expect(nodeStatus.getNodeStatus({completed:0}, false, process)).toBe(3);
            });

            it('should return 2 if deployment completed is not 0 and not in progress', function(){
                expect(nodeStatus.getNodeStatus({completed:1}, false, process)).toBe(2);
            });
        });
    });

    describe('#getCompleteProgress', function(){
        it('should return the number that represents all instances started', function(){
            expect(nodeStatus.getCompleteProgress([{},{},{}])).toBe(21);
        });
    });

    describe('#iscompleted', function(){
        it('should do the same as isStarted', function(){
            spyOn(nodeStatus,'isStarted');
            nodeStatus.isCompleted();
            expect(nodeStatus.isStarted).toHaveBeenCalled();
        });
    });

    describe('#getStateWeight', function(){
        it('should return 0 if node is deleted', function(){
            expect(nodeStatus.getStateWeight({state:'deleted'})).toBe(0);
        });

        it('should return a value of status by index otherwise', function(){
            expect(nodeStatus.getStateWeight({state:'started'})).toBe(7);
        });
    });

    describe('#isDeleted', function(){
        it('should return if node is deleted', function(){
            expect(nodeStatus.isDeleted({state:'deleted'})).toBe(true);
        });
    });

    describe('#isInProgress', function(){
        it('should return true if node is not uninitialized or deleted', function(){
            expect(nodeStatus.isInProgress({state:'deleted'})).toBe(false,'not in progress because deleted');
            expect(nodeStatus.isInProgress({state:'uninitialized'})).toBe(false,'not in progress because uninitialized');
            expect(nodeStatus.isInProgress({state:'started'})).toBe(true, 'in progress because started');
        });
    });

    describe('#isUninitialized',function(){
        it('should return true if instance is not in progress', function(){
            expect(nodeStatus.isUninitialized({state:'deleted'})).toBe(true,'uninitialized because deleted');
            expect(nodeStatus.isUninitialized({state:'uninitialized'})).toBe(true,'uninitialized because uninitialized');
            expect(nodeStatus.isUninitialized({state:'started'})).toBe(false, 'in progress because started');
        });
    });

    describe('#getStatus', function(){

        var NODE_STATUS = null;

        beforeEach(function () {
            NODE_STATUS = nodeStatus.getNodeStatusEnum();
        });
        it('should return failed if not in progress and none completed', function(){
            expect(nodeStatus.getStatus(false, [{state:'starting'}])).toBe( NODE_STATUS.FAILED );
        });

        it('should return alert if not in progress and some completed but some did not', function(){
            expect(nodeStatus.getStatus(false, [{state:'starting'},{state:'started'}])).toBe(NODE_STATUS.ALERT);
        });

        it('should return DONE if all completed (none failed)', function(){
            expect(nodeStatus.getStatus(false, [{state:'started'}])).toBe(NODE_STATUS.DONE);
        });

        it('should be loading if in progress and not all nodes completed', function(){
            expect(nodeStatus.getStatus(true, [{state:'starting'}])).toBe(NODE_STATUS.LOADING);
        });
    });

    describe('#isStarted', function(){
        it('should return true if instance started', function(){
            expect(nodeStatus.isStarted({state:'started'})).toBe(true);
        });
    });

    describe('calculateProgress', function(){
        it('should return overall progress of installation', function(){

            expect(nodeStatus.calculateProgress([{state:'started'}])).toBe(100);
            expect(Math.floor(nodeStatus.calculateProgress([{state:'starting'}]))).toBe(85);
            expect(Math.floor(nodeStatus.calculateProgress([{state:'starting'}, {state:'started'}]))).toBe(92);
            expect(nodeStatus.calculateProgress([{state:'deleted'}, {state:'deleted'}])).toBe(0);

            // when there's zero instances, we want the progress to equal zero
            expect(nodeStatus.calculateProgress()).toBe(0);

        });
    });



});
