'use strict';

describe('Service: DeploymentsService', function () {

    var DeploymentsService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of DeploymentsService
            inject(function (_DeploymentsService_) {
                DeploymentsService = _DeploymentsService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new DeploymentsService instance', function() {
            expect(DeploymentsService).not.toBeUndefined();
        });

        it('should have execute method', function(){
            expect(DeploymentsService.execute).not.toBeUndefined();
        });

        beforeEach(function(){
            spyOn(DeploymentsService, 'execute');
            DeploymentsService.execute();
        });

        it("tracks that the spy was called execute", function() {
            expect(DeploymentsService.execute).toHaveBeenCalled();
        });

        it("tracks its number of execute calls", function() {
            expect(DeploymentsService.execute.calls.length).toEqual(1);
        });

    });

});
