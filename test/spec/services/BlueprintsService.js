'use strict';

describe('Service: BlueprintsService', function () {

    var mBlueprintsService;

    // Load the app module
    beforeEach(module('cosmoUiApp', 'backend-mock', function ($translateProvider) {
        $translateProvider.translations('en', {});
    }));
    beforeEach(
        inject(function (BlueprintsService, RestLoader) {
            mBlueprintsService = BlueprintsService;
            spyOn(RestLoader,'load');
        }));




    describe('deploy', function(){
        it('should call deploy create', inject(function( RestLoader ){
            mBlueprintsService.deploy( {} );
            expect(RestLoader.load).toHaveBeenCalled();
        }));
    });

    describe('delete', function(){
        it('should call delete', inject(function( RestLoader){
            mBlueprintsService.delete({});
            expect(RestLoader.load).toHaveBeenCalled();
        }));
    });

    describe('browse file', function(){
        it('should call browse file', inject(function( RestLoader ){
            mBlueprintsService.browseFile({});
            expect(RestLoader.load).toHaveBeenCalled();
        }));
    });

    describe('list', function(){
        it('should return promise with all blueprints and their deployments', inject(function( RestLoader ){
            var result = [{},{}];
            RestLoader.load.andCallFake(function(){
                return { then : function(success){ success( result ); }};
            });
            mBlueprintsService.list();
            expect(!!result[0].deployments).toBe(true);

        }));
    });

    describe('getBlueprintById', function(){
        it('should get blueprint by id', inject(function( RestLoader ){
            mBlueprintsService.getBlueprintById({});
            expect(RestLoader.load).toHaveBeenCalled();
        }));
    });

    describe('browse', function(){
        it('should call browse', inject(function( RestLoader ){
            mBlueprintsService.browse({});
            expect(RestLoader.load).toHaveBeenCalled();
        }));
    });

    describe('Unit tests', function() {

        it('should create a new BlueprintsService instance', function() {
            expect(mBlueprintsService).not.toBeUndefined();
        });

        it('should have list method', function(){
            expect(mBlueprintsService.list).not.toBeUndefined();
        });

        beforeEach(function(){
            spyOn(mBlueprintsService, 'list');
            mBlueprintsService.list();
        });

        it('tracks that the spy was called list', function() {
            expect(mBlueprintsService.list).toHaveBeenCalled();
        });

        it('tracks its number of list calls', function() {
            expect(mBlueprintsService.list.calls.length).toEqual(1);
        });

    });

});
