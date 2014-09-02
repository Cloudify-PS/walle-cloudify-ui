'use strict';

describe('Filter: yaml', function () {
    var yaml;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {
            // load the filter's module
            module('cosmoUiApp', 'ngMock');

            // initialize a new instance of the filter
            inject(function ($filter, $httpBackend) {
                $httpBackend.whenGET("/backend/configuration?access=all").respond(200);
                $httpBackend.whenGET("/backend/versions/ui").respond(200);
                $httpBackend.whenGET("/backend/versions/manager").respond(200);
                $httpBackend.whenGET("/backend/version/latest?version=00").respond('300');

                yaml = $filter('yaml');
            });
        });
    });

    describe('Unit tests', function() {
        it('has a yaml filter', function(){
            expect(yaml).not.toBeUndefined();
        });

        it('should return filtered yaml data', function () {
            var text = 'blueprint:    name: void_blueprint    nodes:    - name: node_1      type: cloudify.types.web_server';
            text = YAML.parse(text);

            expect(yaml(text)).toBe(YAML.stringify(text));
        });
    });

});