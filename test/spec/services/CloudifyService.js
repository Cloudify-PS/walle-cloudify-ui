'use strict';

describe('Service: CloudifyService', function () {

    var CloudifyService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of CloudifyService
            inject(function (_CloudifyService_, $helper) {
                $helper.addInjects([
                    {
                        method: 'POST',
                        url: '/backend/node/get',
                        respond: 200
                    }
                ]);
                CloudifyService = _CloudifyService_;
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new CloudifyService instance', function() {
            expect(CloudifyService).not.toBeUndefined();
        });

        it('should have autoPull method', function(){
            expect(CloudifyService.autoPull).not.toBeUndefined();
        });

        beforeEach(function(){
            spyOn(CloudifyService, 'autoPull');
            CloudifyService.autoPull('getNode', {}, CloudifyService.getNode);
        });

        it("tracks that the spy was called autoPull", function() {
            expect(CloudifyService.autoPull).toHaveBeenCalled();
        });

        it("tracks its number of autoPull calls", function() {
            expect(CloudifyService.autoPull.calls.length).toEqual(1);
        });

    });


});
