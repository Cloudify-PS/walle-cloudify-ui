'use strict';

describe('Service: VersionService', function () {
    var versionService;

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));
    beforeEach(inject(function (VersionService) {
        versionService = VersionService;
    }));


    it('should create a new VersionService instance', function () {
        expect(versionService).not.toBeUndefined();
    });

    describe('#getLatest', function(){
        it('should call backend for latest version only once', inject(function ($httpBackend) {
            $httpBackend.expectGET('/backend/version/latest?version=foo');
            versionService.getLatest('foo');
            versionService.getLatest('foo'); // don't fail
            versionService.getLatest('foo');
        }));
    });

    describe('#getUiVersion', function(){
        it('should call backend for ui version', inject(function ($http) {
            spyOn($http,'get');
            versionService.getUiVersion();
            expect($http.get).toHaveBeenCalledWith('/backend/versions/ui');

        }));

    });

    describe('#getManagerVersion', function(){
        it('should call backend for manager version', inject(function (cloudifyClient) {
            spyOn(cloudifyClient.manager,'get_version');
            versionService.getManagerVersion();
            expect(cloudifyClient.manager.get_version).toHaveBeenCalled();
        }));
    });

    describe('#needUpdate', function(){

        var resolution = null;
        var uiVersion = null;
        var latestVersion = null;

        beforeEach(inject(function ($q) {
            resolution = null;
            uiVersion = { data :  null } ;
            latestVersion = { data :  null  };
            spyOn($q, 'defer').and.returnValue({
                promise: 'foo',
                resolve: function (res) {
                    resolution = res;
                }
            });
            spyOn(versionService,'getUiVersion').and.returnValue({
                then:function( success ){
                    console.log('return uiVersion', uiVersion );
                    success( uiVersion );
                }
            });
            spyOn(versionService,'getLatest').and.returnValue({
                then:function(success){
                    success( latestVersion );
                }
            });
        }));

        describe('with corrupt data', function(){
            it('should return false if ui version is corrupt', function () {
                uiVersion.data = { version : 'foo' };
                versionService.needUpdate();
                expect(resolution).toBe(false);
            });

            it('should return false if ui version is missing completely', function(){
                versionService.needUpdate();
                expect(resolution).toBe(false);
            });

        });

        describe('proper data', function(){
            it('should return false if ui version >= latest', function(){
                uiVersion.data = { version : '6' };
                latestVersion.data = '5' ;
                versionService.needUpdate();
                expect(resolution).toBe(false);
            });

            it('should return true if ui version< latest', function(){
                uiVersion.data = { version : '6' };
                latestVersion.data =  '8' ;
                versionService.needUpdate();
                expect(resolution).toBe(true);
            });
        });
    });

    describe('#getVersions', function(){

    });









});
