'use strict';

describe('Service: VersionService', function () {
    var versionService;
    var latestUrl = '/backend/version/latest';
    var managerUrl = '/backend/versions/manager';
    var uiUrl = '/backend/versions/ui';
    var ver = '320';

    beforeEach(function() {
        // load the filter's module
        module('cosmoUiApp', 'ngMock');

        // initialize a new instance of the filter
        inject(function (VersionService, $httpBackend) {
            $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
            $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

            versionService = VersionService;
        });
    });

    describe('Unit tests', function() {

        it('should create a new VersionService instance', function() {
            expect(versionService).not.toBeUndefined();
        });

        it('should call backend for ui version', inject(function($httpBackend) {
            $httpBackend.expectGET(uiUrl).respond(200, '310');

            versionService.getUiVersion();
        }));

        it('should call backend for manager version', inject(function($httpBackend) {
            $httpBackend.expectGET(managerUrl).respond(200, '310');

            versionService.getManagerVersion();
        }));

        it('should call backend for latest version', inject(function($httpBackend) {
            $httpBackend.expectGET(latestUrl + '?version=' + ver).respond(200, '310');

            versionService.getLatest(ver);
        }));


        xit('should invoke only once when multiple calls for latest version are made', inject(function($httpBackend) {
            $httpBackend.expectGET(latestUrl + '?version=' + ver).respond(200, '321');
            var result;

            versionService.getLatest(ver);
            versionService.getLatest(ver).then(function(latest) {
                console.log(latest);
                result = latest;
            });

            waitsFor(function() {
                return result !== undefined;
            });
            runs(function() {
                expect(result).toBe('321');
            });

            $httpBackend.flush();
        }));

    });
});