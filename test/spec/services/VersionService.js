'use strict';

describe('Service: VersionService', function () {
    var versionService;
    var latestUrl = '/backend/version/latest';
    var managerUrl = '/backend/versions/manager';
    var uiUrl = '/backend/versions/ui';
    var ver = '310';

    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));
    beforeEach(function() {
        // load the filter's module


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
            $httpBackend.expectGET(uiUrl).respond(200, {version: 310});

            versionService.getUiVersion();
        }));

        it('should call backend for manager version', inject(function($httpBackend) {
            $httpBackend.expectGET(managerUrl).respond(200, {version: 310});

            versionService.getManagerVersion();
        }));

        it('should call backend for latest version', inject(function($httpBackend) {
            $httpBackend.expectGET(latestUrl + '?version=' + ver).respond(200, '310');

            versionService.getLatest(ver);
        }));


        it('should invoke only once when multiple calls for latest version are made', inject(function($httpBackend) {
            $httpBackend.expectGET(latestUrl + '?version=' + ver).respond(200, '321');
            var result;

            versionService.getLatest(ver);
            versionService.getLatest(ver).then(function(latest) {
                result = latest.data;
            });

            waitsFor(function() {
                return result !== undefined;
            });
            runs(function() {
                expect(result).toBe('321');
            });

            $httpBackend.flush();
        }));

        it('should return false if latest version returns invalid', inject(function($httpBackend) {
            $httpBackend.whenGET(uiUrl).respond(200, {version: 310});
            $httpBackend.whenGET(latestUrl + '?version=' + ver).respond(200, 'aaa');
            var result;

            versionService.needUpdate().then(function(needUpdate) {
                result = needUpdate;
            });

            waitsFor(function() {
                return result !== undefined;
            });
            runs(function() {
                expect(result).toBe(false);
            });

            $httpBackend.flush();
        }));

        it('should return false if UI requires an update', inject(function($httpBackend) {
            $httpBackend.whenGET(uiUrl).respond(200, {version: 310});
            $httpBackend.whenGET(latestUrl + '?version=' + ver).respond(200, '310');
            var result;

            versionService.needUpdate().then(function(needUpdate) {
                result = needUpdate;
            });

            waitsFor(function() {
                return result !== undefined;
            });
            runs(function() {
                expect(result).toBe(false);
            });

            $httpBackend.flush();
        }));

        it('should return true if UI requires an update', inject(function($httpBackend) {
            $httpBackend.whenGET(uiUrl).respond(200, {version: 310});
            $httpBackend.whenGET(latestUrl + '?version=' + ver).respond(200, '320');
            var result;

            versionService.needUpdate().then(function(needUpdate) {
                result = needUpdate;
            });

            waitsFor(function() {
                return result !== undefined;
            });
            runs(function() {
                expect(result).toBe(true);
            });

            $httpBackend.flush();
        }));

        it('should return an object holding the ui & manager current versions', inject(function($httpBackend) {
            $httpBackend.whenGET(uiUrl).respond(200, {version: 310});
            $httpBackend.whenGET(managerUrl).respond(200, {version: 320});
            var result;

            versionService.getVersions().then(function(versions) {
                result = versions;
            });

            waitsFor(function() {
                return result !== undefined;
            });
            runs(function() {
                expect(result.ui).toBe(310);
                expect(result.manager).toBe(320);
            });

            $httpBackend.flush();
        }));

        it('should return cached latest version from second call', inject(function($httpBackend) {
            $httpBackend.expectGET(latestUrl + '?version=' + ver).respond(200, '320');
            var result1;
            var result2;

            versionService.getLatest(ver).then(function(latest1) {
                result1 =  latest1.data;
                versionService.getLatest(ver).then(function(latest2) {
                    result2 = latest2.data;
                });
            });


            waitsFor(function() {
                return result2 !== undefined;
            });
            runs(function() {
                expect(result2).toEqual(result1);
            });

            $httpBackend.flush();
        }));

    });
});
