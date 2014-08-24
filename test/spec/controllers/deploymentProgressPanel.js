'use strict';

describe('Controller: DeploymentProgressPanelCtrl', function () {

    var DeploymentProgressPanelCtrl, scope;
    var nodes = [{
        "node_id": "node1",
        "state": "uninitialized",
        "deployment_id": "deployment1",
        "id": "node1_de274",
        "node_instances": [{
            "deployment_id": "deployment1",
            "state": "uninitialized"
        }]
    }, {
        "node_id": "node2",
        "state": "uninitialized",
        "deployment_id": "deployment1",
        "id": "node2_017f8",
        "node_instances": [{
                "deployment_id": "deployment1",
                "state": "uninitialized"
            }, {
                "deployment_id": "deployment1",
                "state": "started"
            }]
    }, {
        "node_id": "node3",
        "state": "uninitialized",
        "deployment_id": "deployment1",
        "id": "node3_25649",
        "node_instances": [{
            "deployment_id": "deployment1",
            "state": "uninitialized"
        }, {
            "deployment_id": "deployment1",
            "state": "started"
        }, {
            "deployment_id": "deployment1",
            "state": "failed"
        }]
    }];

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock'));

    // Initialize the controller and a mock scope
    describe('Test setup', function() {
        it ('', inject(function ($controller, $rootScope, $httpBackend, EventsService) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

            EventsService.newInstance = function() {
                return {
                    filter: function() {
                        return null;
                    },
                    execute: function() {
                        return null;
                    },
                    stopAutoPull: function() {
                        return null;
                    }
                };
            };

            scope = $rootScope.$new();

            DeploymentProgressPanelCtrl = $controller('DeploymentProgressPanelCtrl', {
                $scope: scope,
                EventsService: EventsService
            });

            scope.$digest();
        }));
    });

    describe('Controller tests', function() {
        it('should create a controller', function () {
            expect(DeploymentProgressPanelCtrl).not.toBeUndefined();
        });

        it('should be opened when toggling while panelOpen variable is false', function() {
            scope.panelOpen = false;

            scope.togglePanel();

            expect(scope.panelOpen).toBe(true);
        });

        it('should be closed when toggling while panelOpen variable is true', function() {
            scope.panelOpen = true;

            scope.togglePanel();

            expect(scope.panelOpen).toBe(false);
        });

        it('should update panel data to be empty before nodes are updated', function() {
            scope.$apply();

            expect(scope.panelData).toEqual({});
        });

        it('should update panel data when nodes are updated', function() {
            scope.nodes = nodes;

            scope.$apply();

            expect(scope.panelData['node1']).toBeDefined();
            expect(scope.panelData['node1'].totalCount).toBe(1);
            expect(scope.panelData['node1'].status).toBe('uninitialized');
            expect(scope.panelData['node1'].inProgress.count).toBe(1);

            expect(scope.panelData['node2']).toBeDefined();
            expect(scope.panelData['node2'].totalCount).toBe(2);
            expect(scope.panelData['node2'].inProgress.count).toBe(1);
            expect(scope.panelData['node2'].started.count).toBe(1);

            expect(scope.panelData['node3']).toBeDefined();
            expect(scope.panelData['node3'].totalCount).toBe(3);
            expect(scope.panelData['node3'].inProgress.count).toBe(1);
            expect(scope.panelData['node3'].started.count).toBe(1);
            expect(scope.panelData['node3'].failed.count).toBe(1);
        });
    });
});
