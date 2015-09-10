'use strict';

// todo : reach 100% code coverage
describe('Controller: SourceCtrl', function () {
    // load the controller's module
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    var SourceCtrl, scope;


    var nodecellarSources = {
        'name': 'root',
        'children': [{
            'name': 'cloudify-nodecellar-example-master',
            'children': [{
                'name': 'inputs',
                'children': [{
                    'name': 'cloudstack-vpc.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/cloudstack-vpc.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/cloudstack-vpc.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'cloudstack.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/cloudstack.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/cloudstack.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'openstack-haproxy.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/openstack-haproxy.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/openstack-haproxy.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'openstack-nova-net.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/openstack-nova-net.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/openstack-nova-net.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'aws-ec2.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/aws-ec2.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/aws-ec2.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'openstack.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/openstack.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/openstack.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'singlehost.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/singlehost.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/singlehost.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'vcloud-fabric-blueprint.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/vcloud-fabric-blueprint.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/vcloud-fabric-blueprint.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'vcloud-haproxy.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/vcloud-haproxy.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/vcloud-haproxy.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'vcloud-without-agent.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/vcloud-without-agent.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/vcloud-without-agent.yaml.template',
                    'encoding': 'ASCII'
                }, {
                    'name': 'vcloud.yaml.template',
                    'relativePath': 'cloudify-nodecellar-example-master/inputs/vcloud.yaml.template',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/inputs/vcloud.yaml.template',
                    'encoding': 'ASCII'
                }]
            }, {
                'name': 'resources',
                'children': [{
                    'name': 'haproxy',
                    'children': [{
                        'name': 'haproxy.cfg.template',
                        'relativePath': 'cloudify-nodecellar-example-master/resources/haproxy/haproxy.cfg.template',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/resources/haproxy/haproxy.cfg.template',
                        'encoding': 'ASCII'
                    }]
                }]
            }, {
                'name': 'scripts',
                'children': [{
                    'name': 'haproxy',
                    'children': [{
                        'name': 'haproxy.py',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/haproxy/haproxy.py',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/haproxy/haproxy.py',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'install-ubuntu.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/haproxy/install-ubuntu.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/haproxy/install-ubuntu.sh',
                        'encoding': 'ASCII'
                    }]
                }, {
                    'name': 'mongo',
                    'children': [{
                        'name': 'install-mongo.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/mongo/install-mongo.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/mongo/install-mongo.sh',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'install-pymongo.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/mongo/install-pymongo.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/mongo/install-pymongo.sh',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'set-mongo-url.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/mongo/set-mongo-url.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/mongo/set-mongo-url.sh',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'start-mongo.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/mongo/start-mongo.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/mongo/start-mongo.sh',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'stop-mongo.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/mongo/stop-mongo.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/mongo/stop-mongo.sh',
                        'encoding': 'ASCII'
                    }]
                }, {
                    'name': 'nodecellar',
                    'children': [{
                        'name': 'install-nodecellar-app.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/nodecellar/install-nodecellar-app.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/nodecellar/install-nodecellar-app.sh',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'start-nodecellar-app.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/nodecellar/start-nodecellar-app.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/nodecellar/start-nodecellar-app.sh',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'stop-nodecellar-app.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/nodecellar/stop-nodecellar-app.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/nodecellar/stop-nodecellar-app.sh',
                        'encoding': 'ASCII'
                    }]
                }, {
                    'name': 'nodejs',
                    'children': [{
                        'name': 'install-nodejs.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/nodejs/install-nodejs.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/nodejs/install-nodejs.sh',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'set-nodejs-root.sh',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/nodejs/set-nodejs-root.sh',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/nodejs/set-nodejs-root.sh',
                        'encoding': 'ASCII'
                    }]
                }, {
                    'name': 'withoutagent',
                    'children': [{
                        'name': 'install_mongo.py',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/withoutagent/install_mongo.py',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/withoutagent/install_mongo.py',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'install_nodecellar.py',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/withoutagent/install_nodecellar.py',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/withoutagent/install_nodecellar.py',
                        'encoding': 'ASCII'
                    }, {
                        'name': 'install_nodejs.py',
                        'relativePath': 'cloudify-nodecellar-example-master/scripts/withoutagent/install_nodejs.py',
                        'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/scripts/withoutagent/install_nodejs.py',
                        'encoding': 'ASCII'
                    }]
                }]
            }, {
                'name': 'types',
                'children': [{
                    'name': 'agentless-nodecellar.yaml',
                    'relativePath': 'cloudify-nodecellar-example-master/types/agentless-nodecellar.yaml',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/types/agentless-nodecellar.yaml',
                    'encoding': 'ASCII'
                }, {
                    'name': 'haproxy.yaml',
                    'relativePath': 'cloudify-nodecellar-example-master/types/haproxy.yaml',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/types/haproxy.yaml',
                    'encoding': 'ASCII'
                }, {
                    'name': 'nodecellar.yaml',
                    'relativePath': 'cloudify-nodecellar-example-master/types/nodecellar.yaml',
                    'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/types/nodecellar.yaml',
                    'encoding': 'ASCII'
                }]
            }, {
                'name': 'LICENSE',
                'relativePath': 'cloudify-nodecellar-example-master/LICENSE',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/LICENSE',
                'encoding': 'ASCII'
            }, {
                'name': 'README.md',
                'relativePath': 'cloudify-nodecellar-example-master/README.md',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/README.md',
                'encoding': 'ASCII'
            }, {
                'name': 'aws-ec2-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/aws-ec2-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/aws-ec2-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'cloudstack-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/cloudstack-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/cloudstack-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'cloudstack-vpc-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/cloudstack-vpc-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/cloudstack-vpc-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'host-pool-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/host-pool-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/host-pool-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'local-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/local-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/local-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'openstack-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/openstack-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/openstack-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'openstack-haproxy-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/openstack-haproxy-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/openstack-haproxy-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'openstack-nova-net-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/openstack-nova-net-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/openstack-nova-net-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'singlehost-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/singlehost-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/singlehost-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'softlayer-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/softlayer-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/softlayer-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'vcloud-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/vcloud-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/vcloud-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'vcloud-fabric-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/vcloud-fabric-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/vcloud-fabric-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'vcloud-haproxy-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/vcloud-haproxy-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/vcloud-haproxy-blueprint.yaml',
                'encoding': 'ASCII'
            }, {
                'name': 'vcloud-without-agent-blueprint.yaml',
                'relativePath': 'cloudify-nodecellar-example-master/vcloud-without-agent-blueprint.yaml',
                'path': '/tmp/blueprints/with_sources/1436009494572/cloudify-nodecellar-example-master/vcloud-without-agent-blueprint.yaml',
                'encoding': 'ASCII'
            }]
        }]
    };


    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, BlueprintSourceService, CloudifyService) {
        scope = $rootScope.$new();
        scope.id = 'blueprint1';
        scope.errorMessage = 'noPreview';



        spyOn(CloudifyService.blueprints, 'browse').andCallFake(function () {
            return {
                then: function ( success ) {
                    success({});
                }
            };
        });

        spyOn(BlueprintSourceService, 'getBrowseData').andCallFake(function () {
            return {
                then: function ( success ) {
                    success({});
                }
            };
        });

        SourceCtrl = $controller('SourceCtrl', {
            $scope: scope,
            $routeParams: { 'blueprintId' : 'fake_blueprint_id' }
        });
    }));

    describe('init', function () {
        it('should create a controller', function () {
            expect(SourceCtrl).not.toBeUndefined();
        });

        it('should get a specific blueprint by its id', inject(function (cloudifyClient) {
            expect(scope.blueprintId).toBe('fake_blueprint_id');

            spyOn(scope, 'setData');
            spyOn(cloudifyClient.blueprints, 'get').andReturn({
                then: function (success) {
                    success({data: 'foo'});
                }
            });
            scope.$digest(); // $watch blueprintId

            expect(cloudifyClient.blueprints.get).toHaveBeenCalled();
            expect(scope.setData).toHaveBeenCalledWith('foo');

        }));

        it('should get the blueprint if deploymentId is specified', inject(function ($controller, cloudifyClient) {
            spyOn(cloudifyClient.deployments, 'get').andReturn({
                then: function (success) {
                    success({data: {'blueprint_id': 'new_blueprint_id'}});
                }
            });
            SourceCtrl = $controller('SourceCtrl', {
                $scope: scope,
                $routeParams: {'deploymentId': 'fake_deployment_id'}
            });
            expect(cloudifyClient.deployments.get).toHaveBeenCalledWith('fake_deployment_id', 'blueprint_id');
            expect(scope.blueprintId).toBe('new_blueprint_id');
        }));
    });



    describe('#isDefaultCandidate', function(){
        it('should identify potential files to auto open', function(){
            expect(scope.isDefaultCandidate('guy')).toBe(false);
            expect(scope.isDefaultCandidate('README')).toBe(true);
            expect(scope.isDefaultCandidate('README.md')).toBe(true);
            expect(scope.isDefaultCandidate('singlehost-blueprint.yaml')).toBe(true);
        });
    });

    describe('#getBrushByFile', function(){
        it('should get brushes by file and text as default', function(){
            expect(scope.getBrushByFile('README.md')).toBe('text');
            expect(scope.getBrushByFile('README.py')).toBe('py');
            expect(scope.getBrushByFile('foo')).toBe('text');
            expect(scope.getBrushByFile('foo.bat')).toBe('bat');
            expect(scope.getBrushByFile('foo.yaml')).toBe('yml');
            expect(scope.getBrushByFile('foo.yml')).toBe('yml');
        }) ;
    });

    describe('#isSourceText', function(){
        it('should return true if file is a source file', function(){
            expect(scope.isSourceText('foo.foo')).toBe(false);
            expect(scope.isSourceText('file.yaml')).toBe(true);
            expect(scope.isSourceText('file.css')).toBe(true);
            expect(scope.isSourceText('file.sh')).toBe(true);
            expect(scope.isSourceText('file.txt')).toBe(true);
            expect(scope.isSourceText('LICENSE')).toBe(true);
            expect(scope.isSourceText(null)).toBe(undefined);
        });
    });

    describe('#openSourceFile', function () {
        beforeEach(inject(function (CloudifyService) {
            spyOn(CloudifyService.blueprints, 'browseFile').andCallFake(function (browseData) {
                return {
                    then: function (success) { // todo: handle errors.
                        if (browseData.id === 'success') {
                            success({ data : 'this is content' } );
                        }
                    }
                };
            });
        }));
        it('should populate dataCode with file content', function () {
            scope.selectedBlueprint = { 'id' : 'success' };
            scope.openSourceFile({'id': 'success', 'name': 'foo.yaml', 'path': 'bar'});

            expect(scope.filename).toBe('foo.yaml');
            expect(scope.dataCode.data).toBe('this is content');
            expect(scope.dataCode.brush).toBe('yml');
            expect(scope.dataCode.path).toBe('bar');
        });


    });

    describe('#autoSelectFile', function( ){
        it('should identify file in blueprint to open automatically', function(){
            var result = scope.autoSelectFile(nodecellarSources);
            expect( result.name ).toBe( 'README.md' );

            result = scope.autoSelectFile({});
            expect( result ).toBe( undefined );
        });
    });



    it('should return fa-minus-square-o string', function () {
        var result = scope.isFolderOpen({show: true});

        expect(result).toBe('fa-minus-square-o');
    });

    it('should return fa-plus-square-o string', function () {
        var result = scope.isFolderOpen({});

        expect(result).toBe('fa-plus-square-o');
    });

    it('should return folder string', function () {
        var result = scope.setBrowseType({children: []});

        expect(result).toBe('folder');
    });

    it('should return true value when filename matches current filename value on scope', function () {
        scope.filename = 'myFile';
        var result = scope.isSelected('myFile');

        expect(result).toBeTruthy();
    });

    it('should return file-jpeg string', function () {
        var result = scope.setBrowseType({encoding: 'jpeg'});

        expect(result).toBe('file-jpeg');
    });

});
