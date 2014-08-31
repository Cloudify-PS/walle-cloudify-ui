'use strict';

describe('Service: NodeService', function () {

    var nodeService;
    var nodesList = [
        {
            "name": "floatingip",
            "type_hierarchy": ["cloudify.types.base", "cloudify.openstack.floatingip"],
            "id": "floatingip",
            "type": "cloudify.openstack.floatingip"
        },
        {
            "name": "floatingip",
            "type_hierarchy": ["cloudify.types.base", "cloudify.types.virtual_ip", "cloudify.libcloud.floatingip"],
            "id": "floatingip",
            "type": "cloudify.libcloud.floatingip"
        },
        {
            "name": "nodejs_vm",
            "type_hierarchy": ["cloudify-types-base", "cloudify-types-host", "cloudify-openstack-server", "vm-host"],
            "id": "nodejs_vm",
            "type": "vm_host"
        },
        {
            "relationships": [{
                "type_hierarchy": ["cloudify.relationships.depends_on", "cloudify.relationships.contained_in"],
                "target_id": "nodejs_vm",
                "state": "reachable",
                "base": "contained",
                "type": "cloudify.relationships.contained_in"
            }],
            "name": "nodejs",
            "type_hierarchy": ["cloudify-types-base", "cloudify-types-middleware-server", "cloudify-types-app-server", "cloudify-types-bash-app-server", "nodejs-server"],
            "id": "nodejs",
            "host_id": "nodejs_vm",
            "type": "nodejs_server"
        }
    ];

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {
            // load the filter's module
            module('cosmoUiApp');

            // initialize a new instance of the filter
            inject(function (NodeService) {
                nodeService = NodeService;
            });
        });
    });

    describe('Unit tests', function() {
        it('should create a new NodeService instance', function() {
            expect(nodeService).not.toBeUndefined();
        });

        it('should create a node tree out of a given node list', function() {
            var nodesTree = nodeService.createNodesTree(nodesList);

            expect(nodesTree.length).toBe(1);
            expect(nodesTree[0].type).not.toBe('cloudify.openstack.floatingip');
            expect(nodesTree[0].type).not.toBe('cloudify.libcloud.floatingip');
            expect(nodesTree[0].dataType).toBe('compute');
            expect(nodesTree[0].children.length).toBe(1);
            expect(nodesTree[0].children[0].children).toBeUndefined();
            expect(nodesTree[0].children[0].type).not.toBe('cloudify.openstack.floatingip');
            expect(nodesTree[0].children[0].type).not.toBe('cloudify.libcloud.floatingip');
            expect(nodesTree[0].children[0].dataType).toBe('middleware');
        });
    });

});
