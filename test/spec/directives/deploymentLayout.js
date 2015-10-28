'use strict';

describe('Directive: deploymentLayout', function () {

    var element, scope;




    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock', function ($provide) {
        $provide.factory('cosmoLayoutDirective', function () {
            return {};
        }); // mock cosmo layout
        $provide.factory('deploymentActionSelectorDirective', function(){
            return {};
        }); // mock workflow selector
    }));

    beforeEach(inject(function ($compile, $rootScope, cloudifyClient ) {
        scope = $rootScope.$new();
        spyOn(cloudifyClient.deployments,'get').andReturn({then:function(){}});
        element = $compile(angular.element('<div class="deployment-layout"></div>'))(scope);
        scope.$digest();
    }));

    afterEach(function () {
        $('#deployment').remove();
    });

    describe('init', function () {
        describe('cloudifyClient.deployments.get', function () {
            it('should put deploymentNotFound=true on scope if result is 404', inject(function ($compile, cloudifyClient) {
                cloudifyClient.deployments.get.andReturn({
                    then: function (success, error) {
                        error({status: 404});
                    }
                });
                element = $compile(angular.element('<div class="deployment-layout"></div>'))(scope);
                scope.$digest();
                expect(scope.deploymentNotFound).toBe(true);
                expect(scope.showDeploymentEvents).toBe(false);
            }));


            it('should put blueprint_id and deployment on scope', inject(function ($compile, cloudifyClient) {
                cloudifyClient.deployments.get.andReturn({
                    then: function (success) {
                        success({ data : { id: 'foo' , 'blueprint_id' : 'bar'} } );
                    }
                });
                element = $compile(angular.element('<div class="deployment-layout"></div>'))(scope);
                scope.$digest();
                expect(scope.blueprintId).toBe('bar');
                expect(scope.deployment.id).toBe('foo');
            }));
        });


    });

    describe('#loadExecution', function(){
        beforeEach(inject(function (ngDialog) {
            spyOn(ngDialog, 'openConfirm').andReturn({
                then: function (success) {
                    success();
                }
            });
        }));

        it('should show error if result returned 500', inject(function (cloudifyClient) {
            spyOn(cloudifyClient.executions, 'list').andReturn({
                then: function (success, error) {
                    error({status: 500});
                }
            });
            scope.loadExecutions();
            expect(scope.errorMessage).toBe('deployment.executions.error');
        }));

        it('should show error and alert dialog if result returned 404', inject(function (cloudifyClient, ngDialog) {
            spyOn(cloudifyClient.executions, 'list').andReturn({
                then: function (success, error) {
                    error({status: 404});
                }
            });
            scope.loadExecutions();
            expect(scope.errorMessage).toBe('deployment.executions.error_404');
            expect(ngDialog.openConfirm).toHaveBeenCalled();
        }));

        it('should redirect back to deployments if result returned 404 and user confirmed in dialog', inject(function ($location, cloudifyClient) {
            spyOn($location, 'path');
            spyOn(cloudifyClient.executions, 'list').andReturn({
                then: function (success, error) {
                    error({status: 404});
                }
            });
            scope.loadExecutions();
            angular.element(document.querySelector('.alert-dialog button')).click();
            expect($location.path).toHaveBeenCalledWith('/deployments');
        }));

        it('should put first running execution on scope.currentExecution', inject(function( cloudifyClient, ExecutionsService ) {

            var executions = [ { 'id' : 'foo' } , { 'id' : 'bar'}, { 'id' : 'running' }, { 'id' : 'not_running'}  ];

            spyOn(ExecutionsService,'isRunning').andCallFake(function( exec ){
                return exec.id === 'running';
            });
            spyOn(cloudifyClient.executions,'list').andReturn({
                then:function( success ){
                    success({ data :  executions });
                }
            });
            scope.loadExecutions();

            expect(scope.currentExecution.id).toBe( 'running' );

            executions = [ { 'id' : 'foo' } ];
            scope.loadExecutions();
            expect(scope.currentExecution).toBe(undefined);
        }));

        it('should return immediately if deploymentNotFound', inject(function( cloudifyClient ){
            scope.deploymentNotFound = true;
            spyOn(cloudifyClient.executions,'list');
            scope.loadExecutions();
            expect(cloudifyClient.executions.list).not.toHaveBeenCalled();
        }));
    });
});
