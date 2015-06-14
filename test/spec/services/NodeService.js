'use strict';

describe('Service: NodeService', function () {

    var nodeService;
    var nodesList = [
        {
            'name': 'floatingip',
            'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.openstack.nodes.FloatingIP'],
            'id': 'floatingip',
            'type': 'cloudify.openstack.nodes.FloatingIP'
        },
        {
            'name': 'floatingip',
            'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.nodes.VirtualIP', 'cloudify.libcloud.nodes.FloatingIP'],
            'id': 'floatingip',
            'type': 'cloudify.libcloud.nodes.FloatingIP'
        },
        {
            'name': 'nodejs_vm',
            'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.nodes.Compute', 'cloudify.openstack.nodes.Server', 'vm_host'],
            'id': 'nodejs_vm',
            'type': 'vm_host'
        },
        {
            'relationships': [{
                'type_hierarchy': ['cloudify.relationships.depends_on', 'cloudify.relationships.contained_in'],
                'target_id': 'nodejs_vm',
                'state': 'reachable',
                'base': 'contained',
                'type': 'cloudify.relationships.contained_in'
            }],
            'name': 'nodejs',
            'type_hierarchy': ['cloudify.nodes.Root', 'cloudify.nodes.SoftwareComponent', 'cloudify.nodes.ApplicationServer', 'cloudify.bash.nodes.ApplicationServer', 'nodejs_server'],
            'id': 'nodejs',
            'host_id': 'nodejs_vm',
            'type': 'nodejs_server'
        }
    ];

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    beforeEach(
        inject(function (NodeService) {
            nodeService = NodeService;
        }));

    describe('Unit tests', function () {
        it('should create a new NodeService instance', function () {
            expect(nodeService).not.toBeUndefined();
        });

        it('should create a node tree out of a given node list', function () {
            var nodesTree = nodeService.createNodesTree(nodesList);

            expect(nodesTree.length).toBe(1);
            expect(nodesTree[0].type).not.toBe('cloudify.openstack.nodes.FloatingIP');
            expect(nodesTree[0].type).not.toBe('cloudify.libcloud.nodes.FloatingIP');
            expect(nodesTree[0].dataType).toBe('compute');
            expect(nodesTree[0].children.length).toBe(1);
            expect(nodesTree[0].children[0].children).toBeUndefined();
            expect(nodesTree[0].children[0].type).not.toBe('cloudify.openstack.nodes.FloatingIP');
            expect(nodesTree[0].children[0].type).not.toBe('cloudify.libcloud.nodes.FloatingIP');
            expect(nodesTree[0].children[0].dataType).toBe('middleware');
        });

        it('should set isHost parameter to true only for Compute type nodes', function () {
            var nodesTree = nodeService.createNodesTree(nodesList);

            expect(nodesTree[0].dataType).toBe('compute');
            expect(nodesTree[0].isHost).toBe(true);
            expect(nodesTree[0].children[0].id).toBe('nodejs');
            expect(nodesTree[0].children[0].isHost).toBe(false);
        });
    });

});
