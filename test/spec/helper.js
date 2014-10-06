'use strict';

function Helper() {

    function _injectUi() {
        return inject(function($httpBackend) {
            $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
            $httpBackend.whenGET("/backend/versions/ui").respond(200);
            $httpBackend.whenGET("/backend/versions/manager").respond(200);
            $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');
        });
    }

    function _addInjects(injects) {
        return inject(function($httpBackend) {
            for(var i in injects) {
                var inject = injects[i];
                switch(inject.method ? inject.method.toUpperCase() : 'GET') {
                case 'POST':
                    $httpBackend.whenPOST(inject.url).respond(inject.respond);
                    break;
                case 'GET':
                    $httpBackend.whenGET(inject.url).respond(inject.respond);
                    break;
                }
            }
        });
    }

    return {
        injectUi: _injectUi,
        addInjects: _addInjects
    };

}