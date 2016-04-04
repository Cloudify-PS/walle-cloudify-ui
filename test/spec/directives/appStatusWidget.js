'use strict';

describe('Directive: appStatusWidget', function () {

    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    var element, scope, cloudifyClient, NodeService;

    beforeEach(inject(function ($rootScope, $compile, _cloudifyClient_, _NodeService_) {
        cloudifyClient = _cloudifyClient_;
        NodeService = _NodeService_;
        spyOn(cloudifyClient.executions,'getRunningExecutions').and.returnValue(window.mockPromise(
            {
                data:{
                    items:[]
                }
            }
        ));
        spyOn(cloudifyClient.nodeInstances,'list').and.returnValue(window.mockPromise(
            {
                data:{
                    items:[]
                }
            }
        ));
        spyOn(NodeService.status,'calculateProgress').and.returnValue(0);

        scope = $rootScope.$new();
        scope.deploymentId = 'dep';
        element = angular.element('<div app-status-widget deployment-id="deploymentId"></div>');
        element = $compile(element)(scope);
    }));

    it('should not show if execution is running',function(){
        cloudifyClient.executions.getRunningExecutions.and.returnValue(window.mockPromise({
            data:{
                items:[
                    {execution:'exec1'},
                    {execution:'exec2'}
                ]
            }
        }));
        scope.$digest();

        expect(cloudifyClient.executions.getRunningExecutions).toHaveBeenCalled();
        expect(element.isolateScope().succeed).toBe(undefined);
    });

    it('should not show when no execution is running /completed / failed',function(){
        scope.$digest();

        expect(NodeService.status.calculateProgress).toHaveBeenCalled();
        expect(element.isolateScope().succeed).toBe(undefined);
    });

    it('should show error when execution failed',function(){
        NodeService.status.calculateProgress.and.returnValue(21);
        scope.$digest();

        expect(NodeService.status.calculateProgress).toHaveBeenCalled();
        expect(element.isolateScope().succeed).toBe(false);
    });

    it('should show success when execution succeed',function(){
        NodeService.status.calculateProgress.and.returnValue(100);
        scope.$digest();

        expect(NodeService.status.calculateProgress).toHaveBeenCalled();
        expect(element.isolateScope().succeed).toBe(true);

    });
});
