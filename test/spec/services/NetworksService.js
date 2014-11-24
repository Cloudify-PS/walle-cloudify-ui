'use strict';

describe('Service: NetworksService', function () {

    var NetworksService;
    var color;
    var colorsList = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00'];
    var providerData = {
        "name": "cloudify_openstack",
        "context": {
            "cloudify": {
                "cloudify_agent": {
                    "remote_execution_port": 22,
                    "max_workers": 5,
                    "min_workers": 2,
                    "agent_key_path": "~/.ssh/ui-agents-kp.pem"
                },
                "policy_engine": {
                    "start_timeout": 30
                },
                "resources_prefix": "",
                "workflows": {
                    "task_retries": -1,
                    "task_retry_interval": 30
                }
            },
            "resources": {
                "subnet": {
                    "id": "f54ccdbd-b2eb-405a-abaf-8e5d967c361c",
                    "type": "subnet",
                    "external_resource": true,
                    "name": "ui-management-subnet"
                },
                "int_network": {
                    "id": "e6e33a37-d419-4007-b971-e854b27a5f7e",
                    "type": "network",
                    "external_resource": true,
                    "name": "ui-management-net"
                },
                "management_server": {
                    "id": "d093fffb-4e23-4e3c-8f57-2e3f64e51fd2",
                    "type": "server",
                    "external_resource": false,
                    "name": "ui-cosmo-manager"
                },
                "agents_security_group": {
                    "id": "6c5a84ca-f6b8-499a-8570-abe8e5cda9d7",
                    "type": "neutron security group",
                    "external_resource": true,
                    "name": "ui-sg-agent"
                },
                "agents_keypair": {
                    "id": "ui-agents-kp",
                    "type": "keypair",
                    "external_resource": true,
                    "name": "ui-agents-kp"
                },
                "management_security_group": {
                    "id": "eff67cf6-ce0c-4cfb-be67-cb3789a60cec",
                    "type": "neutron security group",
                    "external_resource": true,
                    "name": "ui-sg-management"
                },
                "floating_ip": {
                    "ip": "192.168.15.13",
                    "type": "floating ip",
                    "id": "None",
                    "external_resource": true
                },
                "ext_network": {
                    "id": "e502de8d-929a-4ee0-bd18-efa297875cf6",
                    "type": "network",
                    "external_resource": true,
                    "name": "public"
                },
                "router": {
                    "id": "93a0f088-7e83-4837-9b32-7420b18fe7c6",
                    "type": "router",
                    "external_resource": true,
                    "name": "ui-cloudify-router"
                },
                "management_keypair": {
                    "id": "ui-manager-kp",
                    "type": "keypair",
                    "external_resource": true,
                    "name": "ui-manager-kp"
                }
            }
        }
    };
    var nodes = [
        {
            "operations": {
                "create": {
                    "operation": "neutron_plugin.security_group.create",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.lifecycle.delete": {
                    "operation": "neutron_plugin.security_group.delete",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.lifecycle.create": {
                    "operation": "neutron_plugin.security_group.create",
                    "plugin": "openstack"
                },
                "delete": {
                    "operation": "neutron_plugin.security_group.delete",
                    "plugin": "openstack"
                }
            },
            "deployment_plugins_to_install": [
                {
                    "source": "https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m4.zip",
                    "name": "openstack",
                    "install": true,
                    "executor": "central_deployment_agent"
                }
            ],
            "declared_type": "cloudify.openstack.nodes.SecurityGroup",
            "name": "security_group",
            "type_hierarchy": [
                "cloudify.nodes.Root",
                "cloudify.openstack.nodes.SecurityGroup"
            ],
            "id": "security_group",
            "instances": {
                "deploy": 1
            },
            "plugins": {
                "openstack": {
                    "source": "https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m4.zip",
                    "name": "openstack",
                    "install": true,
                    "executor": "central_deployment_agent"
                }
            },
            "type": "cloudify.openstack.nodes.SecurityGroup",
            "properties": {
                "openstack_config": {},
                "resource_id": "",
                "rules": [
                    {
                        "remote_ip_prefix": "0.0.0.0/0",
                        "port": {
                            "get_property": [
                                "http_web_server",
                                "port"
                            ]
                        }
                    }
                ],
                "security_group": {
                    "name": "webserver_security_group"
                },
                "disable_default_egress_rules": false,
                "use_external_resource": false,
                "cloudify_runtime": {}
            }
        },
        {
            "operations": {
                "cloudify.interfaces.lifecycle.configure": {
                    "operation": "script_runner.tasks.run",
                    "properties": {
                        "script_path": "scripts/configure.sh"
                    },
                    "plugin": "script"
                },
                "configure": {
                    "operation": "script_runner.tasks.run",
                    "properties": {
                        "script_path": "scripts/configure.sh"
                    },
                    "plugin": "script"
                },
                "cloudify.interfaces.lifecycle.stop": {
                    "operation": "script_runner.tasks.run",
                    "properties": {
                        "script_path": "scripts/stop.sh"
                    },
                    "plugin": "script"
                },
                "stop": {
                    "operation": "script_runner.tasks.run",
                    "properties": {
                        "script_path": "scripts/stop.sh"
                    },
                    "plugin": "script"
                },
                "start": {
                    "operation": "script_runner.tasks.run",
                    "properties": {
                        "script_path": "scripts/start.sh"
                    },
                    "plugin": "script"
                },
                "cloudify.interfaces.lifecycle.start": {
                    "operation": "script_runner.tasks.run",
                    "properties": {
                        "script_path": "scripts/start.sh"
                    },
                    "plugin": "script"
                }
            },
            "relationships": [
                {
                    "source_operations": {},
                    "target_operations": {},
                    "type_hierarchy": [
                        "cloudify.relationships.depends_on",
                        "cloudify.relationships.contained_in"
                    ],
                    "target_interfaces": {
                        "cloudify.interfaces.relationship_lifecycle": [
                            "preconfigure",
                            "postconfigure",
                            "establish",
                            "unlink"
                        ]
                    },
                    "target_id": "vm",
                    "state": "reachable",
                    "base": "contained",
                    "source_interfaces": {
                        "cloudify.interfaces.relationship_lifecycle": [
                            "preconfigure",
                            "postconfigure",
                            "establish",
                            "unlink"
                        ]
                    },
                    "type": "cloudify.relationships.contained_in",
                    "properties": {
                        "connection_type": "all_to_all"
                    }
                }
            ],
            "declared_type": "cloudify.nodes.WebServer",
            "name": "http_web_server",
            "type_hierarchy": [
                "cloudify.nodes.Root",
                "cloudify.nodes.SoftwareComponent",
                "cloudify.nodes.WebServer"
            ],
            "deployment_plugins_to_install": [],
            "id": "http_web_server",
            "instances": {
                "deploy": 1
            },
            "plugins": {
                "script": {
                    "source": null,
                    "name": "script",
                    "install": false,
                    "executor": "host_agent"
                }
            },
            "host_id": "vm",
            "type": "cloudify.nodes.WebServer",
            "properties": {
                "port": {
                    "get_input": "webserver_port"
                },
                "cloudify_runtime": {}
            }
        },
        {
            "operations": {
                "create": {
                    "operation": "neutron_plugin.floatingip.create",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.lifecycle.delete": {
                    "operation": "neutron_plugin.floatingip.delete",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.lifecycle.create": {
                    "operation": "neutron_plugin.floatingip.create",
                    "plugin": "openstack"
                },
                "delete": {
                    "operation": "neutron_plugin.floatingip.delete",
                    "plugin": "openstack"
                }
            },
            "deployment_plugins_to_install": [
                {
                    "source": "https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m4.zip",
                    "name": "openstack",
                    "install": true,
                    "executor": "central_deployment_agent"
                }
            ],
            "declared_type": "cloudify.openstack.nodes.FloatingIP",
            "name": "virtual_ip",
            "type_hierarchy": [
                "cloudify.nodes.Root",
                "cloudify.openstack.nodes.FloatingIP"
            ],
            "id": "virtual_ip",
            "instances": {
                "deploy": 1
            },
            "plugins": {
                "openstack": {
                    "source": "https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m4.zip",
                    "name": "openstack",
                    "install": true,
                    "executor": "central_deployment_agent"
                }
            },
            "type": "cloudify.openstack.nodes.FloatingIP",
            "properties": {
                "use_external_resource": false,
                "floatingip": {},
                "openstack_config": {},
                "cloudify_runtime": {},
                "resource_id": ""
            }
        },
        {
            "operations": {
                "delete": {
                    "operation": "nova_plugin.server.delete",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.worker_installer.uninstall": {
                    "operation": "worker_installer.tasks.uninstall",
                    "plugin": "agent_installer"
                },
                "cloudify.interfaces.lifecycle.stop": {
                    "operation": "nova_plugin.server.stop",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.lifecycle.delete": {
                    "operation": "nova_plugin.server.delete",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.lifecycle.create": {
                    "operation": "nova_plugin.server.create",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.worker_installer.stop": {
                    "operation": "worker_installer.tasks.stop",
                    "plugin": "agent_installer"
                },
                "create": {
                    "operation": "nova_plugin.server.create",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.worker_installer.restart": {
                    "operation": "worker_installer.tasks.restart",
                    "plugin": "agent_installer"
                },
                "cloudify.interfaces.lifecycle.start": {
                    "operation": "nova_plugin.server.start",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.worker_installer.install": {
                    "operation": "worker_installer.tasks.install",
                    "plugin": "agent_installer"
                },
                "cloudify.interfaces.host.get_state": {
                    "operation": "nova_plugin.server.get_state",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.plugin_installer.install": {
                    "operation": "plugin_installer.tasks.install",
                    "plugin": "plugin_installer"
                },
                "get_state": {
                    "operation": "nova_plugin.server.get_state",
                    "plugin": "openstack"
                },
                "cloudify.interfaces.worker_installer.start": {
                    "operation": "worker_installer.tasks.start",
                    "plugin": "agent_installer"
                },
                "restart": {
                    "operation": "worker_installer.tasks.restart",
                    "plugin": "agent_installer"
                },
                "uninstall": {
                    "operation": "worker_installer.tasks.uninstall",
                    "plugin": "agent_installer"
                }
            },
            "relationships": [
                {
                    "source_operations": {
                        "unlink": {
                            "operation": "nova_plugin.server.disconnect_floatingip",
                            "plugin": "openstack"
                        },
                        "establish": {
                            "operation": "nova_plugin.server.connect_floatingip",
                            "plugin": "openstack"
                        },
                        "cloudify.interfaces.relationship_lifecycle.unlink": {
                            "operation": "nova_plugin.server.disconnect_floatingip",
                            "plugin": "openstack"
                        },
                        "cloudify.interfaces.relationship_lifecycle.establish": {
                            "operation": "nova_plugin.server.connect_floatingip",
                            "plugin": "openstack"
                        }
                    },
                    "target_operations": {},
                    "type_hierarchy": [
                        "cloudify.relationships.depends_on",
                        "cloudify.relationships.connected_to",
                        "cloudify.openstack.server_connected_to_floating_ip"
                    ],
                    "target_interfaces": {
                        "cloudify.interfaces.relationship_lifecycle": [
                            "preconfigure",
                            "postconfigure",
                            "establish",
                            "unlink"
                        ]
                    },
                    "target_id": "virtual_ip",
                    "state": "reachable",
                    "base": "connected",
                    "source_interfaces": {
                        "cloudify.interfaces.relationship_lifecycle": [
                            "preconfigure",
                            "postconfigure",
                            {
                                "establish": "openstack.nova_plugin.server.connect_floatingip"
                            },
                            {
                                "unlink": "openstack.nova_plugin.server.disconnect_floatingip"
                            }
                        ]
                    },
                    "type": "cloudify.openstack.server_connected_to_floating_ip",
                    "properties": {
                        "connection_type": "all_to_all"
                    }
                },
                {
                    "source_operations": {
                        "unlink": {
                            "operation": "nova_plugin.server.disconnect_security_group",
                            "plugin": "openstack"
                        },
                        "establish": {
                            "operation": "nova_plugin.server.connect_security_group",
                            "plugin": "openstack"
                        },
                        "cloudify.interfaces.relationship_lifecycle.unlink": {
                            "operation": "nova_plugin.server.disconnect_security_group",
                            "plugin": "openstack"
                        },
                        "cloudify.interfaces.relationship_lifecycle.establish": {
                            "operation": "nova_plugin.server.connect_security_group",
                            "plugin": "openstack"
                        }
                    },
                    "target_operations": {},
                    "type_hierarchy": [
                        "cloudify.relationships.depends_on",
                        "cloudify.relationships.connected_to",
                        "cloudify.openstack.server_connected_to_security_group"
                    ],
                    "target_interfaces": {
                        "cloudify.interfaces.relationship_lifecycle": [
                            "preconfigure",
                            "postconfigure",
                            "establish",
                            "unlink"
                        ]
                    },
                    "target_id": "security_group",
                    "state": "reachable",
                    "base": "connected",
                    "source_interfaces": {
                        "cloudify.interfaces.relationship_lifecycle": [
                            "preconfigure",
                            "postconfigure",
                            {
                                "establish": "openstack.nova_plugin.server.connect_security_group"
                            },
                            {
                                "unlink": "openstack.nova_plugin.server.disconnect_security_group"
                            }
                        ]
                    },
                    "type": "cloudify.openstack.server_connected_to_security_group",
                    "properties": {
                        "connection_type": "all_to_all"
                    }
                }
            ],
            "declared_type": "cloudify.openstack.nodes.Server",
            "name": "vm",
            "type_hierarchy": [
                "cloudify.nodes.Root",
                "cloudify.nodes.Compute",
                "cloudify.openstack.nodes.Server"
            ],
            "deployment_plugins_to_install": [
                {
                    "source": "https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m4.zip",
                    "name": "openstack",
                    "install": true,
                    "executor": "central_deployment_agent"
                },
                {
                    "source": null,
                    "name": "agent_installer",
                    "install": false,
                    "executor": "central_deployment_agent"
                }
            ],
            "id": "vm",
            "instances": {
                "deploy": 1
            },
            "plugins": {
                "openstack": {
                    "source": "https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/1.1m4.zip",
                    "name": "openstack",
                    "install": true,
                    "executor": "central_deployment_agent"
                },
                "plugin_installer": {
                    "source": null,
                    "name": "plugin_installer",
                    "install": false,
                    "executor": "host_agent"
                },
                "agent_installer": {
                    "source": null,
                    "name": "agent_installer",
                    "install": false,
                    "executor": "central_deployment_agent"
                }
            },
            "host_id": "vm",
            "type": "cloudify.openstack.nodes.Server",
            "properties": {
                "cloudify_agent": {
                    "user": {
                        "get_input": "agent_user"
                    }
                },
                "openstack_config": {},
                "resource_id": "",
                "ip": "",
                "management_network_name": "",
                "server": {
                    "image_name": {
                        "get_input": "image_name"
                    },
                    "flavor_name": {
                        "get_input": "flavor_name"
                    }
                },
                "install_agent": true,
                "use_external_resource": false,
                "cloudify_runtime": {}
            },
            "plugins_to_install": [
                {
                    "source": null,
                    "name": "plugin_installer",
                    "install": false,
                    "executor": "host_agent"
                },
                {
                    "source": null,
                    "name": "script",
                    "install": false,
                    "executor": "host_agent"
                }
            ]
        }
    ];
    var results;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of NetworksService
            inject(function (_NetworksService_) {
                NetworksService = _NetworksService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new NetworksService instance', function() {
            expect(NetworksService).not.toBeUndefined();
        });

        beforeEach(function(){
            results = NetworksService.createNetworkTree(providerData, nodes);
        });

        it('should have external network', function(){
            expect(results.external).not.toBeUndefined();
        });

        it('should have 2 external networks', function(){
            expect(results.external.length).toEqual(2);
        });

        it('should have networks', function(){
            expect(results.networks).not.toBeUndefined();
        });

        it('should have relations', function(){
            expect(results.relations).not.toBeUndefined();
        });

        it('should have 2 relations', function(){
            expect(results.relations.length).toEqual(2);
        });

        it('should have subnet', function(){
            expect(results.external[1].type).toBe('subnet');
        });

        beforeEach(function(){
            color = NetworksService.getNetworkColor();
        });

        it('should have 13 kind of colors', function(){
            expect(color.length).toBe(7);
        });

        it('should contain sample of the color "#D62728"', function(){
            expect(colorsList).toContain(color);
        });

    });

});
