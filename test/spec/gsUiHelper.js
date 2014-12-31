'use strict';

angular.module('gsUiHelper', [])
    .run(function ($httpBackend) {
        $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
        $httpBackend.whenGET('/backend/versions/ui').respond(200);
        $httpBackend.whenGET('/backend/versions/manager').respond(200);
        $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');
    });


angular.module('gsUiHelper')
    .service('$helper', function () {

        function _addInjects(injects) {
            return inject(function ($httpBackend) {
                for (var i in injects) {
                    var inject = injects[i];
                    var method = inject.method ? inject.method.toUpperCase() : 'GET';
                    if (method === 'POST') {
                        $httpBackend.whenPOST(inject.url).respond(inject.statusCode || 200, inject.respond);
                    } else if (method === 'GET') {
                        $httpBackend.whenGET(inject.url).respond(inject.statusCode || 200, inject.respond);
                    }
                }
            });
        }

        return {
            addInjects: _addInjects
        };

    });