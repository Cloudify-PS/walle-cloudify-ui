'use strict';

describe('Service: EventsService', function () {

    var eventsService, q;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // load the service's module, mocking ejsResource dependency
            module('cosmoUiApp', 'ngMock', function($provide) {
                $provide.value('ejsResource', function() {
                    return {
                        QueryStringQuery: function() {
                            return {
                                query: function() {}
                            }
                        },
                        Request: function() {
                            return {
                                from: function() {
                                    return {
                                        size: function() {
                                            return {
                                                query: function() {
                                                    return {
                                                        sort: function() {
                                                            return {
                                                                doSearch: function() {
                                                                    var deferred = q.defer();

                                                                    deferred.resolve({});

                                                                    return deferred.promise;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        Sort: function() {
                            return {
                                order: function() {}
                            }
                        }
                    }
                });
            });

            // initialize a new instance of the filter
            inject(function (EventsService, $httpBackend, $q) {
                $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
                $httpBackend.whenGET("/backend/versions/ui").respond(200);
                $httpBackend.whenGET("/backend/versions/manager").respond(200);
                $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

                q = $q;
                eventsService = EventsService;
            });
        });
    });

    describe('Unit tests', function() {
        it('should create a new EventsService instance', function() {
                expect(!!eventsService).toBe(true);
        });

        it('should set predefined autopull timer if no time defined by controller', function() {
            var _callback = function() {};
            var events = eventsService.newInstance('/');

            spyOn(events, 'autoPull').andCallThrough();
            events.execute(_callback, true);

            expect(events.autoPull).toHaveBeenCalledWith(_callback, 3000);
        });

        it('should use defined autopull time provided by controller', function() {
            var _callback = function() {};
            var events = eventsService.newInstance('/');

            spyOn(events, 'autoPull').andCallThrough();
            events.execute(_callback, true, 1000);

            expect(events.autoPull).toHaveBeenCalledWith(_callback, 1000);
        });
    });
});
