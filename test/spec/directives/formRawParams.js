'use strict';

describe('Directive: formRawParams', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    var setup = inject(function ($compile) {
        element = angular.element('<form-raw-params></form-raw-params>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    xit('should make hidden element visible', inject(function () {
        setup();
        expect(element.text()).toBe('this is the formRawParams directive');
    }));

    xit('should update input JSON object when one of the inputs is updated', function () {
        scope.inputs.image_name = 'new value';
        scope.inputsState = 'raw';

        scope.updateInputs();

        expect(JSON.parse(scope.rawString).image_name).toBe('new value');
    });

    xit('should save input type when converting inputs to JSON', function () {
        scope.selectedBlueprint = _blueprint;
        scope.rawString = JSON.stringify(scope.inputs, null, 2);
        scope.inputsState = 'raw';

        scope.updateInputs();

        expect(typeof(JSON.parse(scope.rawString).webserver_port)).toBe('number');
        expect(typeof(JSON.parse(scope.rawString).bool_variable)).toBe('boolean');
        expect(typeof(JSON.parse(scope.rawString).str_variable)).toBe('string');
    });

    xdescribe('#validateJsonKeys', function () {
        describe('non strict mode', function () {
            beforeEach(function () {
                scope.selectedBlueprint = {
                    plan: {
                        inputs: {
                            'foo': 'bar',
                            'hello': 'world'
                        }
                    }
                };
            });
            it('should return error and false if key is missing', function () {
                scope.rawString = JSON.stringify({'foo': 'bar'});
                expect(scope.validateJsonKeys()).toBe(false);
                expect(scope.deployErrorMessage).toBe('Missing hello key in JSON');
            });

            it('should return true if all keys exist', function () {
                scope.rawString = JSON.stringify({'foo': 'bar', 'hello': 'world'});
                expect(scope.validateJsonKeys()).toBe(true);
                expect(scope.deployErrorMessage).toBe(null);
            });
        });

        describe('strict mode', function () {
            beforeEach(function () {
                scope.selectedBlueprint = {
                    plan: {
                        inputs: {
                            'foo': 'bar'
                        }
                    }
                };
            });
            it('should return error and false if key is missing', function () {
                scope.rawString = JSON.stringify({'foo': ''});
                expect(scope.validateJsonKeys(true)).toBe(false);
                expect(scope.deployErrorMessage).toBe(null);
            });

            it('should return error and false if key is missing', function () {
                scope.rawString = JSON.stringify({'foo': null});
                expect(scope.validateJsonKeys(true)).toBe(false);
                expect(scope.deployErrorMessage).toBe(null);
            });
        });
    });

    xdescribe('#validateJSON', function () {
        it('should return false if rawString is an invalid JSON', function () {
            scope.rawString = ' { "some" goofy } ';
            expect(scope.validateJSON(true)).toBe(false);
            expect(scope.deployErrorMessage).toBe('Invalid JSON: Unable to parse JSON string');
        });
    });

    xdescribe('#rawToForm', function () {
        it('should stringify "1","true" and "null" and not convert them to 1,true,null', function () {
            scope.rawString = '{ "foo" : "1", "bar" : "true", "hello" : "null" }';
            scope.rawToForm();
            expect(scope.inputs.foo).toBe('"1"');
            expect(scope.inputs.bar).toBe('"true"');
            expect(scope.inputs.hello).toBe('"null"');
        });

        it('should handle invalid raw string and remain in raw mode', inject(function (INPUT_STATE) {
            scope.rawString = '{ foo bar }';
            scope.rawToForm();
            expect(scope.deployErrorMessage).toBe('Invalid JSON: Unable to parse JSON string');
            expect(scope.inputsState).toBe(INPUT_STATE.RAW);
        }));
    });
});
