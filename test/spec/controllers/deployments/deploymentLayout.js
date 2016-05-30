'use strict';

describe('Controller: DeploymentLayoutCtrl', function () {

    var scope;
    var DeploymentLayoutCtrl, $state, $rootScope, cloudifyClient;

    beforeEach(module('cosmoUiApp', 'backend-mock','templates-main', function ($provide) {
        $provide.factory('deploymentActionSelectorDirective', function(){
            return {};
        }); // mock workflow selector
    }));

    var init = inject(function ( _cloudifyClient_, _$rootScope_, _$state_ ) {
        cloudifyClient = _cloudifyClient_;
        spyOn(cloudifyClient.deployments,'get').and.returnValue({then:function(){}});
        $state = _$state_;
        $state.go('cloudifyLayout.deploymentLayout.topology');
        $rootScope = _$rootScope_;
        $rootScope.$digest();
        scope = $rootScope.$new();
    });

    var initCtrl = inject(function($controller){
        DeploymentLayoutCtrl = $controller('DeploymentLayoutCtrl',{
            $scope: scope
        });
        scope.$digest();
    });

    beforeEach(init);

    describe('init', function () {
        describe('cloudifyClient.deployments.get', function () {
            it('should put deploymentNotFound=true on scope if result is 404', inject(function ( cloudifyClient) {
                cloudifyClient.deployments.get.and.returnValue({
                    then: function (success, error) {
                        error({status: 404});
                    }
                });
                initCtrl();
                expect(scope.deploymentNotFound).toBe(true);
                expect(scope.showDeploymentEvents).toBe(false);
            }));


            it('should put blueprint_id and deployment on scope', inject(function ( cloudifyClient) {
                cloudifyClient.deployments.get.and.returnValue({
                    then: function (success) {
                        success({ data : { id: 'foo' , 'blueprint_id' : 'bar'} } );
                    }
                });
                initCtrl();
                expect(scope.blueprintId).toBe('bar');
                expect(scope.deployment.id).toBe('foo');
            }));
        });


    });

    describe('#loadExecution', function(){
        it('should put first running execution on scope.currentExecution', inject(function(cloudifyClient){
            initCtrl();
            var executions = [ { 'id' : 'foo' } , { 'id' : 'bar'}];

            spyOn(cloudifyClient.executions,'list').and.returnValue({
                then:function( success ){
                    success({ data : {items: executions } });
                }
            });
            scope.loadExecutions();

            expect(scope.currentExecution.id).toBe( 'foo' );
        }));

        it('should get only running executions', inject(function(cloudifyClient) {
            initCtrl();
            var expectedParameters = {
                deployment_id : scope.deploymentId,
                _include: 'id,workflow_id,status',
                status: ['pending', 'started', 'cancelling', 'force_cancelling']
            };
            spyOn(cloudifyClient.executions,'list').and.callFake(function(){
                return {
                    then:function(/*success,error*/){}
                };
            });

            scope.loadExecutions();

            expect(cloudifyClient.executions.list).toHaveBeenCalledWith(expectedParameters);
        }));

        it('should return immediately if deploymentNotFound', inject(function( cloudifyClient ){
            initCtrl();
            scope.deploymentNotFound = true;
            spyOn(cloudifyClient.executions,'list');
            scope.loadExecutions();
            expect(cloudifyClient.executions.list).not.toHaveBeenCalled();
        }));

        it('should redirect after deletion', function(){
            initCtrl();
            expect($state.current.name).toBe('cloudifyLayout.deploymentLayout.topology');
            scope.goToDeployments();
            $rootScope.$digest();
            expect($state.current.name).toBe('cloudifyLayout.deployments');

        });

        it('should not redirect after deletion if some navigation happened in between', function(){
            initCtrl();
            $state.go('config');
            $rootScope.$digest();
            expect($state.current.name).toBe('config');
            scope.goToDeployments();
            $rootScope.$digest();
            expect($state.current.name).toBe('config');
        });
    });

    describe('#loadDeploymentUpdates', function(){
        beforeEach(function(){
            spyOn(scope, 'registerTickerTask').and.callFake(function(id, callback){
                if(id.indexOf('loadDeploymentUpdates') !== -1){
                    callback();
                }
            });
            spyOn(cloudifyClient.deploymentUpdates, 'list').and.returnValue(window.mockPromise({data: {items: [{state: 'committing'}]}}));
            scope.deployment_id = 'dep1';
        });

        it('should load deployment updates', function(){
            initCtrl();
            expect(cloudifyClient.deploymentUpdates.list).toHaveBeenCalled();
            expect(scope.currentUpdate).toEqual({state: 'committing'});

            cloudifyClient.deploymentUpdates.list.and.returnValue(window.mockPromise({data: {items: [{state: 'committed'}]}}));
            initCtrl();
            expect(cloudifyClient.deploymentUpdates.list).toHaveBeenCalled();
            expect(scope.currentUpdate).toEqual(undefined);
        });

        it('should redirect after update committed', function(){
            cloudifyClient.deploymentUpdates.list.and.returnValue(window.mockPromise({data: {items: [{state: 'committed'}]}}));
            initCtrl();
            spyOn(scope, 'goToDeployments').and.callThrough();
            scope.reloadDeployment();
            expect(scope.goToDeployments).toHaveBeenCalled();
        });

        it('should not redirect after update failed', function(){
            cloudifyClient.deploymentUpdates.list.and.returnValue(window.mockPromise({data: {items: [{state: 'failed'}]}}));
            initCtrl();
            spyOn(scope, 'goToDeployments').and.callThrough();
            scope.reloadDeployment();
            expect(scope.goToDeployments).not.toHaveBeenCalled();
        });
    });
});
