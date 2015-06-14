'use strict';

describe('Controller: LogsCtrl', function () {
    var LogsCtrl, scope;
    var anchorScroll = null;

    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock', 'backend-mock'));



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
        anchorScroll = jasmine.createSpy();
        LogsCtrl = $controller('LogsCtrl', {
            $scope: scope,
            $anchorScroll : anchorScroll,
            EventsService: mockEventsService(),
            CloudifyService: mockCloudifyService( $q, CloudifyService)
        });
    });

    function setup() {
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            initializeController( );
        });
    }

    function flush(){
        inject(function($httpBackend, $timeout){
            try {
                $httpBackend.flush();
            }catch(e){}
            try{
                $timeout.flush();
            }catch(e){}
        });
    }

    beforeEach(setup);

    describe('Controller tests', function() {

        it('should create a controller', function () {
            expect(LogsCtrl).not.toBeUndefined();
        });

        it('should select all blueprints and show their events from the last 5 minutes on first page entry', function() {
            expect(JSON.stringify(scope.eventsFilter.blueprints)).toBe(JSON.stringify(scope.blueprintsList));
        });

        it('should set isSearchDisabled flag to true if no blueprints were selected', function() {
            flush();
            scope.isSearchDisabled = false;
            scope.eventsFilter.blueprints = [];
            scope.$apply();
            expect(scope.isSearchDisabled).toBe(true);
        });

        it('should set isSearchDisabled flag to false if blueprints were selected', function(  ) {
            flush();
            scope.isSearchDisabled = true;
            scope.eventsFilter.blueprints = [{
                name: 'blueprint1'
            }];
            scope.$apply();
            expect(scope.isSearchDisabled).toBe(false);
        });
    });

    describe('closeErrorDialog', function(){
        it('should update variables on scope', function(){
            scope.isDialogVisible = 'foo';
            scope.errorMsg = 'bar';
            scope.closeErrorDialog();
            expect(scope.isDialogVisible).toBe(false);
            expect(scope.errorMsg).toBe(null);
        });
    });

    describe('scrollToTop', function(){
        it('should call anchorScroll', function(){
            scope.scrollToTop();
            expect(anchorScroll).toHaveBeenCalled();
        });
    });

    describe('execute', function(){
        it('should execute logs if search is disabled', function(){
            scope.filterLoading = false;
            scope.execute();
            expect(scope.filterLoading).toBe(false); // logs was not called

            scope.isSearchDisabled = false;
            scope.execute();
            expect(scope.filterLoading).toBe(true); // logs was not called
        });
    });

    describe('logs controller', function () {
        describe('#first load', function () {
            it('should not execute logs if no deployments were selected in filter', function () {
                scope.eventsFilter.deployments = [];
                spyOn(scope.events, 'execute').andCallThrough();

                expect(scope.events.execute).not.toHaveBeenCalled();
            });

            it('should execute logs if deployments were selected in filter', function () {
                scope.eventsFilter.deployments = [
                    {
                        name: 'deployment1'
                    }
                ];
                spyOn(scope.events, 'execute').andCallThrough();
                flush();
                scope.$apply();
                expect(scope.events.execute).toHaveBeenCalled();
            });
        });
    });


});
