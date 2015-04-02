'use strict';

describe('Service: NetworksService', function () {

    var mNetworksService;
    var color;
    var colorsList;
    var providerData = {
        'name': 'cloudify_openstack',
        'context': {
            'resources': {
                'subnet': {
                    'id': 'f54ccdbd-b2eb-405a-abaf-8e5d967c361c',
                    'type': 'subnet',
                    'external_resource': true,
                    'name': 'ui-management-subnet'
                },
                'int_network': {
                    'id': 'e6e33a37-d419-4007-b971-e854b27a5f7e',
                    'type': 'network',
                    'external_resource': true,
                    'name': 'ui-management-net'
                },
                'management_server': {
                    'id': 'd093fffb-4e23-4e3c-8f57-2e3f64e51fd2',
                    'type': 'server',
                    'external_resource': false,
                    'name': 'ui-cosmo-manager'
                },
                'agents_security_group': {
                    'id': '6c5a84ca-f6b8-499a-8570-abe8e5cda9d7',
                    'type': 'neutron security group',
                    'external_resource': true,
                    'name': 'ui-sg-agent'
                },
                'agents_keypair': {
                    'id': 'ui-agents-kp',
                    'type': 'keypair',
                    'external_resource': true,
                    'name': 'ui-agents-kp'
                },
                'management_security_group': {
                    'id': 'eff67cf6-ce0c-4cfb-be67-cb3789a60cec',
                    'type': 'neutron security group',
                    'external_resource': true,
                    'name': 'ui-sg-management'
                },
                'floating_ip': {
                    'ip': '192.168.15.13',
                    'type': 'floating ip',
                    'id': 'None',
                    'external_resource': true
                },
                'ext_network': {
                    'id': 'e502de8d-929a-4ee0-bd18-efa297875cf6',
                    'type': 'network',
                    'external_resource': true,
                    'name': 'public'
                },
                'router': {
                    'id': '93a0f088-7e83-4837-9b32-7420b18fe7c6',
                    'type': 'router',
                    'external_resource': true,
                    'name': 'ui-cloudify-router'
                },
                'management_keypair': {
                    'id': 'ui-manager-kp',
                    'type': 'keypair',
                    'external_resource': true,
                    'name': 'ui-manager-kp'
                },
                'my_server': {
                    'id': 'my_server',
                    'type': 'device',
                    'external_resource': true,
                    'name': 'my_server'
                }
            }
        }
    };
    var nodes = [
        {
            'declared_type': 'cloudify.openstack.nodes.SecurityGroup',
            'name': 'security_group',
            'type_hierarchy': [
                'cloudify.nodes.Root',
                'cloudify.openstack.nodes.SecurityGroup'
            ],
            'id': 'security_group',
            'instances': {
                'deploy': 1
            },
            'type': 'cloudify.openstack.nodes.SecurityGroup',
            'properties': {
                'openstack_config': {},
                'resource_id': '',
                'rules': [
                    {
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': {
                            'get_property': [
                                'http_web_server',
                                'port'
                            ]
                        }
                    }
                ],
                'security_group': {
                    'name': 'webserver_security_group'
                },
                'disable_default_egress_rules': false,
                'use_external_resource': false,
                'cloudify_runtime': {}
            }
        },
        {
            'relationships': [
                {
                    'source_operations': {},
                    'target_operations': {},
                    'type_hierarchy': [
                        'cloudify.relationships.depends_on',
                        'cloudify.relationships.contained_in'
                    ],
                    'target_id': 'vm',
                    'state': 'reachable',
                    'base': 'contained',
                    'type': 'cloudify.relationships.contained_in',
                    'properties': {
                        'connection_type': 'all_to_all'
                    }
                }
            ],
            'declared_type': 'cloudify.nodes.WebServer',
            'name': 'http_web_server',
            'type_hierarchy': [
                'cloudify.nodes.Root',
                'cloudify.nodes.SoftwareComponent',
                'cloudify.nodes.WebServer'
            ],
            'id': 'http_web_server',
            'instances': {
                'deploy': 1
            },
            'host_id': 'vm',
            'type': 'cloudify.nodes.WebServer',
            'properties': {
                'port': {
                    'get_input': 'webserver_port'
                },
                'cloudify_runtime': {}
            }
        },
        {
            'declared_type': 'cloudify.openstack.nodes.FloatingIP',
            'name': 'virtual_ip',
            'type_hierarchy': [
                'cloudify.nodes.Root',
                'cloudify.openstack.nodes.FloatingIP'
            ],
            'id': 'virtual_ip',
            'instances': {
                'deploy': 1
            },
            'type': 'cloudify.openstack.nodes.FloatingIP',
            'properties': {
                'use_external_resource': false,
                'floatingip': {},
                'openstack_config': {},
                'cloudify_runtime': {},
                'resource_id': ''
            }
        },
        {
            'relationships': [
                {
                    'type_hierarchy': [
                        'cloudify.relationships.depends_on',
                        'cloudify.relationships.connected_to',
                        'cloudify.openstack.server_connected_to_floating_ip'
                    ],
                    'target_id': 'virtual_ip',
                    'state': 'reachable',
                    'base': 'connected',
                    'type': 'cloudify.openstack.server_connected_to_floating_ip',
                    'properties': {
                        'connection_type': 'all_to_all'
                    }
                },
                {
                    'type_hierarchy': [
                        'cloudify.relationships.depends_on',
                        'cloudify.relationships.connected_to',
                        'cloudify.openstack.server_connected_to_security_group'
                    ],
                    'target_id': 'security_group',
                    'state': 'reachable',
                    'base': 'connected',
                    'type': 'cloudify.openstack.server_connected_to_security_group',
                    'properties': {
                        'connection_type': 'all_to_all'
                    }
                }
            ],
            'declared_type': 'cloudify.openstack.nodes.Server',
            'name': 'vm',
            'type_hierarchy': [
                'cloudify.nodes.Root',
                'cloudify.nodes.Compute',
                'cloudify.openstack.nodes.Server'
            ],
            'id': 'vm',
            'instances': {
                'deploy': 1
            },
            'host_id': 'vm',
            'type': 'cloudify.openstack.nodes.Server',
            'properties': {
                'resource_id': ''
            }
        },
        {
            'declared_type': 'cloudify.openstack.nodes.Router',
            'name': 'management_router',
            'type_hierarchy': [
                'cloudify.nodes.Root',
                'cloudify.nodes.Router',
                'cloudify.openstack.nodes.Router'
            ],
            'id': 'management_router',
            'type': 'cloudify.openstack.nodes.Router',
            'properties': {
                'resource_id': 'management-router'
            }
        },
        {
            'declared_type': 'cloudify.openstack.nodes.Network',
            'name': 'management_network',
            'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.nodes.Network', 'cloudify.openstack.nodes.Network'],
            'id': 'management_network',
            'instances': {
                'deploy': 1
            },
            'type': 'cloudify.openstack.nodes.Network',
            'properties': {
                'openstack_config': {},
                'resource_id': 'management-network',
                'default_to_managers_external_network': true,
                'use_external_resource': false,
                'cloudify_runtime': {}
            }
        },
        {
            'relationships': [{
                'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                'target_id': 'management_network',
                'state': 'reachable',
                'base': 'contained',
                'type': 'cloudify.relationships.contained_in'
            }],
            'declared_type': 'cloudify.openstack.nodes.Subnet',
            'name': 'management_subnet',
            'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.nodes.Subnet', 'cloudify.openstack.nodes.Subnet'],
            'id': 'management_subnet',
            'type': 'cloudify.openstack.nodes.Subnet',
            'properties': {
                'subnet': {
                    'ip_version': 4,
                    'cidr': '10.0.1.0/24'
                },
                'resource_id': 'management_subnet'
            }
        },
        {
            'relationships': [{
                'type_hierarchy': [
                    'cloudify.relationships.depends_on',
                    'cloudify.relationships.connected_to'
                ],
                'target_id': 'management_network',
                'type': 'cloudify.relationships.connected_to',
                'properties': {
                    'connection_type': 'all_to_all'
                }
            }],
            'declared_type': 'cloudify.openstack.nodes.Server',
            'name': 'my_server',
            'type_hierarchy': [
                'cloudify.nodes.Root',
                'cloudify.nodes.Compute',
                'cloudify.openstack.nodes.Server'
            ],
            'id': 'my_server',
            'host_id': 'my_server',
            'type': 'cloudify.openstack.nodes.Server',
            'properties': {
                'resource_id': 'my_server'
            }
        }
    ];
    var results;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of mNetworksService
            inject(function (NetworksService) {
                mNetworksService = NetworksService;
            });

            colorsList = mNetworksService.getNetworkColors();

            results = mNetworksService.createNetworkTree(providerData, nodes);
        });
    });

    describe('Unit tests', function() {

        it('should create a new mNetworksService instance', function() {
            expect(mNetworksService).not.toBeUndefined();
        });

        it('should have external network', function(){
            expect(results.external).not.toBeUndefined();
        });

        it('should have external network object', function(){
            expect(results.external.name).toBe('public');
        });

        it('should have networks', function(){
            expect(results.networks).not.toBeUndefined();
        });

        it('should have relations', function(){
            expect(results.relations).not.toBeUndefined();
        });

        it('should have 2 relations', function(){
            expect(results.relations.length).toEqual(5);
        });

        it('should have subnet', function(){
            expect(results.external.subnets.length).toEqual(1);
        });

        it('should have 13 kind of colors', function(){
            expect(colorsList.length).toBe(13);
        });

        it('should contain the 5th color', function(){
            color = mNetworksService.getNetworkColor();
            expect(color).toContain(colorsList[4]);
        });

        describe('Reset Colors', function() {
            beforeEach(function(){
                mNetworksService.resetNetworkColors();
            });

            it('should contain the 2st color', function(){
                color = mNetworksService.getNetworkColor();
                expect(color).toContain(colorsList[1]);
            });
        });

        describe('Networks model', function() {

            it('should add router to routers array in external network model', function() {
                expect(results.external.routers.length).toBe(2);
                expect(results.external.routers[0].name).toBe('ui-cloudify-router');
                expect(results.external.routers[1].name).toBe('management_router');
            });

            it('should add a network to networks array in networks model', function() {
                expect(results.networks[0].id).toBe('management_network');
            });

            it('should set the network device as target in relations array', function() {
                expect(results.relations[results.relations.length - 1].target).toBe('my_server');
            });

            it('should add devices to network model', function() {
                expect(results.networks[0].devices.length).toEqual(1);
                expect(results.networks[0].devices[0].name).toBe('my_server');
            });

            it('should add an internal network with internal subnet inside it', function() {
                expect(results.external.subnets[0].name).toBe('ui-management-net');
                expect(results.external.subnets[0].subnet.name).toBe('ui-management-subnet');
            });
        });
    });

});
