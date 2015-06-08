'use strict';

describe('Service: SourceService', function() {
    var sourceService, cloudifyService, blueprintSourceService, deploymentSourceService, viewContext;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper', function ($translateProvider) {
                $translateProvider.translations('en', {});
            });

            // Initialize a new instance of BlueprintSourceService
            inject(function ($httpBackend, SourceService, CloudifyService, BlueprintSourceService, DeploymentSourceService, VIEW_CONTEXT) {
                $httpBackend.whenGET('/backend/blueprints/get?id=blueprint1').respond(200);
                $httpBackend.whenGET('/backend/deployments/get?deployment_id=blueprint1').respond(200);
                $httpBackend.whenGET('/backend/blueprints/browse?id=blueprint1&last_update=123').respond(200);

                sourceService = SourceService;
                blueprintSourceService = BlueprintSourceService;
                deploymentSourceService = DeploymentSourceService;
                cloudifyService = CloudifyService;
                viewContext = VIEW_CONTEXT;
            });
        });

        describe('Unit tests', function() {
            it('should create a new SourceService instance', function() {
                expect(sourceService).not.toBeUndefined();
            });

            it('should call DeploymentSourceService get method if context is deployment', function() {
                spyOn(deploymentSourceService, 'get').andCallThrough();

                sourceService.get('blueprint1', viewContext.DEPLOYMENT);

                expect(deploymentSourceService.get).toHaveBeenCalledWith('blueprint1');
            });

            it('should call BlueprintSourceService get method if context is blueprint', function() {
                spyOn(blueprintSourceService, 'get').andCallThrough();

                sourceService.get('blueprint1', viewContext.BLUEPRINT);

                expect(blueprintSourceService.get).toHaveBeenCalledWith('blueprint1');
            });

            it('should call BlueprintSourceService getBrowseData method', function() {
                spyOn(blueprintSourceService, 'getBrowseData').andCallThrough();

                sourceService.getBrowseData('blueprint1', 123);

                expect(blueprintSourceService.getBrowseData).toHaveBeenCalledWith('blueprint1', 123);
            });
        });
    });
});
