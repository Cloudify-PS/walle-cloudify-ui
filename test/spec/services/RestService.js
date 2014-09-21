'use strict';

describe('Service: RestService', function () {
    var restService;
    var _deployment = {
        "inputs": {
            "webserver_port": 8080,
            "image_name": "image_name",
            "agent_user": "agent_user",
            "flavor_name": "flavor_name"
        },
        "blueprint_id": "blueprint1",
        "id": "deployment1",
        "outputs": {
            "http_endpoint": {
                "description": "HTTP web server endpoint.",
                "value": {
                    "get_attribute": ["vm", "ip"]
                }
            }
        }
    };

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {
            // load the filter's module
            module('cosmoUiApp', 'ngMock');

            // initialize a new instance of the filter
            inject(function ($rootScope, RestService, $httpBackend) {
                $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
                $httpBackend.whenGET("/backend/versions/ui").respond(200);
                $httpBackend.whenGET("/backend/versions/manager").respond(200);
                $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

                restService = RestService;
            });
        });
    });

    describe('Unit tests', function() {
        it('should create a new RestService instance', function() {
            expect(restService).not.toBeUndefined();
        });

        it('should call deployBlueprint with all given parameters', function() {
            // create new deployment with all parameters and make sure all params passed to backend
            // TODO: Finish this test after RestService code refactoring
//            var params = {
//                "blueprint_id": "blueprint1",
//                "deployment_id": "deployment1",
//                "inputs":{
//                    "agent_user": "agent_user",
//                    "flavor_name" :"flavor_name",
//                    "image_name": "image_name",
//                    "webserver_port": "webserver_port"
//                }
//            };
//
//            restService.deployBlueprint(params)
//                .then(function(data) {
//                    console.log(data);
//                });
        });
    });
});
