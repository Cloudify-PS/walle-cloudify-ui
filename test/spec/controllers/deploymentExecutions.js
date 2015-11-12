'use strict';

describe('Controller: DeploymentExecutions', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp','backend-mock'));

    var DeploymentExecutions, scope;
    var _cloudifyClient;

    var initCtrl = inject(function($controller){
        DeploymentExecutions = $controller('DeploymentExecutionsCtrl', {
            $scope: scope
        });
    });

    // Initialize the controller, mock scope, and spy on services
    beforeEach(inject(function ($rootScope ,cloudifyClient) {
        scope = $rootScope.$new();
        _cloudifyClient = cloudifyClient;
        spyOn(cloudifyClient.executions, 'list').andReturn(window.mockPromise({data : {items : []}})); //default implementation can be override
        initCtrl();
    }));




    it('should create a controller', function () {
        expect(DeploymentExecutions).not.toBeUndefined();
    });

    it('should load deployment"s executions',function(){
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
        _cloudifyClient.executions.list.andReturn(window.mockPromise({data : {items : executionsMock}}));
        initCtrl();
        expect(scope.executionsList).toBe(executionsMock);
    });

});
