'use strict';

describe('Filter: yaml', function () {
    var yaml;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {
            // load the filter's module
            module('cosmoUiApp');

            // initialize a new instance of the filter
            inject(function ($filter) {
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