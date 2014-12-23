'use strict';

describe('Service: VersionService', function () {
    var versionService, httpBackend;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // load the filter's module
            module('cosmoUiApp', 'ngMock');

            // initialize a new instance of the filter
            inject(function (VersionService, $httpBackend) {
                httpBackend = $httpBackend;
                httpBackend.whenGET('/backend/configuration?access=all').respond(200);
                httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

                versionService = VersionService;
            });
        });
    });

    describe('Unit tests', function() {

        it('should create a new VersionService instance', function() {
            expect(versionService).not.toBeUndefined();
        });

        it('should call backend for ui version', function() {
            var url = '/backend/versions/ui';

            httpBackend.whenGET('/backend/versions/manager').respond(200);
            httpBackend.whenGET(url).respond(200, '310');
            httpBackend.expectGET(url);

            versionService.getUiVersion();

            httpBackend.flush();
        });

        it('should call backend for manager version', function() {
            var url = '/backend/versions/manager';
            httpBackend.whenGET('/backend/versions/ui').respond(200);
            httpBackend.whenGET(url).respond(200, '310');
            httpBackend.expectGET(url);

            versionService.getManagerVersion();

            httpBackend.flush();

        });

        it('should call backend for latest version', function() {
            var url = '/backend/version/latest';
            var ver = '320';
            httpBackend.whenGET('/backend/versions/ui').respond(200);
            httpBackend.whenGET('/backend/versions/manager').respond(200);
            httpBackend.whenGET(url + '?version=' + ver).respond(200, '310');
            httpBackend.expectGET(url + '?version=' + ver);

            versionService.getLatest(ver);

            httpBackend.flush();
        });

    });
});