'use strict';

describe('Filter: yaml', function () {

    // load the filter's module
    beforeEach(module('cosmoUiApp'));

    // initialize a new instance of the filter before each test
    var yaml;
    beforeEach(inject(function ($filter) {
        yaml = $filter('yaml');
    }));

    it('has a yaml filter', function(){
        expect(yaml).not.toBeUndefined();
    });

    it('should return filtered yaml data', function () {
        var text = 'blueprint:    name: void_blueprint    nodes:    - name: node_1      type: cloudify.types.web_server';
        text = YAML.parse(text);

        expect(yaml(text)).toBe(YAML.stringify(text));
    });

});