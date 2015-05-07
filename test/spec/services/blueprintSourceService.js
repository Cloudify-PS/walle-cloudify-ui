'use strict';

describe('Service: BlueprintSourceService', function() {
    var blueprintSourceService;

    var _blueprint = {
        created_at: 1429617893844,
        id: 'blueprint1',
        plan: {},
        updated_at: 1429617893844
    };

//    var _browseData = {
//        'name': 'root',
//        'children': [{
//            'name': 'cloudify-hello-world-example',
//            'children': [{
//                'name': 'images',
//                'children': [{
//                    'name': 'cloudify-logo.png',
//                    'relativePath': '/images/cloudify-logo.png',
//                    'path': '/images/cloudify-logo.png',
//                    'encoding': 'BINARY'
//                }]
//            }]
//        }]
//    };

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of BlueprintSourceService
            inject(function ($q, BlueprintSourceService, CloudifyService) {
                blueprintSourceService = BlueprintSourceService;

                CloudifyService.blueprints.getBlueprintById = function() {
                    return _blueprint;
                };
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new BlueprintSourceService instance', function() {
            expect(blueprintSourceService).not.toBeUndefined();
        });

//        it('should return a blueprint', function() {
//            var result = {};
//            blueprintSourceService.get('blueprint1')
//                .then(function(blueprint) {
//                    result = blueprint;
//                });
//
//            waitsFor(function() {
//                return result !== {};
//            });
//            runs(function() {
//                expect(result).toBe(_blueprint);
//            });
//        });

    });
});