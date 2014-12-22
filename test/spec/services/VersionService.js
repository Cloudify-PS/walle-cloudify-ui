'use strict';

describe('Service: VersionService', function () {
    var versionService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // load the filter's module
            module('cosmoUiApp', 'ngMock', 'gsUiHelper');

            // initialize a new instance of the filter
            inject(function (VersionService) {
                versionService = VersionService;
            });
        });
    });

    describe('Unit tests', function() {
        it('should create a new VersionService instance', function() {
            expect(versionService).not.toBeUndefined();
        });

        xit('should call backend for ui version', inject(function($http) {
            spyOn($http, 'get').andCallThrough();

            versionService.getUiVersion();

            expect($http.get).toHaveBeenCalled();
        }));

        xit('should call backend for manager version', inject(function($http) {
            spyOn($http, 'get').andCallThrough();

            versionService.getManagerVersion();

            expect($http.get).toHaveBeenCalled();
        }));
    });
});