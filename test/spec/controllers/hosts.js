'use strict';

describe('Controller: HostsCtrl', function () {

    /*jshint camelcase: false */
    var HostsCtrl, scope;

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, cloudifyClient) {

        scope = $rootScope.$new();

        spyOn(cloudifyClient.deployments, 'list').andReturn({
            then: function () {
            }
        });
        spyOn(cloudifyClient.nodes, 'list').andReturn({
            then: function () {
            }
        });

        HostsCtrl = $controller('HostsCtrl', {
            $scope: scope
        });
        scope.$digest();
    }));

    describe('#clearFilter', function () {
        it('should reset hostsFilter on scope', function () {
            scope.hostsFilter = 'foo';
            scope.clearFilter();
            expect(scope.hostsFilter.blueprint).toBe(null);
        });
    });


    describe('#resetTypeFilter', function () {

        it('should set Compute type on filter', function () {
            scope.hostsFilter = {};
            scope.resetTypesFilter();
            expect(scope.hostsFilter.types.length).toBe(1);
            expect(scope.hostsFilter.types[0].value).toBe('cloudify.nodes.Compute');
        });
    });

    describe('#loadDeploymentsAndBlueprints', function () {
        beforeEach(inject(function (cloudifyClient) {
            cloudifyClient.deployments.list.andReturn({
                then: function (success) {
                    success({data: [{'id': 'foo', 'blueprint_id': 'bar'}]});
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
            cloudifyClient.nodes.list.andReturn({
                then: function (success) {
                    success({
                        data: [
                            {
                                'deployment_id': 'foo',
                                'id': 'bar',
                                'type_hierarchy': ['hello', 'world']
                            }
                        ]
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
            scope.hostsFilter = {
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

    describe('#onHostsFilterChange', function () {

    });


});
