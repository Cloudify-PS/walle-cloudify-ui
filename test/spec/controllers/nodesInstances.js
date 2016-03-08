'use strict';

describe('Controller: NodesInstancesCtrl', function () {

    /*jshint camelcase: false */
    var NodesInstancesCtrl;
    var scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, cloudifyClient) {

        scope = $rootScope.$new();

        spyOn(cloudifyClient.deployments, 'list').and.returnValue(window.mockPromise());
        spyOn(cloudifyClient.nodes, 'list').and.returnValue(window.mockPromise());

        NodesInstancesCtrl = $controller('NodesInstancesCtrl', {
            $scope: scope
        });
        scope.$digest();
    }));

    describe('#clearFilter', function () {
        it('should reset nodesInstancesFilter on scope', function () {
            scope.nodesInstancesFilter = 'foo';
            scope.clearFilter();
            expect(scope.nodesInstancesFilter.blueprint).toBe(null);
        });
    });

    describe('#resetTypeFilter', function () {

        it('should set Compute type on filter', function () {
            scope.nodesInstancesFilter = {};
            scope.resetTypesFilter();
            expect(scope.nodesInstancesFilter.types.length).toBe(1);
            expect(scope.nodesInstancesFilter.types[0].value).toBe('cloudify.nodes.Compute');
        });
    });

    describe('#loadDeploymentsAndBlueprints', function () {
        beforeEach(inject(function (cloudifyClient) {
            cloudifyClient.deployments.list.and.returnValue({
                then: function (success) {
                    success({
                        data: {
                            items: [{
                                'id': 'foo',
                                'blueprint_id': 'bar'
                            }]
                        }
                    });
                }
            });
        }));

        it('should map blueprint_id to deployment_id', function () {
            scope.loadDeploymentsAndBlueprints();
            expect(scope.getDeployments().foo).toBe('bar');
        });
    });

    describe('#loadNodeInstances', function () {

    });

    describe('#loadTypesData', function () {
        beforeEach(inject(function (cloudifyClient) {
            cloudifyClient.nodes.list.and.returnValue({
                then: function (success) {
                    success({
                        data: {
                            items: [
                                {
                                    'deployment_id': 'foo',
                                    'id': 'bar',
                                    'type_hierarchy': ['hello', 'world']
                                }
                            ]
                        }
                    });
                }
            });
        }));

        it('should group types by deployment and node id', function () {
            scope.loadTypesData(true);
            expect(scope.getTypesByDeploymentAndNode().foo.bar.type_hierarchy[0]).toBe('hello');
        });
    });

    describe('#matchItem', function () {

        it('should return true if node instance is of required type', function () {
            scope.setMatchFilter({types: ['foo']});
            expect(scope.matchItem({type_hierarchy: ['foo']})).toBe(true);
        });

        it('should return false if node instance is of required type', function () {
            scope.setMatchFilter({types: ['bar']});
            expect(scope.matchItem({type_hierarchy: ['foo']})).toBe(false);
        });

    });

    describe('#buildMatchFilter', function () {

        it('should set construct the matchFilter to be used later for filtering', function () {
            scope.nodesInstancesFilter = {
                blueprint: {'value': 'foo'},
                'deployments': [{'value': 'bar'}],
                'types': [{'value': 'hello'}]
            };
            scope.buildMatchFilter();
            expect(scope.getMatchFilter().blueprint).toBe('foo');
            expect(scope.getMatchFilter().deployments[0]).toBe('bar');
            expect(scope.getMatchFilter().types[0]).toBe('hello');
        });
    });

    describe('#onNodesInstancesFilterChange', function () {

    });

});
