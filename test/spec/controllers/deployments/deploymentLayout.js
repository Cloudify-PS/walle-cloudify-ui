'use strict';

describe('Controller: DeploymentLayoutCtrl', function () {

    var scope;
    var DeploymentLayoutCtrl, $state, $rootScope;

    beforeEach(module('cosmoUiApp', 'backend-mock','templates-main', function ($provide) {
        $provide.factory('deploymentActionSelectorDirective', function(){
            return {};
        }); // mock workflow selector
    }));

    var init = inject(function ( cloudifyClient, _$rootScope_, _$state_ ) {
        spyOn(cloudifyClient.deployments,'get').and.returnValue({then:function(){}});
        $state = _$state_;
        $state.go('cloudifyLayout.deploymentLayout.topology');
        $rootScope = _$rootScope_;
        $rootScope.$digest();
    });

    var initCtrl = inject(function($controller, $rootScope){
        scope = $rootScope.$new();
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
});
