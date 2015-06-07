'use strict';

describe('Directive: bpTopologyNodes', function () {

    var _nodesTree = [{
        'relationships': [{
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'cloudify.openstack.server_connected_to_security_group'],
            'target_id': 'node_cellar_security_group',
            'state': 'reachable',
            'base': 'connected',
            'type': 'cloudify.openstack.server_connected_to_security_group',
            'node': {
                'declared_type': 'cloudify.openstack.nodes.SecurityGroup',
                'name': 'node_cellar_security_group',
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-openstack-nodes-SecurityGroup'],
                'id': 'node_cellar_security_group',
                'instances': {
                    'deploy': 1
                },
                'type': 'cloudify.openstack.nodes.SecurityGroup',
                'properties': {
                    'openstack_config': {},
                    'resource_id': '',
                    'rules': [{
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': {
                            'get_property': ['nodecellar_app', 'base_port']
                        }
                    }, {
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': {
                            'get_property': ['mongod', 'port']
                        }
                    }, {
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': 28017
                    }],
                    'security_group': {
                        'name': 'node_cellar_security_group'
                    },
                    'disable_default_egress_rules': false,
                    'use_external_resource': false,
                    'cloudify_runtime': {}
                },
                'class': 'cloudify-nodes-Root cloudify-openstack-nodes-SecurityGroup',
                'isApp': false
            }
        }],
        'declared_type': 'vm_host',
        'name': 'mongod_vm',
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-Compute', 'cloudify-openstack-nodes-Server', 'vm-host'],
        'id': 'mongod_vm',
        'instances': {
            'deploy': 1
        },
        'host_id': 'mongod_vm',
        'type': 'vm_host',
        'properties': {
            'cloudify_agent': {
                'user': 'ubuntu'
            },
            'openstack_config': {},
            'resource_id': '',
            'ip': '',
            'management_network_name': '',
            'server': {
                'image': '75d47d10-fef8-473b-9dd1-fe2f7649cb41',
                'flavor': 101
            },
            'install_agent': true,
            'use_external_resource': false,
            'cloudify_runtime': {}
        },
        'class': 'cloudify-nodes-Root cloudify-nodes-Compute cloudify-openstack-nodes-Server vm-host',
        'isApp': false,
        'children': [{
            'relationships': [{
                'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                'target_id': 'mongod_vm',
                'state': 'reachable',
                'base': 'contained',
                'type': 'cloudify.relationships.contained_in'
            }],
            'declared_type': 'mongo_database',
            'name': 'mongod',
            'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-DBMS', 'mongo-database'],
            'deployment_plugins_to_install': [],
            'id': 'mongod',
            'host_id': 'mongod_vm',
            'type': 'mongo_database',
            'properties': {
                'role': 'mongod',
                'port': 27017,
                'cloudify_runtime': {}
            },
            'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS mongo-database',
            'isApp': false,
            'isContained': true,
            'dataType': 'middleware'
        }],
        'isContained': false,
        'dataType': 'compute'
    }, {
        'relationships': [{
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'cloudify.openstack.server_connected_to_floating_ip'],
            'target_id': 'floatingip',
            'state': 'reachable',
            'base': 'connected',
            'type': 'cloudify.openstack.server_connected_to_floating_ip',
            'node': {
                'declared_type': 'cloudify.openstack.nodes.FloatingIP',
                'name': 'floatingip',
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-VirtualIP', 'cloudify-openstack-nodes-FloatingIP'],
                'id': 'floatingip',
                'type': 'cloudify.openstack.nodes.FloatingIP',
                'properties': {
                    'use_external_resource': false,
                    'floatingip': {
                        'floating_network_name': 'Ext-Net'
                    },
                    'openstack_config': {},
                    'cloudify_runtime': {},
                    'resource_id': ''
                },
                'class': 'cloudify-nodes-Root cloudify-nodes-VirtualIP cloudify-openstack-nodes-FloatingIP',
                'isApp': false
            }
        }, {
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'cloudify.openstack.server_connected_to_security_group'],
            'target_id': 'node_cellar_security_group',
            'state': 'reachable',
            'base': 'connected',
            'type': 'cloudify.openstack.server_connected_to_security_group',
            'node': {
                'declared_type': 'cloudify.openstack.nodes.SecurityGroup',
                'name': 'node_cellar_security_group',
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-openstack-nodes-SecurityGroup'],
                'id': 'node_cellar_security_group',
                'type': 'cloudify.openstack.nodes.SecurityGroup',
                'properties': {
                    'openstack_config': {},
                    'resource_id': '',
                    'rules': [{
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': {
                            'get_property': ['nodecellar_app', 'base_port']
                        }
                    }, {
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': {
                            'get_property': ['mongod', 'port']
                        }
                    }, {
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': 28017
                    }],
                    'security_group': {
                        'name': 'node_cellar_security_group'
                    },
                    'disable_default_egress_rules': false,
                    'use_external_resource': false,
                    'cloudify_runtime': {}
                },
                'class': 'cloudify-nodes-Root cloudify-openstack-nodes-SecurityGroup',
                'isApp': false
            }
        }],
        'declared_type': 'vm_host',
        'name': 'nodejs_vm',
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-Compute', 'cloudify-openstack-nodes-Server', 'vm-host'],
        'id': 'nodejs_vm',
        'host_id': 'nodejs_vm',
        'type': 'vm_host',
        'properties': {
            'cloudify_agent': {
                'user': 'ubuntu'
            },
            'openstack_config': {},
            'resource_id': '',
            'ip': '',
            'management_network_name': '',
            'server': {
                'image': '75d47d10-fef8-473b-9dd1-fe2f7649cb41',
                'flavor': 101
            },
            'install_agent': true,
            'use_external_resource': false,
            'cloudify_runtime': {}
        },
        'class': 'cloudify-nodes-Root cloudify-nodes-Compute cloudify-openstack-nodes-Server vm-host',
        'isApp': false,
        'children': [{
            'relationships': [{
                'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                'target_id': 'nodejs_vm',
                'state': 'reachable',
                'base': 'contained',
                'type': 'cloudify.relationships.contained_in'
            }],
            'declared_type': 'nodejs_server',
            'name': 'nodejs',
            'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-ApplicationServer', 'nodejs-server'],
            'deployment_plugins_to_install': [],
            'id': 'nodejs',
            'host_id': 'nodejs_vm',
            'type': 'nodejs_server',
            'properties': {
                'cloudify_runtime': {}
            },
            'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-ApplicationServer nodejs-server',
            'isApp': false,
            'children': [{
                'relationships': [{
                    'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                    'target_id': 'nodejs',
                    'state': 'reachable',
                    'base': 'contained',
                    'type': 'cloudify.relationships.contained_in'
                }, {
                    'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'nodecellar_connected_to_mongo'],
                    'target_id': 'mongod',
                    'state': 'reachable',
                    'base': 'connected',
                    'type': 'nodecellar_connected_to_mongo',
                    'node': {
                        'relationships': [{
                            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                            'target_id': 'mongod_vm',
                            'state': 'reachable',
                            'base': 'contained',
                            'type': 'cloudify.relationships.contained_in'
                        }],
                        'declared_type': 'mongo_database',
                        'name': 'mongod',
                        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-DBMS', 'mongo-database'],
                        'deployment_plugins_to_install': [],
                        'id': 'mongod',
                        'host_id': 'mongod_vm',
                        'type': 'mongo_database',
                        'properties': {
                            'role': 'mongod',
                            'port': 27017,
                            'cloudify_runtime': {}
                        },
                        'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS mongo-database',
                        'isApp': false,
                        'isContained': true,
                        'dataType': 'middleware'
                    }
                }],
                'declared_type': 'nodejs_app',
                'name': 'nodecellar_app',
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-ApplicationModule', 'nodejs-app'],
                'deployment_plugins_to_install': [],
                'id': 'nodecellar_app',
                'host_id': 'nodejs_vm',
                'type': 'nodejs_app',
                'properties': {
                    'num_instances': 1,
                    'app_name': 'nodecellar',
                    'startup_script': 'server.js',
                    'git_branch': 'master',
                    'env_file_path': '',
                    'base_port': 8080,
                    'cloudify_runtime': {},
                    'git_url': 'https://github.com/cloudify-cosmo/nodecellar.git'
                },
                'class': 'cloudify-nodes-Root cloudify-nodes-ApplicationModule nodejs-app',
                'isApp': true,
                'isContained': true,
                'dataType': 'modules'
            }],
            'isContained': true,
            'dataType': 'middleware'
        }],
        'isContained': false,
        'dataType': 'compute'
    }, {
        'declared_type': 'cloudify.nodes.Volume',
        'name': 'volume_node',
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-Volume'],
        'id': 'volume_node',
        'instances': {
            'deploy': 1
        },
        'type': 'cloudify.nodes.Volume',
        'class': 'cloudify-nodes-Root cloudify-nodes-Volume',
        'isApp': false,
        'isHost': false,
        'dataType': 'compute'
    }, {
        'declared_type': 'cloudify.nodes.FileSystem',
        'name': 'filesystem_node',
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-FileSystem'],
        'id': 'filesystem_node',
        'instances': {
            'deploy': 1
        },
        'type': 'cloudify.nodes.FileSystem',
        'class': 'cloudify-nodes-Root cloudify-nodes-FileSystem',
        'isApp': false,
        'isHost': false,
        'dataType': 'compute'
    }, {
        'declared_type': 'cloudify.nodes.KeyPair',
        'name': 'keypair_node',
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-openstack-nodes-KeyPair'],
        'id': 'keypair_node',
        'instances': {
            'deploy': 1
        },
        'type': 'cloudify.nodes.KeyPair',
        'class': 'cloudify-nodes-Root cloudify-openstack-nodes-KeyPair',
        'isApp': false,
        'isHost': false,
        'dataType': 'compute'
    }];

    var element, scope;
    beforeEach(module('cosmoUiApp', 'ngMock', 'gsUiHelper', 'templates-main', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));

    function compileDirective(opts) {
        inject(function($compile, $rootScope) {
            if (!opts || !opts.scope) {
                scope = $rootScope.$new();
            } else {
                scope = opts.scope;
            }
            element = $compile(angular.element('<div bp-topology-nodes map="map"></div>'))(scope);

            scope.$digest();
        });
    }

    describe('Directive tests', function() {
        it('should create an element with getBadgeStatus function', function() {
            compileDirective();
            expect(typeof(element.isolateScope().getBadgeStatus)).toBe('function');
        });

        it('should return the badge status by its status id using the getBadgeStatus function', function() {
            compileDirective();
            expect(element.isolateScope().getBadgeStatus(0)).toBe('install');
            expect(element.isolateScope().getBadgeStatus(1)).toBe('done');
            expect(element.isolateScope().getBadgeStatus(2)).toBe('alerts');
            expect(element.isolateScope().getBadgeStatus(3)).toBe('failed');
            expect(element.isolateScope().getBadgeStatus()).toBe('');
        });

        it('should return type class using the getTypeClass method', function() {
            compileDirective();
            expect(element.isolateScope().getTypeClass('MyType')).toBe('cloudify-nodes-MyType');
        });

        it('should not have cloudify-types-base class', function() {
            expect(element.find('i.gs-node-icon').hasClass('cloudify-types-base')).toBe(false);
        });

        it('should have a cloudify-nodes-Root class', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.map = _nodesTree;
            compileDirective({scope: _scope});

            expect(element.find('i.gs-node-icon').hasClass('cloudify-nodes-Root')).toBe(true);
        }));

        it('should have a cloudify-nodes-Volume class on volume node', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.map = _nodesTree;
            compileDirective({scope: _scope});

            expect(element.find('i.gs-node-icon.topology-glyph.cloudify-nodes-Root.cloudify-nodes-Volume').length).toBe(1);
        }));

        it('should have a cloudify-nodes-FileSystem class on filesystem node', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.map = _nodesTree;
            compileDirective({scope: _scope});

            expect(element.find('i.gs-node-icon.topology-glyph.cloudify-nodes-Root.cloudify-nodes-FileSystem').length).toBe(1);
        }));
    });
});
