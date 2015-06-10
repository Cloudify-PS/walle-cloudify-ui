'use strict';

describe('Service: NodeSearchService', function () {

    var mNodeSearchService,
        nodeSearchData,
        nodeSearchDataSec;

    beforeEach(module('cosmoUiApp', 'backend-mock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));


    // Initialize a new instance of mNodeSearchService
    beforeEach(inject(function (NodeSearchService, CloudifyService) {

        spyOn(CloudifyService,'getNodes').andCallFake(function(){
            return { then:function(success){ success([{ 'id' : 'bar' , runtime_properties : {}, 'type_hierarchy' : ['foo']}]); }};
        });


        mNodeSearchService = NodeSearchService;

        spyOn(CloudifyService.blueprints,'list').andCallFake(function () {
            return { then:function(success){
                var result = success([
                    {
                        'id': 'nodecellar',
                        'deployments': [
                            {
                                'blueprint_id': 'nodecellar',
                                'id': 'nodecellarDep'
                            }
                        ]
                    },
                    {
                        'id': 'monitoring',
                        'deployments': [
                            {
                                'blueprint_id': 'monitoring',
                                'id': 'monitoringDep'
                            }
                        ]
                    }
                ]);

                return { then : function(success){ return success(result);} };
            }};

        });

        // guy - don't know why but spyOn does not work on this specific method in this specific test
        CloudifyService.deployments.getDeploymentNodes = jasmine.createSpy().andCallFake(function(){
            return { then : function(success){ success([ { 'id' : 'foo', 'node_id' : 'bar', 'runtime_properties' : {}, 'type_hierarchy' : ['foo'] }]); } };
        });

    }));



    describe('Unit tests', function() {

        it('should create a new mNodeSearchService instance', function() {
            expect(mNodeSearchService).not.toBeUndefined();
        });

        beforeEach(function(){
            mNodeSearchService.getNodeSearchData().then(function (data){
                    nodeSearchData = data;
                });
        });

        it('should have node search data with blueprints and deployment', function(){
            waitsFor(function(){
                return typeof(nodeSearchData) === 'object';
            }, 'nodes search data to complete on the first time', 10000);

            runs(function(){
                expect(nodeSearchData.blueprints.length).toBe(2);
                expect(nodeSearchData.deployments).not.toBeUndefined();
            });
        });

        afterEach(function(){
            mNodeSearchService.getNodeSearchData()
                .then(function(data){
                    nodeSearchDataSec = data;
                });
        });

        // todo : if the code was more test friendly, we wouldn't need async testing here..
        describe('execute', function(){
            it('should get node instances by type', function(  ){
                var result = null;
                mNodeSearchService.execute('foo', 'bar', [ { id :'bar'} ]).then(function( instances ){
                    result = instances;
                });
                waitsFor(function(){
                    return result !== null;
                });

                runs(function(){
                    expect(result.length).toBe(1);
                });

            });
        });

        describe('Test duplicate data', function(){
            it('should not have duplicate blueprints', function(){
                waitsFor(function(){
                    return typeof(nodeSearchDataSec) === 'object';
                }, 'nodes search data to complete on the second time', 10000);

                runs(function(){
                    expect(nodeSearchDataSec.blueprints.length).toBe(2);
                });
            });
        });
    });

});
