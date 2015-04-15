'use strict';

describe('Service: NodeSearchService', function () {

    var mNodeSearchService,
        nodeSearchData,
        nodeSearchDataSec;

    beforeEach(module('cosmoUiApp', 'backend-mock'));

    // Initialize a new instance of mNodeSearchService
    beforeEach(inject(function (NodeSearchService, CloudifyService, $q) {

        mNodeSearchService = NodeSearchService;

        CloudifyService.blueprints.list = function () {
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
        };
    }));

    describe('Unit tests', function() {

        it('should create a new mNodeSearchService instance', function() {
            expect(mNodeSearchService).not.toBeUndefined();
        });

        beforeEach(function(){
            mNodeSearchService.getNodeSearchData()
                .then(function(data){
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
