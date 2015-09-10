'use strict';

describe('Service: BlueprintSourceService', function () {
    var blueprintSourceService;

    beforeEach(module('cosmoUiApp', 'backend-mock'));

    // Initialize a new instance of BlueprintSourceService
    beforeEach(inject(function (BlueprintSourceService) {
        blueprintSourceService = BlueprintSourceService;
    }));

    describe('#getBrowseData', function () {
        var browseResponse = {};

        beforeEach(inject(function (CloudifyService) {
            browseResponse = {children: [{}]};
            spyOn(CloudifyService.blueprints, 'browse').andCallFake(function () {
                return {
                    then: function (success) {
                        var result = success(browseResponse);
                        return {
                            then: function (success) {
                                success(result);
                            }
                        };
                    }
                };
            });
        }));

        it('should call CloudifyService.blueprint.browse', inject(function (CloudifyService) {
            blueprintSourceService.getBrowseData('foo');
            expect(CloudifyService.blueprints.browse).toHaveBeenCalled();
        }));

        it('should return object as is if object has error code', function () {
            browseResponse.errCode = 'foo';
            blueprintSourceService.getBrowseData('foo').then(function (result) {
                expect(result).toBe(browseResponse);
            });
        });
    });
});
