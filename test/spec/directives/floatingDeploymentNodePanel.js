'use strict';

describe('Directive: floatingDeploymentNodePanel', function () {
    var element, scope, isolateScope;

    var _nodeInstance = {
        'relationships': [{
            'target_name': 'nodecellar_security_group',
            'type': 'cloudify.openstack.server_connected_to_security_group',
            'target_id': 'nodecellar_security_group_b0cec'
        }, {
            'target_name': 'nodecellar_floatingip',
            'type': 'cloudify.openstack.server_connected_to_floating_ip',
            'target_id': 'nodecellar_floatingip_9cfed'
        }],
        'runtime_properties': {
            'cloudify_agent': {
                'user': 'ubuntu'
            },
            'resource_id': '',
            'ip': '1.1.1.1',
            'management_network_name': '',
            'server': {
                'image': '75d47d10-fef8-473b-9dd1-fe2f7649cb41',
                'flavor': 101,
                'security_groups': ['node_cellar_security_group']
            }
        },
        'node_id': 'nodejs_host',
        'version': null,
        'state': 'started',
        'host_id': 'nodejs_host_b86e1',
        'deployment_id': 'deployment1',
        'id': 'nodejs_host_b86e1'
    };

    var _nodes = [{
        'deploy_number_of_instances': '1',
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-SoftwareComponent', 'cloudify-nodes-DBMS', 'nodecellar-nodes-MongoDatabase'],
        'blueprint_id': 'nodecellar1',
        'host_id': 'mongod_host',
        'type': 'nodecellar.nodes.MongoDatabase',
        'id': 'mongod',
        'number_of_instances': '1',
        'deployment_id': 'deployment1',
        'planned_number_of_instances': '1',
        'name': 'mongod',
        'class': 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS nodecellar-nodes-MongoDatabase',
        'isApp': false,
        'isHost': false,
        'isContained': true,
        'dataType': 'middleware'
    }, {
        'deploy_number_of_instances': '1',
        'type_hierarchy': ['cloudify-nodes-Root', 'cloudify-nodes-Compute', 'cloudify-openstack-nodes-Server', 'nodecellar-nodes-MonitoredServer'],
        'blueprint_id': 'nodecellar1',
        'host_id': 'mongod_host',
        'type': 'nodecellar.nodes.MonitoredServer',
        'id': 'nodejs_host',
        'number_of_instances': '1',
        'deployment_id': 'deployment1',
        'planned_number_of_instances': '1',
        'name': 'nodejs_host',
        'class': 'cloudify-nodes-Root cloudify-nodes-Compute cloudify-openstack-nodes-Server nodecellar-nodes-MonitoredServer',
        'isApp': false,
        'isHost': true,
        'isContained': false,
        'dataType': 'compute'
    }];

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    beforeEach(inject(function ($compile, $rootScope, cloudifyClient ) {

        // by default, don't return a response. invokes unwanted update during tests
        spyOn(cloudifyClient.nodeInstances,'list').andReturn( { then : function(success) { } } );

        scope = $rootScope.$new();
        scope.node = _nodeInstance;
        scope.deploymentId = 'deployment1';
        scope.nodesList = _nodes;
        element = $compile(angular.element('<div floating-deployment-node-panel node="node" depid="deploymentId" nodes-list="nodesList"></div>'))(scope);

        $rootScope.$digest();

        scope = element.isolateScope();
        isolateScope = element.children().scope();
        scope.$apply();

        scope.nodesList = _nodes;
        scope.showProperties = undefined;
    }));


    it('should create an element with nodeSelected function', function () {
        expect(typeof(scope.nodeSelected)).toBe('function');
    });

    describe('#nodeSelected', function() {
        it('should create showProperties object with runtime properties', function () {
            scope.nodeSelected(_nodeInstance);
            expect(scope.showProperties.properties).toBeDefined();
            expect(scope.showProperties.properties.ip).toBe('1.1.1.1');
            expect(scope.showProperties.general.state).toBe('started');
        });
    });

    describe('#showPanel', function(){
        it('should show panel when node is set', function () {
            scope.node = _nodeInstance;
            scope.$apply();
            expect(isolateScope.showPanel).toBe(true);
        });

        it('should hide panel when node is set to null', function () {
            scope.node = null;
            scope.$apply();
            expect(isolateScope.showPanel).toBe(false);
        });
    });

    describe('#hideProperties', function(){
        it('should make node null', function(){
            scope.node = 'foo';
            scope.hideProperties();
            expect(scope.node).toBe(null);
        }) ;
    });

    describe('#showRelationship', function(){
        it('should toggle value if different', function(){
            scope.selectedRelationship = 'foo';
            scope.showRelationship('foo');
            expect(scope.selectedRelationship).toBe('');
            scope.showRelationship('foo');
            expect(scope.selectedRelationship).toBe('foo');

        });
    });


    describe('#getPropertyKeyName', function(){

        it('should return public IPs instead of public ip\'s', function () {
            expect(scope.getPropertyKeyName('ip_addresses')).toBe('public IPs');
            expect(scope.getPropertyKeyName('ip')).toBe('private IP');
        });

        it('should create showProperties object with node type (CFY-2428)', function () {
            scope.nodeSelected(_nodeInstance);
            expect(scope.showProperties).not.toBe(undefined);
            expect(scope.showProperties.general.type).toBe('nodecellar.nodes.MonitoredServer');
        });
    });


});
