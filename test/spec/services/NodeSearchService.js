'use strict';

describe('Service: NodeSearchService', function () {

    var NodeSearchService,
        nodeSearchData,
        nodeSearchDataSec,
        executeData = [];

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of NodeSearchService
            inject(function (_NodeSearchService_, $helper, CloudifyService, $q) {
                $helper.addInjects([
                    {
                        url: '/backend/blueprints',
                        respond: 200
                    }
                ]);

                NodeSearchService = _NodeSearchService_;

                CloudifyService.blueprints.list = function() {
                    var deferred = $q.defer();
                    var resolve = [
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
                    ];
                    deferred.resolve(resolve);
                    return deferred.promise;
                }
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new NodeSearchService instance', function() {
            expect(NodeSearchService).not.toBeUndefined();
        });

        beforeEach(function(){
            NodeSearchService.getNodeSearchData()
                .then(function(data){
                    nodeSearchData = data;
                });
        });

        it('should have node search data with blueprints and deployment', function(){
            waitsFor(function(){
                return typeof(nodeSearchData) === 'object';
            }, 'nodes search data to complete on the first time', 5000);

            runs(function(){
                expect(nodeSearchData.blueprints.length).toBe(2);
                expect(nodeSearchData.deployments).not.toBeUndefined();
            });
        });

        afterEach(function(){
            NodeSearchService.getNodeSearchData()
                .then(function(data){
                    nodeSearchDataSec = data;
                });
        });

        describe('Test duplicate data', function(){
            it('should not have duplicate blueprints', function(){
                waitsFor(function(){
                    return typeof(nodeSearchDataSec) === 'object';
                }, 'nodes search data to complete on the second time', 5000);

                runs(function(){
                    expect(nodeSearchDataSec.blueprints.length).toBe(2);
                });
            });
        });

    });

});
