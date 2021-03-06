'use strict';

describe('Service: NodeSearchService', function () {

    var mUpdateNodes;
    var _updateNodesInstance;
    /*jshint camelcase: false */
    var nodesInstances = [
        {
            'relationships': [
                {
                    'target_name': 'node_cellar_security_group',
                    'target_id': 'node_cellar_security_group_b96ca',
                    'type': 'cloudify.relationships.connected_to'
                }
            ],
            'runtime_properties': {},
            'node_id': 'mongod_vm',
            'version': null,
            'state': 'initializing',
            'host_id': 'mongod_vm_780b6',
            'deployment_id': 'nodecellarDep',
            'id': 'mongod_vm_780b6'
        },
        {
            'relationships': [
                {
                    'target_name': 'node_cellar_security_group',
                    'type': 'cloudify.relationships.connected_to',
                    'target_id': 'node_cellar_security_group_c6c05'
                }
            ],
            'runtime_properties': null,
            'node_id': 'mongod_vm',
            'version': null,
            'state': 'uninitialized',
            'host_id': 'mongod_vm_8491f',
            'deployment_id': 'nodecellarBrwTests',
            'id': 'mongod_vm_8491f'
        },
        {
            'relationships': [],
            'runtime_properties': {
                'external_id': '1036560b-476a-4cee-b9b5-c67b6183e4ef',
                'external_name': 'monitoring-node_cellar_security_group',
                'external_type': 'security_group'
            },
            'node_id': 'node_cellar_security_group',
            'version': null,
            'state': 'started',
            'host_id': null,
            'deployment_id': 'nodecellarDep2',
            'id': 'node_cellar_security_group_812c2'
        },
        {
            'relationships': [
                {
                    'target_name': 'mongod',
                    'target_id': 'mongod_bc468',
                    'type': 'nodecellar_connected_to_mongo'
                },
                {
                    'target_name': 'nodejs',
                    'target_id': 'nodejs_d2285',
                    'type': 'cloudify.relationships.contained_in'
                }
            ],
            'runtime_properties': {},
            'node_id': 'nodecellar_app',
            'version': null,
            'state': 'initializing',
            'host_id': 'nodejs_vm_bf0dd',
            'deployment_id': 'nodecellarDep2',
            'id': 'nodecellar_app_e46a7'
        },
        {
            'relationships': [
                {
                    'target_name': 'nodejs_vm',
                    'target_id': 'nodejs_vm_bf0dd',
                    'type': 'cloudify.relationships.contained_in'
                }
            ],
            'runtime_properties': {},
            'node_id': 'nodejs',
            'version': null,
            'state': 'initializing',
            'host_id': 'nodejs_vm_bf0dd',
            'deployment_id': 'nodecellarDep2',
            'id': 'nodejs_d2285'
        },
        {
            'relationships': [],
            'runtime_properties': {
                'external_id': 'cb35c995-0896-46ff-8e6c-117bb7fe8e6e',
                'floating_ip_address': '15.126.221.40',
                'external_type': 'floatingip'
            },
            'node_id': 'floatingip',
            'version': null,
            'state': 'started',
            'host_id': null,
            'deployment_id': 'nodecellarDep2',
            'id': 'floatingip_440c5'
        },
        {
            'relationships': [
                {
                    'target_name': 'node_cellar_security_group',
                    'type': 'cloudify.relationships.connected_to',
                    'target_id': 'node_cellar_security_group_c6c05'
                },
                {
                    'target_name': 'floatingip',
                    'type': 'cloudify.libcloud.server_connected_to_floating_ip',
                    'target_id': 'floatingip_e1122'
                }
            ],
            'runtime_properties': null,
            'node_id': 'nodejs_vm',
            'version': null,
            'state': 'uninitialized',
            'host_id': 'nodejs_vm_3ae78',
            'deployment_id': 'nodecellarBrwTests',
            'id': 'nodejs_vm_3ae78'
        },
        {
            'relationships': [
                {
                    'target_name': 'floatingip',
                    'target_id': 'floatingip_323c5',
                    'type': 'cloudify.libcloud.server_connected_to_floating_ip'
                },
                {
                    'target_name': 'node_cellar_security_group',
                    'target_id': 'node_cellar_security_group_b96ca',
                    'type': 'cloudify.relationships.connected_to'
                }
            ],
            'runtime_properties': {},
            'node_id': 'nodejs_vm',
            'version': null,
            'state': 'initializing',
            'host_id': 'nodejs_vm_a1277',
            'deployment_id': 'nodecellarDep',
            'id': 'nodejs_vm_a1277'
        },
        {
            'relationships': [],
            'runtime_properties': null,
            'node_id': 'node_cellar_security_group',
            'version': null,
            'state': 'uninitialized',
            'host_id': null,
            'deployment_id': 'nodecellarBrwTests',
            'id': 'node_cellar_security_group_c6c05'
        },
        {
            'relationships': [
                {
                    'target_name': 'node_cellar_security_group',
                    'target_id': 'node_cellar_security_group_812c2',
                    'type': 'cloudify.openstack.server_connected_to_security_group'
                },
                {
                    'target_name': 'floatingip',
                    'target_id': 'floatingip_440c5',
                    'type': 'cloudify.openstack.server_connected_to_floating_ip'
                }
            ],
            'runtime_properties': {
                'external_name': 'monitoring-server_nodecellarDep2_nodejs_vm_bf0dd',
                'external_id': '53f36959-996c-41f2-8d07-f1ee5d1c59dd',
                'external_type': 'server'
            },
            'node_id': 'nodejs_vm',
            'version': null,
            'state': 'starting',
            'host_id': 'nodejs_vm_bf0dd',
            'deployment_id': 'nodecellarDep2',
            'id': 'nodejs_vm_bf0dd'
        },
        {
            'relationships': [
                {
                    'target_name': 'node_cellar_security_group',
                    'type': 'cloudify.openstack.server_connected_to_security_group',
                    'target_id': 'node_cellar_security_group_812c2'
                }
            ],
            'runtime_properties': {},
            'node_id': 'mongod_vm',
            'version': null,
            'state': 'creating',
            'host_id': 'mongod_vm_98887',
            'deployment_id': 'nodecellarDep2',
            'id': 'mongod_vm_98887'
        },
        {
            'relationships': [],
            'runtime_properties': null,
            'node_id': 'vm',
            'version': null,
            'state': 'uninitialized',
            'host_id': 'vm_83da9',
            'deployment_id': 'MonitoringBpTest',
            'id': 'vm_83da9'
        },
        {
            'relationships': [],
            'runtime_properties': {},
            'node_id': 'node_cellar_security_group',
            'version': null,
            'state': 'creating',
            'host_id': null,
            'deployment_id': 'nodecellarDep',
            'id': 'node_cellar_security_group_b96ca'
        },
        {
            'relationships': [],
            'runtime_properties': {},
            'node_id': 'floatingip',
            'version': null,
            'state': 'creating',
            'host_id': null,
            'deployment_id': 'nodecellarDep',
            'id': 'floatingip_323c5'
        },
        {
            'relationships': [],
            'runtime_properties': null,
            'node_id': 'floatingip',
            'version': null,
            'state': 'uninitialized',
            'host_id': null,
            'deployment_id': 'nodecellarBrwTests',
            'id': 'floatingip_e1122'
        },
        {
            'relationships': [
                {
                    'target_name': 'mongod_vm',
                    'target_id': 'mongod_vm_98887',
                    'type': 'cloudify.relationships.contained_in'
                }
            ],
            'runtime_properties': {},
            'node_id': 'mongod',
            'version': null,
            'state': 'initializing',
            'host_id': 'mongod_vm_98887',
            'deployment_id': 'nodecellarDep2',
            'id': 'mongod_bc468'
        },
        {
            'relationships': [],
            'runtime_properties': {
                'external_name': 'monitoring-server_MonitoringDep_vm_c6208',
                'ip': '10.67.79.4',
                'diamond_paths': {
                    'collectors_config': '/home/ubuntu/cloudify.vm_c6208/diamond/etc/collectors',
                    'log': '/home/ubuntu/cloudify.vm_c6208/diamond/var/log',
                    'collectors': '/home/ubuntu/cloudify.vm_c6208/diamond/collectors',
                    'handlers': '/home/ubuntu/cloudify.vm_c6208/diamond/handlers',
                    'pid': '/home/ubuntu/cloudify.vm_c6208/diamond/var/run',
                    'config': '/home/ubuntu/cloudify.vm_c6208/diamond/etc',
                    'handlers_config': '/home/ubuntu/cloudify.vm_c6208/diamond/etc/handlers'
                },
                'external_type': 'server',
                'external_id': 'a37f7a2a-1bfd-4368-99b4-ca8ac5b7612a',
                'networks': {
                    'monitoring-cloudify-admin-network': [
                        '10.67.79.4'
                    ]
                }
            },
            'node_id': 'vm',
            'version': null,
            'state': 'creating',
            'host_id': 'vm_c6208',
            'deployment_id': 'MonitoringDep',
            'id': 'vm_c6208'
        }
    ];
    var nodeList = [{
        'operations': {
            'cloudify.interfaces.validation.creation': {
                'inputs': {},
                'operation': 'neutron_plugin.floatingip.creation_validation',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.lifecycle.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.delete': {
                'inputs': {},
                'operation': 'neutron_plugin.floatingip.delete',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.lifecycle.create': {
                'inputs': {},
                'operation': 'neutron_plugin.floatingip.create',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'create': {
                'inputs': {},
                'operation': 'neutron_plugin.floatingip.create',
                'plugin': 'openstack'
            },
            'creation': {
                'inputs': {},
                'operation': 'neutron_plugin.floatingip.creation_validation',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.lifecycle.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.monitoring.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.lifecycle.configure': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.validation.deletion': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'delete': {
                'inputs': {},
                'operation': 'neutron_plugin.floatingip.delete',
                'plugin': 'openstack'
            }
        },
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-VirtualIP', 'cloudify-openstack-nodes-FloatingIP'],
        'blueprint_id': 'nc2',
        'plugins': {
            'openstack': {
                'source': 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1rc1.zip',
                'name': 'openstack',
                'install': true,
                'executor': 'central_deployment_agent'
            }
        },
        'host_id': null,
        'id': 'floatingip',
        'relationships': [],
        'plugins_to_install': null,
        'properties': {
            'use_external_resource': false,
            'floatingip': {'floating_network_name': 'Ext-Net'},
            'openstack_config': {},
            'cloudify_runtime': {},
            'resource_id': ''
        },
        'number_of_instances': '1',
        'deployment_id': 'nodecellarDep2',
        'type': 'cloudify.openstack.nodes.FloatingIP',
        'name': 'floatingip',
        'state': {
            'status': 3,
            'state': 0,
            'states': 0,
            'completed': 0,
            'total': 1,
            'process': {'done': 0},
            'instancesIds': ['floatingip'],
            'reachables': 0
        },
        'class': 'cloudify-nodes-Root cloudify-nodes-VirtualIP cloudify-openstack-nodes-FloatingIP',
        'isApp': false
    }, {
        'operations': {
            'cloudify.interfaces.validation.creation': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.stop': {
                'inputs': {'script_path': 'mongo-scripts/stop-mongo.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'cloudify.interfaces.lifecycle.delete': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.create': {
                'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'cloudify.interfaces.monitoring.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'create': {
                'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'creation': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.lifecycle.start': {
                'inputs': {'script_path': 'mongo-scripts/start-mongo.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'cloudify.interfaces.monitoring.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.lifecycle.configure': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.validation.deletion': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
        },
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-DBMS', 'mongo-database'],
        'blueprint_id': 'nc2',
        'plugins': {
            'script': {
                'source': null,
                'name': 'script',
                'install': false,
                'executor': 'host_agent'
            }
        },
        'host_id': 'mongod_vm',
        'id': 'mongod',
        'relationships': [{
            'source_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'target_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
            'target_id': 'mongod_vm',
            'type': 'cloudify.relationships.contained_in',
            'properties': {'connection_type': 'all_to_all'},
            '$$hashKey': '04B'
        }],
        'plugins_to_install': null,
        'properties': {'role': 'mongod', 'port': 27017, 'cloudify_runtime': {}},
        'number_of_instances': '1',
        'deployment_id': 'nodecellarDep2',
        'type': 'mongo_database',
        'name': 'mongod',
        'state': {
            'status': 3,
            'state': 0,
            'states': 0,
            'completed': 0,
            'total': 1,
            'process': {'done': 0},
            'instancesIds': ['mongod'],
            'reachables': 0
        },
        'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS mongo-database',
        'isApp': false,
        'isContained': true,
        'dataType': 'middleware'
    }, {
        'operations': {
            'cloudify.interfaces.lifecycle.delete': {
                'inputs': {},
                'operation': 'nova_plugin.server.delete',
                'plugin': 'openstack'
            },
            'creation': {
                'inputs': {},
                'operation': 'nova_plugin.server.creation_validation',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.worker_installer.restart': {
                'inputs': {},
                'operation': 'worker_installer.tasks.restart',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.monitoring_agent.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.worker_installer.start': {
                'inputs': {},
                'operation': 'worker_installer.tasks.start',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.lifecycle.create': {
                'inputs': {},
                'operation': 'nova_plugin.server.create',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'create': {
                'inputs': {},
                'operation': 'nova_plugin.server.create',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring_agent.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.monitoring.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.validation.deletion': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.host.get_state': {
                'inputs': {},
                'operation': 'nova_plugin.server.get_state',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.plugin_installer.install': {
                'inputs': {},
                'operation': 'plugin_installer.tasks.install',
                'plugin': 'plugin_installer'
            },
            'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.worker_installer.stop': {
                'inputs': {},
                'operation': 'worker_installer.tasks.stop',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.lifecycle.configure': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.worker_installer.install': {
                'inputs': {},
                'operation': 'worker_installer.tasks.install',
                'plugin': 'agent_installer'
            },
            'restart': {
                'inputs': {},
                'operation': 'worker_installer.tasks.restart',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.validation.creation': {
                'inputs': {},
                'operation': 'nova_plugin.server.creation_validation',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.worker_installer.uninstall': {
                'inputs': {},
                'operation': 'worker_installer.tasks.uninstall',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.lifecycle.stop': {
                'inputs': {},
                'operation': 'nova_plugin.server.stop',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring_agent.uninstall': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.start': {
                'inputs': {},
                'operation': 'nova_plugin.server.start',
                'plugin': 'openstack'
            },
            'get_state': {
                'inputs': {},
                'operation': 'nova_plugin.server.get_state',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring_agent.install': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'delete': {
                'inputs': {},
                'operation': 'nova_plugin.server.delete',
                'plugin': 'openstack'
            }
        },
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-Compute', 'cloudify-openstack-nodes-Server', 'vm-host'],
        'blueprint_id': 'nc2',
        'plugins': {
            'openstack': {
                'source': 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1rc1.zip',
                'name': 'openstack',
                'install': true,
                'executor': 'central_deployment_agent'
            },
            'plugin_installer': {
                'source': null,
                'name': 'plugin_installer',
                'install': false,
                'executor': 'host_agent'
            },
            'agent_installer': {
                'source': null,
                'name': 'agent_installer',
                'install': false,
                'executor': 'central_deployment_agent'
            }
        },
        'host_id': 'mongod_vm',
        'id': 'mongod_vm',
        'relationships': [{
            'source_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.disconnect_security_group',
                    'plugin': 'openstack'
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.connect_security_group',
                    'plugin': 'openstack'
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.disconnect_security_group',
                    'plugin': 'openstack'
                },
                'establish': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.connect_security_group',
                    'plugin': 'openstack'
                }
            },
            'target_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'cloudify.openstack.server_connected_to_security_group'],
            'target_id': 'node_cellar_security_group',
            'type': 'cloudify.openstack.server_connected_to_security_group',
            'properties': {'connection_type': 'all_to_all'},
            'node': {
                'operations': {
                    'cloudify.interfaces.validation.creation': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.creation_validation',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.stop': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.lifecycle.delete': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.delete',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.create': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.create',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.monitoring.start': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'create': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.create',
                        'plugin': 'openstack'
                    },
                    'creation': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.creation_validation',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.start': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.monitoring.stop': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.lifecycle.configure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.validation.deletion': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'delete': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.delete',
                        'plugin': 'openstack'
                    }
                },
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-openstack-nodes-SecurityGroup'],
                'blueprint_id': 'nc2',
                'plugins': {
                    'openstack': {
                        'source': 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1rc1.zip',
                        'name': 'openstack',
                        'install': true,
                        'executor': 'central_deployment_agent'
                    }
                },
                'host_id': null,
                'id': 'node_cellar_security_group',
                'relationships': [],
                'plugins_to_install': null,
                'properties': {
                    'openstack_config': {},
                    'resource_id': '',
                    'rules': [{
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': 8080
                    }, {
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': 27017
                    }, {'remote_ip_prefix': '0.0.0.0/0', 'port': 28017}],
                    'security_group': {'name': 'node_cellar_security_group'},
                    'disable_default_egress_rules': false,
                    'use_external_resource': false,
                    'cloudify_runtime': {}
                },
                'number_of_instances': '1',
                'deployment_id': 'nodecellarDep2',
                'type': 'cloudify.openstack.nodes.SecurityGroup',
                'name': 'node_cellar_security_group',
                'state': {
                    'status': 3,
                    'state': 0,
                    'states': 0,
                    'completed': 0,
                    'total': 1,
                    'process': {'done': 0},
                    'instancesIds': ['node_cellar_security_group'],
                    'reachables': 0
                },
                'class': 'cloudify-nodes-Root cloudify-openstack-nodes-SecurityGroup',
                'isApp': false
            },
            '$$hashKey': '044'
        }],
        'plugins_to_install': [{
            'source': null,
            'name': 'plugin_installer',
            'install': false,
            'executor': 'host_agent'
        }, {
            'source': null,
            'name': 'script',
            'install': false,
            'executor': 'host_agent'
        }],
        'properties': {
            'cloudify_agent': {'user': 'ubuntu'},
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
        'number_of_instances': '1',
        'deployment_id': 'nodecellarDep2',
        'type': 'vm_host',
        'name': 'mongod_vm',
        'state': {
            'status': 3,
            'state': 0,
            'states': 0,
            'completed': 0,
            'total': 1,
            'process': {'done': 0},
            'instancesIds': ['mongod_vm'],
            'reachables': 0
        },
        'class': 'cloudify-nodes-Root cloudify-nodes-Compute cloudify-openstack-nodes-Server vm-host',
        'isApp': false,
        'children': [{
            'operations': {
                'cloudify.interfaces.validation.creation': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.lifecycle.stop': {
                    'inputs': {'script_path': 'mongo-scripts/stop-mongo.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'cloudify.interfaces.lifecycle.delete': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.lifecycle.create': {
                    'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'cloudify.interfaces.monitoring.start': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'create': {
                    'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'creation': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.lifecycle.start': {
                    'inputs': {'script_path': 'mongo-scripts/start-mongo.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'cloudify.interfaces.monitoring.stop': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.lifecycle.configure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.validation.deletion': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-DBMS', 'mongo-database'],
            'blueprint_id': 'nc2',
            'plugins': {
                'script': {
                    'source': null,
                    'name': 'script',
                    'install': false,
                    'executor': 'host_agent'
                }
            },
            'host_id': 'mongod_vm',
            'id': 'mongod',
            'relationships': [{
                'source_operations': {
                    'preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.unlink': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.establish': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'target_operations': {
                    'preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.unlink': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.establish': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                'target_id': 'mongod_vm',
                'type': 'cloudify.relationships.contained_in',
                'properties': {'connection_type': 'all_to_all'},
                '$$hashKey': '04B'
            }],
            'plugins_to_install': null,
            'properties': {
                'role': 'mongod',
                'port': 27017,
                'cloudify_runtime': {}
            },
            'number_of_instances': '1',
            'deployment_id': 'nodecellarDep2',
            'type': 'mongo_database',
            'name': 'mongod',
            'state': {
                'status': 3,
                'state': 0,
                'states': 0,
                'completed': 0,
                'total': 1,
                'process': {'done': 0},
                'instancesIds': ['mongod'],
                'reachables': 0
            },
            'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS mongo-database',
            'isApp': false,
            'isContained': true,
            'dataType': 'middleware'
        }],
        'isContained': false,
        'dataType': 'compute'
    }, {
        'operations': {
            'cloudify.interfaces.validation.creation': {
                'inputs': {},
                'operation': 'neutron_plugin.security_group.creation_validation',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.lifecycle.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.delete': {
                'inputs': {},
                'operation': 'neutron_plugin.security_group.delete',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.lifecycle.create': {
                'inputs': {},
                'operation': 'neutron_plugin.security_group.create',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'create': {
                'inputs': {},
                'operation': 'neutron_plugin.security_group.create',
                'plugin': 'openstack'
            },
            'creation': {
                'inputs': {},
                'operation': 'neutron_plugin.security_group.creation_validation',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.lifecycle.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.monitoring.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.lifecycle.configure': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.validation.deletion': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'delete': {
                'inputs': {},
                'operation': 'neutron_plugin.security_group.delete',
                'plugin': 'openstack'
            }
        },
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-openstack-nodes-SecurityGroup'],
        'blueprint_id': 'nc2',
        'plugins': {
            'openstack': {
                'source': 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1rc1.zip',
                'name': 'openstack',
                'install': true,
                'executor': 'central_deployment_agent'
            }
        },
        'host_id': null,
        'id': 'node_cellar_security_group',
        'relationships': [],
        'plugins_to_install': null,
        'properties': {
            'openstack_config': {},
            'resource_id': '',
            'rules': [{
                'remote_ip_prefix': '0.0.0.0/0',
                'port': 8080
            }, {
                'remote_ip_prefix': '0.0.0.0/0',
                'port': 27017
            }, {'remote_ip_prefix': '0.0.0.0/0', 'port': 28017}],
            'security_group': {'name': 'node_cellar_security_group'},
            'disable_default_egress_rules': false,
            'use_external_resource': false,
            'cloudify_runtime': {}
        },
        'number_of_instances': '1',
        'deployment_id': 'nodecellarDep2',
        'type': 'cloudify.openstack.nodes.SecurityGroup',
        'name': 'node_cellar_security_group',
        'state': {
            'status': 3,
            'state': 0,
            'states': 0,
            'completed': 0,
            'total': 1,
            'process': {'done': 0},
            'instancesIds': ['node_cellar_security_group'],
            'reachables': 0
        },
        'class': 'cloudify-nodes-Root cloudify-openstack-nodes-SecurityGroup',
        'isApp': false
    }, {
        'operations': {
            'cloudify.interfaces.validation.creation': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.stop': {
                'inputs': {'script_path': 'nodejs-scripts/stop-app.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'cloudify.interfaces.lifecycle.delete': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.create': {
                'inputs': {'script_path': 'nodejs-scripts/install-app.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'cloudify.interfaces.monitoring.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'create': {
                'inputs': {'script_path': 'nodejs-scripts/install-app.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'creation': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.lifecycle.start': {
                'inputs': {'script_path': 'nodejs-scripts/start-app.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'cloudify.interfaces.monitoring.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.lifecycle.configure': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.validation.deletion': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
        },
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-ApplicationModule', 'nodejs-app'],
        'blueprint_id': 'nc2',
        'plugins': {
            'script': {
                'source': null,
                'name': 'script',
                'install': false,
                'executor': 'host_agent'
            }
        },
        'host_id': 'nodejs_vm',
        'id': 'nodecellar_app',
        'relationships': [{
            'source_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'target_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
            'target_id': 'nodejs',
            'type': 'cloudify.relationships.contained_in',
            'properties': {'connection_type': 'all_to_all'},
            '$$hashKey': '04V'
        }, {
            'source_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {
                    'inputs': {'script_path': 'nodecellar-scripts/postconfigure.py'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {'script_path': 'nodecellar-scripts/postconfigure.py'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'target_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'nodecellar_connected_to_mongo'],
            'target_id': 'mongod',
            'type': 'nodecellar_connected_to_mongo',
            'properties': {'connection_type': 'all_to_all'},
            'node': {
                'operations': {
                    'cloudify.interfaces.validation.creation': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.lifecycle.stop': {
                        'inputs': {'script_path': 'mongo-scripts/stop-mongo.sh'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'cloudify.interfaces.lifecycle.delete': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.lifecycle.create': {
                        'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'cloudify.interfaces.monitoring.start': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'create': {
                        'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'creation': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.lifecycle.start': {
                        'inputs': {'script_path': 'mongo-scripts/start-mongo.sh'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'cloudify.interfaces.monitoring.stop': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.lifecycle.configure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.validation.deletion': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-DBMS', 'mongo-database'],
                'blueprint_id': 'nc2',
                'plugins': {
                    'script': {
                        'source': null,
                        'name': 'script',
                        'install': false,
                        'executor': 'host_agent'
                    }
                },
                'host_id': 'mongod_vm',
                'id': 'mongod',
                'relationships': [{
                    'source_operations': {
                        'preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.unlink': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                        'establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        }
                    },
                    'target_operations': {
                        'preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.unlink': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                        'establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        }
                    },
                    'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                    'target_id': 'mongod_vm',
                    'type': 'cloudify.relationships.contained_in',
                    'properties': {'connection_type': 'all_to_all'},
                    '$$hashKey': '04B'
                }],
                'plugins_to_install': null,
                'properties': {
                    'role': 'mongod',
                    'port': 27017,
                    'cloudify_runtime': {}
                },
                'number_of_instances': '1',
                'deployment_id': 'nodecellarDep2',
                'type': 'mongo_database',
                'name': 'mongod',
                'state': {
                    'status': 3,
                    'state': 0,
                    'states': 0,
                    'completed': 0,
                    'total': 1,
                    'process': {'done': 0},
                    'instancesIds': ['mongod'],
                    'reachables': 0
                },
                'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS mongo-database',
                'isApp': false,
                'isContained': true,
                'dataType': 'middleware'
            },
            '$$hashKey': '04W'
        }],
        'plugins_to_install': null,
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
        'number_of_instances': '1',
        'deployment_id': 'nodecellarDep2',
        'type': 'nodejs_app',
        'name': 'nodecellar_app',
        'state': {
            'status': 3,
            'state': 0,
            'states': 0,
            'completed': 0,
            'total': 1,
            'process': {'done': 0},
            'instancesIds': ['nodecellar_app'],
            'reachables': 0
        },
        'class': 'cloudify-nodes-Root cloudify-nodes-ApplicationModule nodejs-app',
        'isApp': true,
        'isContained': true,
        'dataType': 'modules'
    }, {
        'operations': {
            'cloudify.interfaces.validation.creation': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.delete': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.create': {
                'inputs': {'script_path': 'nodejs-scripts/install-nodejs.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'cloudify.interfaces.monitoring.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'create': {
                'inputs': {'script_path': 'nodejs-scripts/install-nodejs.sh'},
                'operation': 'script_runner.tasks.run',
                'plugin': 'script'
            },
            'creation': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.lifecycle.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.monitoring.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.lifecycle.configure': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.validation.deletion': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
        },
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-ApplicationServer', 'nodejs-server'],
        'blueprint_id': 'nc2',
        'plugins': {
            'script': {
                'source': null,
                'name': 'script',
                'install': false,
                'executor': 'host_agent'
            }
        },
        'host_id': 'nodejs_vm',
        'id': 'nodejs',
        'relationships': [{
            'source_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'target_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
            'target_id': 'nodejs_vm',
            'type': 'cloudify.relationships.contained_in',
            'properties': {'connection_type': 'all_to_all'},
            '$$hashKey': '04N'
        }],
        'plugins_to_install': null,
        'properties': {'cloudify_runtime': {}},
        'number_of_instances': '1',
        'deployment_id': 'nodecellarDep2',
        'type': 'nodejs_server',
        'name': 'nodejs',
        'state': {
            'status': 3,
            'state': 0,
            'states': 0,
            'completed': 0,
            'total': 1,
            'process': {'done': 0},
            'instancesIds': ['nodejs'],
            'reachables': 0
        },
        'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-ApplicationServer nodejs-server',
        'isApp': false,
        'children': [{
            'operations': {
                'cloudify.interfaces.validation.creation': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.lifecycle.stop': {
                    'inputs': {'script_path': 'nodejs-scripts/stop-app.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'cloudify.interfaces.lifecycle.delete': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.lifecycle.create': {
                    'inputs': {'script_path': 'nodejs-scripts/install-app.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'cloudify.interfaces.monitoring.start': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'create': {
                    'inputs': {'script_path': 'nodejs-scripts/install-app.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'creation': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.lifecycle.start': {
                    'inputs': {'script_path': 'nodejs-scripts/start-app.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'cloudify.interfaces.monitoring.stop': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.lifecycle.configure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.validation.deletion': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-ApplicationModule', 'nodejs-app'],
            'blueprint_id': 'nc2',
            'plugins': {
                'script': {
                    'source': null,
                    'name': 'script',
                    'install': false,
                    'executor': 'host_agent'
                }
            },
            'host_id': 'nodejs_vm',
            'id': 'nodecellar_app',
            'relationships': [{
                'source_operations': {
                    'preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.unlink': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.establish': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'target_operations': {
                    'preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.unlink': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.establish': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                'target_id': 'nodejs',
                'type': 'cloudify.relationships.contained_in',
                'properties': {'connection_type': 'all_to_all'},
                '$$hashKey': '04V'
            }, {
                'source_operations': {
                    'preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'postconfigure': {
                        'inputs': {'script_path': 'nodecellar-scripts/postconfigure.py'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'cloudify.interfaces.relationship_lifecycle.unlink': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.establish': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                        'inputs': {'script_path': 'nodecellar-scripts/postconfigure.py'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'target_operations': {
                    'preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.unlink': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.establish': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'nodecellar_connected_to_mongo'],
                'target_id': 'mongod',
                'type': 'nodecellar_connected_to_mongo',
                'properties': {'connection_type': 'all_to_all'},
                'node': {
                    'operations': {
                        'cloudify.interfaces.validation.creation': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.lifecycle.stop': {
                            'inputs': {'script_path': 'mongo-scripts/stop-mongo.sh'},
                            'operation': 'script_runner.tasks.run',
                            'plugin': 'script'
                        },
                        'cloudify.interfaces.lifecycle.delete': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.lifecycle.create': {
                            'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                            'operation': 'script_runner.tasks.run',
                            'plugin': 'script'
                        },
                        'cloudify.interfaces.monitoring.start': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'create': {
                            'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                            'operation': 'script_runner.tasks.run',
                            'plugin': 'script'
                        },
                        'creation': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.lifecycle.start': {
                            'inputs': {'script_path': 'mongo-scripts/start-mongo.sh'},
                            'operation': 'script_runner.tasks.run',
                            'plugin': 'script'
                        },
                        'cloudify.interfaces.monitoring.stop': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'deletion': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.lifecycle.configure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'configure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.validation.deletion': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
                    },
                    'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-DBMS', 'mongo-database'],
                    'blueprint_id': 'nc2',
                    'plugins': {
                        'script': {
                            'source': null,
                            'name': 'script',
                            'install': false,
                            'executor': 'host_agent'
                        }
                    },
                    'host_id': 'mongod_vm',
                    'id': 'mongod',
                    'relationships': [{
                        'source_operations': {
                            'preconfigure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'postconfigure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.relationship_lifecycle.unlink': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.relationship_lifecycle.establish': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'unlink': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'establish': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            }
                        },
                        'target_operations': {
                            'preconfigure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'postconfigure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.relationship_lifecycle.unlink': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.relationship_lifecycle.establish': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'unlink': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'establish': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            }
                        },
                        'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                        'target_id': 'mongod_vm',
                        'type': 'cloudify.relationships.contained_in',
                        'properties': {'connection_type': 'all_to_all'},
                        '$$hashKey': '04B'
                    }],
                    'plugins_to_install': null,
                    'properties': {
                        'role': 'mongod',
                        'port': 27017,
                        'cloudify_runtime': {}
                    },
                    'number_of_instances': '1',
                    'deployment_id': 'nodecellarDep2',
                    'type': 'mongo_database',
                    'name': 'mongod',
                    'state': {
                        'status': 3,
                        'state': 0,
                        'states': 0,
                        'completed': 0,
                        'total': 1,
                        'process': {'done': 0},
                        'instancesIds': ['mongod'],
                        'reachables': 0
                    },
                    'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS mongo-database',
                    'isApp': false,
                    'isContained': true,
                    'dataType': 'middleware'
                },
                '$$hashKey': '04W'
            }],
            'plugins_to_install': null,
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
            'number_of_instances': '1',
            'deployment_id': 'nodecellarDep2',
            'type': 'nodejs_app',
            'name': 'nodecellar_app',
            'state': {
                'status': 3,
                'state': 0,
                'states': 0,
                'completed': 0,
                'total': 1,
                'process': {'done': 0},
                'instancesIds': ['nodecellar_app'],
                'reachables': 0
            },
            'class': 'cloudify-nodes-Root cloudify-nodes-ApplicationModule nodejs-app',
            'isApp': true,
            'isContained': true,
            'dataType': 'modules'
        }],
        'isContained': true,
        'dataType': 'middleware'
    }, {
        'operations': {
            'cloudify.interfaces.lifecycle.delete': {
                'inputs': {},
                'operation': 'nova_plugin.server.delete',
                'plugin': 'openstack'
            },
            'creation': {
                'inputs': {},
                'operation': 'nova_plugin.server.creation_validation',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.worker_installer.restart': {
                'inputs': {},
                'operation': 'worker_installer.tasks.restart',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.monitoring_agent.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.worker_installer.start': {
                'inputs': {},
                'operation': 'worker_installer.tasks.start',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.lifecycle.create': {
                'inputs': {},
                'operation': 'nova_plugin.server.create',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring.start': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'create': {
                'inputs': {},
                'operation': 'nova_plugin.server.create',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring_agent.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.monitoring.stop': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.validation.deletion': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.host.get_state': {
                'inputs': {},
                'operation': 'nova_plugin.server.get_state',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.plugin_installer.install': {
                'inputs': {},
                'operation': 'plugin_installer.tasks.install',
                'plugin': 'plugin_installer'
            },
            'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
            'cloudify.interfaces.worker_installer.stop': {
                'inputs': {},
                'operation': 'worker_installer.tasks.stop',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.lifecycle.configure': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.worker_installer.install': {
                'inputs': {},
                'operation': 'worker_installer.tasks.install',
                'plugin': 'agent_installer'
            },
            'restart': {
                'inputs': {},
                'operation': 'worker_installer.tasks.restart',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.validation.creation': {
                'inputs': {},
                'operation': 'nova_plugin.server.creation_validation',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.worker_installer.uninstall': {
                'inputs': {},
                'operation': 'worker_installer.tasks.uninstall',
                'plugin': 'agent_installer'
            },
            'cloudify.interfaces.lifecycle.stop': {
                'inputs': {},
                'operation': 'nova_plugin.server.stop',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring_agent.uninstall': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'cloudify.interfaces.lifecycle.start': {
                'inputs': {},
                'operation': 'nova_plugin.server.start',
                'plugin': 'openstack'
            },
            'get_state': {
                'inputs': {},
                'operation': 'nova_plugin.server.get_state',
                'plugin': 'openstack'
            },
            'cloudify.interfaces.monitoring_agent.install': {
                'inputs': {},
                'operation': '',
                'plugin': ''
            },
            'delete': {
                'inputs': {},
                'operation': 'nova_plugin.server.delete',
                'plugin': 'openstack'
            }
        },
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-Compute', 'cloudify-openstack-nodes-Server', 'vm-host'],
        'blueprint_id': 'nc2',
        'plugins': {
            'openstack': {
                'source': 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1rc1.zip',
                'name': 'openstack',
                'install': true,
                'executor': 'central_deployment_agent'
            },
            'plugin_installer': {
                'source': null,
                'name': 'plugin_installer',
                'install': false,
                'executor': 'host_agent'
            },
            'agent_installer': {
                'source': null,
                'name': 'agent_installer',
                'install': false,
                'executor': 'central_deployment_agent'
            }
        },
        'host_id': 'nodejs_vm',
        'id': 'nodejs_vm',
        'relationships': [{
            'source_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.disconnect_floatingip',
                    'plugin': 'openstack'
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.connect_floatingip',
                    'plugin': 'openstack'
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.disconnect_floatingip',
                    'plugin': 'openstack'
                },
                'establish': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.connect_floatingip',
                    'plugin': 'openstack'
                }
            },
            'target_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'cloudify.openstack.server_connected_to_floating_ip'],
            'target_id': 'floatingip',
            'type': 'cloudify.openstack.server_connected_to_floating_ip',
            'properties': {'connection_type': 'all_to_all'},
            'node': {
                'operations': {
                    'cloudify.interfaces.validation.creation': {
                        'inputs': {},
                        'operation': 'neutron_plugin.floatingip.creation_validation',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.stop': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.lifecycle.delete': {
                        'inputs': {},
                        'operation': 'neutron_plugin.floatingip.delete',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.create': {
                        'inputs': {},
                        'operation': 'neutron_plugin.floatingip.create',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.monitoring.start': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'create': {
                        'inputs': {},
                        'operation': 'neutron_plugin.floatingip.create',
                        'plugin': 'openstack'
                    },
                    'creation': {
                        'inputs': {},
                        'operation': 'neutron_plugin.floatingip.creation_validation',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.start': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.monitoring.stop': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.lifecycle.configure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.validation.deletion': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'delete': {
                        'inputs': {},
                        'operation': 'neutron_plugin.floatingip.delete',
                        'plugin': 'openstack'
                    }
                },
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-VirtualIP', 'cloudify-openstack-nodes-FloatingIP'],
                'blueprint_id': 'nc2',
                'plugins': {
                    'openstack': {
                        'source': 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1rc1.zip',
                        'name': 'openstack',
                        'install': true,
                        'executor': 'central_deployment_agent'
                    }
                },
                'host_id': null,
                'id': 'floatingip',
                'relationships': [],
                'plugins_to_install': null,
                'properties': {
                    'use_external_resource': false,
                    'floatingip': {'floating_network_name': 'Ext-Net'},
                    'openstack_config': {},
                    'cloudify_runtime': {},
                    'resource_id': ''
                },
                'number_of_instances': '1',
                'deployment_id': 'nodecellarDep2',
                'type': 'cloudify.openstack.nodes.FloatingIP',
                'name': 'floatingip',
                'state': {
                    'status': 3,
                    'state': 0,
                    'states': 0,
                    'completed': 0,
                    'total': 1,
                    'process': {'done': 0},
                    'instancesIds': ['floatingip'],
                    'reachables': 0
                },
                'class': 'cloudify-nodes-Root cloudify-nodes-VirtualIP cloudify-openstack-nodes-FloatingIP',
                'isApp': false
            },
            '$$hashKey': '04E'
        }, {
            'source_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.disconnect_security_group',
                    'plugin': 'openstack'
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.connect_security_group',
                    'plugin': 'openstack'
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.disconnect_security_group',
                    'plugin': 'openstack'
                },
                'establish': {
                    'inputs': {},
                    'operation': 'nova_plugin.server.connect_security_group',
                    'plugin': 'openstack'
                }
            },
            'target_operations': {
                'preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'postconfigure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.relationship_lifecycle.unlink': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.establish': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'cloudify.openstack.server_connected_to_security_group'],
            'target_id': 'node_cellar_security_group',
            'type': 'cloudify.openstack.server_connected_to_security_group',
            'properties': {'connection_type': 'all_to_all'},
            'node': {
                'operations': {
                    'cloudify.interfaces.validation.creation': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.creation_validation',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.stop': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.lifecycle.delete': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.delete',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.create': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.create',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.monitoring.start': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'create': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.create',
                        'plugin': 'openstack'
                    },
                    'creation': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.creation_validation',
                        'plugin': 'openstack'
                    },
                    'cloudify.interfaces.lifecycle.start': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.monitoring.stop': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.lifecycle.configure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.validation.deletion': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'delete': {
                        'inputs': {},
                        'operation': 'neutron_plugin.security_group.delete',
                        'plugin': 'openstack'
                    }
                },
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-openstack-nodes-SecurityGroup'],
                'blueprint_id': 'nc2',
                'plugins': {
                    'openstack': {
                        'source': 'https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1rc1.zip',
                        'name': 'openstack',
                        'install': true,
                        'executor': 'central_deployment_agent'
                    }
                },
                'host_id': null,
                'id': 'node_cellar_security_group',
                'relationships': [],
                'plugins_to_install': null,
                'properties': {
                    'openstack_config': {},
                    'resource_id': '',
                    'rules': [{
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': 8080
                    }, {
                        'remote_ip_prefix': '0.0.0.0/0',
                        'port': 27017
                    }, {'remote_ip_prefix': '0.0.0.0/0', 'port': 28017}],
                    'security_group': {'name': 'node_cellar_security_group'},
                    'disable_default_egress_rules': false,
                    'use_external_resource': false,
                    'cloudify_runtime': {}
                },
                'number_of_instances': '1',
                'deployment_id': 'nodecellarDep2',
                'type': 'cloudify.openstack.nodes.SecurityGroup',
                'name': 'node_cellar_security_group',
                'state': {
                    'status': 3,
                    'state': 0,
                    'states': 0,
                    'completed': 0,
                    'total': 1,
                    'process': {'done': 0},
                    'instancesIds': ['node_cellar_security_group'],
                    'reachables': 0
                },
                'class': 'cloudify-nodes-Root cloudify-openstack-nodes-SecurityGroup',
                'isApp': false
            },
            '$$hashKey': '04F'
        }],
        'plugins_to_install': [{
            'source': null,
            'name': 'plugin_installer',
            'install': false,
            'executor': 'host_agent'
        }, {
            'source': null,
            'name': 'script',
            'install': false,
            'executor': 'host_agent'
        }],
        'properties': {
            'cloudify_agent': {'user': 'ubuntu'},
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
        'number_of_instances': '1',
        'deployment_id': 'nodecellarDep2',
        'type': 'vm_host',
        'name': 'nodejs_vm',
        'state': {
            'status': 3,
            'state': 0,
            'states': 0,
            'completed': 0,
            'total': 1,
            'process': {'done': 0},
            'instancesIds': ['nodejs_vm'],
            'reachables': 0
        },
        'class': 'cloudify-nodes-Root cloudify-nodes-Compute cloudify-openstack-nodes-Server vm-host',
        'isApp': false,
        'children': [{
            'operations': {
                'cloudify.interfaces.validation.creation': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.lifecycle.stop': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.lifecycle.delete': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.lifecycle.create': {
                    'inputs': {'script_path': 'nodejs-scripts/install-nodejs.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'cloudify.interfaces.monitoring.start': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'create': {
                    'inputs': {'script_path': 'nodejs-scripts/install-nodejs.sh'},
                    'operation': 'script_runner.tasks.run',
                    'plugin': 'script'
                },
                'creation': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.lifecycle.start': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'cloudify.interfaces.monitoring.stop': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.lifecycle.configure': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
                'cloudify.interfaces.validation.deletion': {
                    'inputs': {},
                    'operation': '',
                    'plugin': ''
                },
                'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
            },
            'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-ApplicationServer', 'nodejs-server'],
            'blueprint_id': 'nc2',
            'plugins': {
                'script': {
                    'source': null,
                    'name': 'script',
                    'install': false,
                    'executor': 'host_agent'
                }
            },
            'host_id': 'nodejs_vm',
            'id': 'nodejs',
            'relationships': [{
                'source_operations': {
                    'preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.unlink': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.establish': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'target_operations': {
                    'preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.unlink': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.establish': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'establish': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                'target_id': 'nodejs_vm',
                'type': 'cloudify.relationships.contained_in',
                'properties': {'connection_type': 'all_to_all'},
                '$$hashKey': '04N'
            }],
            'plugins_to_install': null,
            'properties': {'cloudify_runtime': {}},
            'number_of_instances': '1',
            'deployment_id': 'nodecellarDep2',
            'type': 'nodejs_server',
            'name': 'nodejs',
            'state': {
                'status': 3,
                'state': 0,
                'states': 0,
                'completed': 0,
                'total': 1,
                'process': {'done': 0},
                'instancesIds': ['nodejs'],
                'reachables': 0
            },
            'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-ApplicationServer nodejs-server',
            'isApp': false,
            'children': [{
                'operations': {
                    'cloudify.interfaces.validation.creation': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.lifecycle.stop': {
                        'inputs': {'script_path': 'nodejs-scripts/stop-app.sh'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'cloudify.interfaces.lifecycle.delete': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'cloudify.interfaces.lifecycle.create': {
                        'inputs': {'script_path': 'nodejs-scripts/install-app.sh'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'cloudify.interfaces.monitoring.start': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'create': {
                        'inputs': {'script_path': 'nodejs-scripts/install-app.sh'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'creation': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.lifecycle.start': {
                        'inputs': {'script_path': 'nodejs-scripts/start-app.sh'},
                        'operation': 'script_runner.tasks.run',
                        'plugin': 'script'
                    },
                    'cloudify.interfaces.monitoring.stop': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'deletion': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.lifecycle.configure': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'configure': {'inputs': {}, 'operation': '', 'plugin': ''},
                    'cloudify.interfaces.validation.deletion': {
                        'inputs': {},
                        'operation': '',
                        'plugin': ''
                    },
                    'delete': {'inputs': {}, 'operation': '', 'plugin': ''}
                },
                'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-ApplicationModule', 'nodejs-app'],
                'blueprint_id': 'nc2',
                'plugins': {
                    'script': {
                        'source': null,
                        'name': 'script',
                        'install': false,
                        'executor': 'host_agent'
                    }
                },
                'host_id': 'nodejs_vm',
                'id': 'nodecellar_app',
                'relationships': [{
                    'source_operations': {
                        'preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.unlink': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                        'establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        }
                    },
                    'target_operations': {
                        'preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.unlink': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                        'establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        }
                    },
                    'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                    'target_id': 'nodejs',
                    'type': 'cloudify.relationships.contained_in',
                    'properties': {'connection_type': 'all_to_all'},
                    '$$hashKey': '04V'
                }, {
                    'source_operations': {
                        'preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'postconfigure': {
                            'inputs': {'script_path': 'nodecellar-scripts/postconfigure.py'},
                            'operation': 'script_runner.tasks.run',
                            'plugin': 'script'
                        },
                        'cloudify.interfaces.relationship_lifecycle.unlink': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                            'inputs': {'script_path': 'nodecellar-scripts/postconfigure.py'},
                            'operation': 'script_runner.tasks.run',
                            'plugin': 'script'
                        },
                        'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                        'establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        }
                    },
                    'target_operations': {
                        'preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.unlink': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        },
                        'unlink': {'inputs': {}, 'operation': '', 'plugin': ''},
                        'establish': {
                            'inputs': {},
                            'operation': '',
                            'plugin': ''
                        }
                    },
                    'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.connected_to', 'nodecellar_connected_to_mongo'],
                    'target_id': 'mongod',
                    'type': 'nodecellar_connected_to_mongo',
                    'properties': {'connection_type': 'all_to_all'},
                    'node': {
                        'operations': {
                            'cloudify.interfaces.validation.creation': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.lifecycle.stop': {
                                'inputs': {'script_path': 'mongo-scripts/stop-mongo.sh'},
                                'operation': 'script_runner.tasks.run',
                                'plugin': 'script'
                            },
                            'cloudify.interfaces.lifecycle.delete': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.lifecycle.create': {
                                'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                                'operation': 'script_runner.tasks.run',
                                'plugin': 'script'
                            },
                            'cloudify.interfaces.monitoring.start': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'create': {
                                'inputs': {'script_path': 'mongo-scripts/install-mongo.sh'},
                                'operation': 'script_runner.tasks.run',
                                'plugin': 'script'
                            },
                            'creation': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.lifecycle.start': {
                                'inputs': {'script_path': 'mongo-scripts/start-mongo.sh'},
                                'operation': 'script_runner.tasks.run',
                                'plugin': 'script'
                            },
                            'cloudify.interfaces.monitoring.stop': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'deletion': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.lifecycle.configure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'configure': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'cloudify.interfaces.validation.deletion': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            },
                            'delete': {
                                'inputs': {},
                                'operation': '',
                                'plugin': ''
                            }
                        },
                        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-DBMS', 'mongo-database'],
                        'blueprint_id': 'nc2',
                        'plugins': {
                            'script': {
                                'source': null,
                                'name': 'script',
                                'install': false,
                                'executor': 'host_agent'
                            }
                        },
                        'host_id': 'mongod_vm',
                        'id': 'mongod',
                        'relationships': [{
                            'source_operations': {
                                'preconfigure': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'postconfigure': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'cloudify.interfaces.relationship_lifecycle.unlink': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'cloudify.interfaces.relationship_lifecycle.establish': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'unlink': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'establish': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                }
                            },
                            'target_operations': {
                                'preconfigure': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'postconfigure': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'cloudify.interfaces.relationship_lifecycle.unlink': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'cloudify.interfaces.relationship_lifecycle.preconfigure': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'cloudify.interfaces.relationship_lifecycle.establish': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'cloudify.interfaces.relationship_lifecycle.postconfigure': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'unlink': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                },
                                'establish': {
                                    'inputs': {},
                                    'operation': '',
                                    'plugin': ''
                                }
                            },
                            'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                            'target_id': 'mongod_vm',
                            'type': 'cloudify.relationships.contained_in',
                            'properties': {'connection_type': 'all_to_all'},
                            '$$hashKey': '04B'
                        }],
                        'plugins_to_install': null,
                        'properties': {
                            'role': 'mongod',
                            'port': 27017,
                            'cloudify_runtime': {}
                        },
                        'number_of_instances': '1',
                        'deployment_id': 'nodecellarDep2',
                        'type': 'mongo_database',
                        'name': 'mongod',
                        'state': {
                            'status': 3,
                            'state': 0,
                            'states': 0,
                            'completed': 0,
                            'total': 1,
                            'process': {'done': 0},
                            'instancesIds': ['mongod'],
                            'reachables': 0
                        },
                        'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS mongo-database',
                        'isApp': false,
                        'isContained': true,
                        'dataType': 'middleware'
                    },
                    '$$hashKey': '04W'
                }],
                'plugins_to_install': null,
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
                'number_of_instances': '1',
                'deployment_id': 'nodecellarDep2',
                'type': 'nodejs_app',
                'name': 'nodecellar_app',
                'state': {
                    'status': 3,
                    'state': 0,
                    'states': 0,
                    'completed': 0,
                    'total': 1,
                    'process': {'done': 0},
                    'instancesIds': ['nodecellar_app'],
                    'reachables': 0
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
        'dataType': 'compute',
        'nodeType': 'node'
    }];

    beforeEach(module('cosmoUiApp', 'backend-mock'));

    beforeEach(
        // Initialize a new instance of NodeSearchService
        inject(function (UpdateNodes) {
            mUpdateNodes = UpdateNodes;
            _updateNodesInstance = mUpdateNodes.newInstance();
        }));

    describe('Unit tests', function () {

        it('should create a new mUpdateNodes object', function () {
            expect(mUpdateNodes).not.toBeUndefined();
        });

        it('should create a mUpdateNodes instance', function () {
            expect(_updateNodesInstance).not.toBeUndefined();
        });

        it('should check if runUpdate exist', function () {
            expect(_updateNodesInstance.runUpdate).not.toBeUndefined();
        });

        it('should get node instances with public ip', function () {
            _updateNodesInstance.runUpdate(nodesInstances, nodeList);
            /* jshint camelcase: false */
            expect(nodesInstances[9].runtime_properties.ip_addresses).toContain('15.126.221.40');
        });

    });

});
