'use strict';

describe('Controller: DeploymentExecutions', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp','backend-mock'));

    var DeploymentExecutions, scope;

    var initCtrl = inject(function($controller){
        DeploymentExecutions = $controller('DeploymentExecutionsCtrl', {
            $scope: scope
        });
    });

    // Initialize the controller, mock scope, and spy on services
    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));


    it('should create a controller', function () {
        initCtrl();
        expect(DeploymentExecutions).not.toBeUndefined();
    });

    it('should load deployment"s executions', inject(function(cloudifyClient){
        var executionsMock = [
            {
                blueprint_id: 'bomber',
                created_at: '2015-10-13 08:42:08.970700',
                deployment_id: 'bombera',
                error: '',
                id: 'b18136f5-dd9c-4177-b231-4fde464ca793',
                is_system_workflow: false,
                parameters: Object,
                status: 'terminated',
                workflow_id: 'create_deployment_environment'
            },
            {
                blueprint_id: 'bomber',
                created_at: '2015-10-13 08:42:55.606661',
                deployment_id: 'bombera',
                error: '',
                id: 'c93b1b68-97eb-468a-b1e2-3471df173f3c',
                is_system_workflow: false,
                parameters: Object,
                status: 'terminated',
                workflow_id: 'install'
            }
        ];
        spyOn(cloudifyClient.executions, 'list').andReturn({
            then: function (success) {
                success({data: executionsMock});
            }
        });
        initCtrl();
        expect(scope.executionsList).toBe(executionsMock);
    }));

    describe('Error handling', function () {

        it('should show error if result returned 500', inject(function (cloudifyClient) {
            spyOn(cloudifyClient.executions, 'list').andReturn({
                then: function (success, error) {
                    error({status: 500});
                }
            });
            initCtrl();
            scope.$digest();
            expect(scope.errorMessage).toBe('deployment.executions.error');
        }));

        it('should show Deployment not found view if result returned 404', inject(function (cloudifyClient) {
            spyOn(cloudifyClient.executions, 'list').andReturn({
                then: function (success, error) {
                    error({status: 404});
                }
            });
            initCtrl();
            scope.$digest();
            expect(scope.deploymentNotFound).toBeTruthy();
        }));
    });

});
