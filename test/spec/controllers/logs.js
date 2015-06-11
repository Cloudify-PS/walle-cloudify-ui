'use strict';

describe('Controller: LogsCtrl', function () {
    var LogsCtrl, scope;

    beforeEach(module('cosmoUiApp', 'ngMock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));


    function mockBackend( $httpBackend ){
        $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
        $httpBackend.whenGET('/backend/versions/ui').respond(200);
        $httpBackend.whenGET('/backend/versions/manager').respond(200);
        $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');
        $httpBackend.whenGET('/backend/blueprints').respond(200);
    }

    function mockEventsService (){
        return {
            newInstance: function() {
                return {
                    filterRange: function() {},
                    filterRemove: function() {},
                    getExecuteLastFiftyOptions: function() {},
                    filter: function() {},
                    execute: function() {}
                };
            }
        };
    }

    function mockCloudifyService( $q, CloudifyService ){

        CloudifyService.getConfiguration = function () {
            var deferred = $q.defer();

            deferred.resolve({});

            return deferred.promise;
        };

        CloudifyService.blueprints.list = function() {
            var deferred = $q.defer();
            var blueprints = [
                {
                    'id': 'blueprint1',
                    'deployments': [
                        {
                            'blueprint_id': 'blueprint1',
                            'id': 'firstDep'
                        },
                        {
                            'blueprint_id': 'blueprint1',
                            'id': 'secondDep'
                        }
                    ]
                },
                {
                    'id': 'blueprint2',
                    'deployments': [
                        {
                            'blueprint_id': 'blueprint2',
                            'id': 'onlyOneDeployment'
                        }
                    ]
                }
            ];
            deferred.resolve(blueprints);
            return deferred.promise;
        };

        CloudifyService.deployments.getDeploymentExecutions = function() {
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        };

        return CloudifyService;
    }

    var initializeController = inject(function( $controller, $q, CloudifyService ){
        LogsCtrl = $controller('LogsCtrl', {
            $scope: scope,
            EventsService: mockEventsService(),
            CloudifyService: mockCloudifyService( $q, CloudifyService)
        });
    });

    function setup() {
        inject(function ($controller, $rootScope, $httpBackend) {
            mockBackend($httpBackend);
            scope = $rootScope.$new();
            initializeController( );
        });
    }

//    function flush(){
//        inject(function($httpBackend, $timeout){
//            try {
//                $httpBackend.flush();
//            }catch(e){}
//            try{
//                $timeout.flush();
//            }catch(e){}
//        });
//    }

    beforeEach(setup);

    describe('Controller tests', function() {

        it('should create a controller', function () {
            expect(LogsCtrl).not.toBeUndefined();
        });

//        it('should select all blueprints and show their events from the last 5 minutes on first page entry', inject(function( $httpBackend ) {
//            $httpBackend.flush();
//            expect(JSON.stringify(scope.eventsFilter.blueprints)).toBe(JSON.stringify(scope.blueprintsList));
//        }));

        it('should set isSearchDisabled flag to true if no blueprints were selected', function() {
//            flush();
//            scope.isSearchDisabled = false;
//            scope.eventsFilter.blueprints = [];
//            scope.$apply();
//            expect(scope.isSearchDisabled).toBe(true);
        });

        it('should set isSearchDisabled flag to false if blueprints were selected', function(  ) {
//            flush();
//            scope.isSearchDisabled = true;
//            scope.eventsFilter.blueprints = [{
//                name: 'blueprint1'
//            }];
//            scope.$apply();
//            expect(scope.isSearchDisabled).toBe(false);
        });
    });

    describe('logs controller', function () {
        describe('#first load', function () {
//            it('should not execute logs if no deployments were selected in filter', inject(function ($httpBackend) {
//                scope.eventsFilter.deployments = [];
//                spyOn(scope.events, 'execute').andCallThrough();
//
//
//                $httpBackend.flush();
//
//
//                expect(scope.events.execute).not.toHaveBeenCalled();
//            }));

//            it('should execute logs if deployments were selected in filter', inject(function ($httpBackend) {
//                scope.eventsFilter.deployments = [
//                    {
//                        name: 'deployment1'
//                    }
//                ];
//                spyOn(scope.events, 'execute').andCallThrough();
//                $httpBackend.flush();
//                expect(scope.events.execute).toHaveBeenCalled();
//            }));
        });
    });


});
