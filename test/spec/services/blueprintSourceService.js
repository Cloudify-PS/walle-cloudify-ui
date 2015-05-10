'use strict';

describe('Service: BlueprintSourceService', function() {
    var blueprintSourceService, cloudifyService;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of BlueprintSourceService
            inject(function ($httpBackend, BlueprintSourceService, CloudifyService) {
                $httpBackend.whenGET('/backend/blueprints/get?id=blueprint1').respond(200);
                $httpBackend.whenGET('/backend/blueprints/browse?id=blueprint1&last_update=123').respond(200);

                blueprintSourceService = BlueprintSourceService;
                cloudifyService = CloudifyService;
            });
        });
    });

    describe('Unit tests', function() {

        it('should create a new BlueprintSourceService instance', function() {
            expect(blueprintSourceService).not.toBeUndefined();
        });

        it('should return a blueprint', function() {
            spyOn(cloudifyService.blueprints, 'getBlueprintById').andCallThrough();

            blueprintSourceService.get('blueprint1');

            expect(cloudifyService.blueprints.getBlueprintById).toHaveBeenCalledWith({id: 'blueprint1'});
        });

        it('should return a browse data', function() {
            spyOn(cloudifyService.blueprints, 'browse').andCallThrough();

            blueprintSourceService.getBrowseData('blueprint1', 123);

            expect(cloudifyService.blueprints.browse).toHaveBeenCalledWith({id: 'blueprint1', last_update: 123});
        });

    });
});