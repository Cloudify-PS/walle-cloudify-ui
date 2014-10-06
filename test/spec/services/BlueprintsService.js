'use strict';

describe('Service: BlueprintsService', function () {

    var helper = new Helper();
    var BlueprintsService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp');

            // inject UI
            helper.injectUi();

            // Initialize a new instance of BlueprintsService
            inject(function (_BlueprintsService_) {
                BlueprintsService = _BlueprintsService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new BlueprintsService instance', function() {
            expect(BlueprintsService).not.toBeUndefined();
        });

        it('should have list method', function(){
            expect(BlueprintsService.list).not.toBeUndefined();
        });

        beforeEach(function(){
            spyOn(BlueprintsService, 'list');
            BlueprintsService.list();
        });

        it("tracks that the spy was called list", function() {
            expect(BlueprintsService.list).toHaveBeenCalled();
        });

        it("tracks its number of list calls", function() {
            expect(BlueprintsService.list.calls.length).toEqual(1);
        });

    });

});
