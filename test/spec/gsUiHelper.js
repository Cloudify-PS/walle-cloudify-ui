'use strict';

angular.module('gsUiHelper', [])
    .run(function($httpBackend){
        $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
        $httpBackend.whenGET("/backend/versions/ui").respond(200);
        $httpBackend.whenGET("/backend/versions/manager").respond(200);
        $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
    });

angular.module('gsUiHelper')
    .service('$helper', function(){

        function _addInjects(injects) {
            return inject(function($httpBackend) {
                for(var i in injects) {
                    var inject = injects[i];
                    switch(inject.method ? inject.method.toUpperCase() : 'GET') {
                        case 'POST':
                            $httpBackend.whenPOST(inject.url).respond(inject.statusCode || 200, inject.respond);
                            break;
                        case 'GET':
                            $httpBackend.whenGET(inject.url).respond(inject.statusCode || 200, inject.respond);
                            break;
                    }
                }
            });
        }

        return {
            addInjects: _addInjects
        };

    });