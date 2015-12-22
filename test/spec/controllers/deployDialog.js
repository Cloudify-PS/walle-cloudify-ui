'use strict';

/*jshint camelcase: false */
describe('Controller: DeployDialogCtrl', function () {
    var DeployDialogCtrl;
    var scope;

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    beforeEach(inject(function ($controller, $rootScope, cloudifyClient) {

        spyOn(cloudifyClient.blueprints, 'get').andCallFake(function () {
            return {
                then: function (success) {
                    success({data: {items: []}});
                }
            };
        });

        scope = $rootScope.$new();
        scope.blueprintId = 'foo';
        scope.redirectToDeployment = jasmine.createSpy(); // todo: this should be handled with `on close` for dialog
        DeployDialogCtrl = $controller('DeployDialogCtrl', {
            $scope: scope
        });
    }));

    beforeEach(function () {
        scope.inputs = {
            'webserver_port': 8080,
            'image_name': 'image_name',
            'agent_user': 'agent_user',
            'flavor_name': 'flavor_name',
            'bool_variable': false,
            'str_variable': 'some string'
        };

        scope.rawString = JSON.stringify(scope.inputs);

        scope.selectedBlueprint = {plan: {}};
    });

    it('should create a controller', function () {
        expect(DeployDialogCtrl).not.toBeUndefined();
    });

    it('should disable blueprint deploy option if deployment name is not provided', function () {
        scope.selectedBlueprint = {};
        scope.deployment_id = null;

        expect(scope.isDeployEnabled()).toBe(false);
    });

    it('should enable blueprint deploy option if deployment name is provided', function () {
        scope.selectedBlueprint = {};
        scope.deployment_id = 'deployment1';

        expect(scope.isDeployEnabled()).toBe(true);
    });

    it('should pass all params provided to CloudifyService on deployment creation', inject(function (cloudifyClient) {
        var deployParams = null;
        spyOn(cloudifyClient.deployments, 'create').andCallFake(function (params) {
            deployParams = params;
            return {
                then: function () {
                }
            };
        });

        scope.deployment_id = 'deployment1';
        scope.deployBlueprint('blueprint1');

        expect(deployParams).not.toBe(null);
        expect(cloudifyClient.deployments.create).toHaveBeenCalledWith('blueprint1', 'deployment1', {
            webserver_port: 8080,
            image_name: 'image_name',
            agent_user: 'agent_user',
            flavor_name: 'flavor_name',
            bool_variable: false,
            str_variable: 'some string'
        });
    }));

    it('should not validate deployment name', inject(function (cloudifyClient) {
        spyOn(cloudifyClient.deployments, 'create').andCallFake(function () {
            scope.inProcess = false;
            scope.redirectToDeployment(scope.deployment_id);
            return {
                then: function () {

                }
            };
        });

        scope.deployment_id = '~~~!!!@@@';
        scope.inputsState = 'raw';

        spyOn(scope, 'isDeployEnabled').andCallFake(function () {
            return true;
        });

        scope.deployBlueprint('blueprint1');

        expect(scope.redirectToDeployment).toHaveBeenCalledWith(scope.deployment_id);
    }));

    it('should set showError flag to true once deploy returned message', inject(function (cloudifyClient) {
        spyOn(cloudifyClient.deployments, 'create').andCallFake(function () {
            return {
                then: function (success/*, error*/) {
                    success({data: {'message': 'foo'}});
                }
            };
        });

        spyOn(scope, 'isDeployEnabled').andCallFake(function () {
            return true;
        });

        scope.deployment_id = 'deployment1';
        scope.deployBlueprint('blueprint1');

        expect(scope.deployErrorMessage).toBe('foo');
        expect(scope.showError()).toBe(true);
    }));

    it('should set showError flag to false once the deployment name is changed', function () {
        scope.deployment_id = 'deployment1';
        scope.deployErrorMessage = 'hello';

        scope.deployment_id = 'deployment2';

        scope.$apply();

        expect(scope.showError()).toBe(false);
    });

    describe('#isParamsVisible', function () {
        it('should return false if selectedBlueprint is null', function () {
            scope.selectedBlueprint = null;
            expect(!!scope.isParamsVisible()).toBe(false);
        });

        it('should return true if selected blueprint has inputs', function () {
            scope.selectedBlueprint = {plan: {inputs: []}};
            expect(!!scope.isParamsVisible()).toBe(true);
        });
    });

});
