'use strict';

describe('Controller: PluginCtrl', function() {
    var PluginCtrl;
    var scope;
    var _cloudifyClient;
    var _$q;
    var plugin = {
        id: 'be573b3a-c700-48bf-bfac-63b984593fe8',
        package_name: 'cloudify-diamond-plugin',
        package_version: '1.3',
        distribution: 'ubuntu',
        distribution_release: 'precise',
        supported_platform: 'linux_x86_64',
        uploaded_at: '2015-12-03 16:00:39.369841'
    };
    var blueprints = [{
        id: 'blu',
        plan: {
            deployment_plugins_to_install: [{
                package_name: null,
                package_version: null
            }],
            workflow_plugins_to_install: [{
                package_name: 'cloudify-diamond-plugin',
                package_version: '1.3'
            }]
        }
    }];
    var deployments = [{id: 'dep', blueprint_id: 'blu'}];

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'templates-main', 'backend-mock'));

    beforeEach(inject(function(cloudifyClient, $q, $rootScope, $controller) {
        _cloudifyClient = cloudifyClient;
        _$q = $q;

        spyOn(_cloudifyClient.plugins, 'get').and.callFake(function() {
            return {
                then: function(success) {
                    success({data: plugin});
                    return {
                        then: function(success) {
                            success({data: {items: blueprints}});
                            return {
                                then: function(success) {
                                    var result = success({data: {items: deployments}});
                                    return {
                                        then: function(success) {
                                            success(result);
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            };
        });

        scope = $rootScope.$new();
        PluginCtrl = $controller('PluginCtrl', {
            $scope: scope,
            $stateParams: {
                pluginId: plugin.id
            }
        });
    }));

    describe('Init', function() {
        it('should create a controller', function() {
            expect(PluginCtrl).toBeDefined();
        });

        it('should load plugin data', function() {
            expect(_cloudifyClient.plugins.get).toHaveBeenCalledWith('be573b3a-c700-48bf-bfac-63b984593fe8');
            expect(scope.plugin.package_name).toBe('cloudify-diamond-plugin');
            expect(scope.selection.selected.package_name).toBe('cloudify-diamond-plugin');
            expect(scope.usageMap).toEqual([{
                blueprint: 'blu',
                deployments: ['dep']
            }]);
        });
    });
});
