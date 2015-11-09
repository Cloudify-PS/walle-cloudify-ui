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
        it('should put first running execution on scope.currentExecution', inject(function( cloudifyClient ) {

            var executions = [ { 'id' : 'foo' } , { 'id' : 'bar'}, { 'id' : 'running' }, { 'id' : 'not_running'}  ];

            spyOn(cloudifyClient.executions,'list').andReturn({
                then:function( success ){
                    success({ data :  executions });
                }
            });
            scope.loadExecutions();

            expect(scope.currentExecution.id).toBe( 'foo' );
        }));

        it('should get only running executions', inject(function(cloudifyClient) {
            var expectedParameters = {
                deployment_id : scope.deploymentId,
                _include: 'id,workflow_id,status',
                status: ['pending', 'started', 'cancelling', 'force_cancelling']
            };
            spyOn(cloudifyClient.executions,'list').andCallFake(function(){
                return {
                    then:function(/*success,error*/){}
                };
            });

            scope.loadExecutions();

            expect(cloudifyClient.executions.list).toHaveBeenCalledWith(expectedParameters);
        }));

        it('should return immediately if deploymentNotFound', inject(function( cloudifyClient ){
            scope.deploymentNotFound = true;
            spyOn(cloudifyClient.executions,'list');
            scope.loadExecutions();
            expect(cloudifyClient.executions.list).not.toHaveBeenCalled();
        }));
    });
});
