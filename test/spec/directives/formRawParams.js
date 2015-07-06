'use strict';

describe('Directive: formRawParams', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp','backend-mock','templates-main'));

    var element,
        scope;

    beforeEach(inject(function ($compile, $rootScope ) {

        scope = $rootScope.$new();
        scope.onError = jasmine.createSpy('onError');
        scope.valid = false;
        scope.params = [];
        scope.rawString = '';

        element = angular.element('<div form-raw-params on-error="onError(msg)" raw-string="rawString" valid="valid" params="params"></div>');
        element = $compile(element)(scope);
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

    describe('#validateJsonKeys', function () {
        describe('non strict mode', function () {
            beforeEach(function () {
                scope.params = {
                    'foo': 'bar',
                    'hello': 'world'
                };
                scope.$digest();
            });
            it('should return error and false if key is missing', function () {
                scope.rawString = JSON.stringify({'foo': 'bar'});
                scope.$digest();
                expect(element.isolateScope().validateJsonKeys()).toBe(false);
                expect(scope.onError).toHaveBeenCalledWith('Missing hello key in JSON');
            });

            it('should return true if all keys exist', function () {
                scope.rawString = JSON.stringify({'foo': 'bar', 'hello': 'world'});
                scope.$digest();
                expect(element.isolateScope().validateJsonKeys()).toBe(true);
                expect(scope.onError).toHaveBeenCalledWith(null);
            });
        });

        describe('strict mode', function () {
            beforeEach(function () {
                scope.params = {
                    'foo': 'bar'
                }
            });
            it('should return error and false if key is empty', function () {
                scope.rawString = JSON.stringify({'foo': ''});
                scope.$digest();
                expect(element.isolateScope().validateJsonKeys(true)).toBe(false);
                expect(scope.onError).toHaveBeenCalledWith(null);
            });

            it('should return error and false if key is missing', function () {
                scope.rawString = JSON.stringify({'foo': undefined , 'unit' : null});
                scope.$digest();
                expect(element.isolateScope().validateJsonKeys(true)).toBe(false);
                expect(scope.onError).toHaveBeenCalledWith(null);
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

    xit('should update input JSON object when one of the parameters is updated', function () {
        scope.selectedWorkflow = _workflow;
        scope.inputs.image_name = 'new value';
        scope.inputsState = 'raw';

        scope.updateInputs();

        expect(JSON.parse(scope.rawString).image_name).toBe('new value');
    });

    xit('should keep input type when converting to JSON object', function () {
        scope.selectedWorkflow = _workflow;
        scope.inputsState = 'raw';

        scope.updateInputs();

        expect(typeof(JSON.parse(scope.rawString).str_variable)).toBe('string');
        expect(typeof(JSON.parse(scope.rawString).webserver_port)).toBe('number');
        expect(typeof(JSON.parse(scope.rawString).bool_variable)).toBe('boolean');
    });

    xit('should show error message if required parameters are not provided', inject(function (CloudifyService) {
        var executeParams = null;
        CloudifyService.deployments.execute.andCallFake(function (params) {
            executeParams = params;
            return {
                then: function (success, error) {
                    error({'data': {'message': 'foo'}});
                }
            };
        });

        scope.toggleConfirmationDialog = function () {
        };

        spyOn(scope, 'isExecuteEnabled').andCallFake(function () {
            return true;
        });

        scope.rawString = '{}';
        scope.inputs = {};
        scope.executeErrorMessage = '';
        scope.selectedWorkflow = {
            data: {}
        };

        scope.executeWorkflow();

        expect(scope.executeErrorMessage).toBe('foo');
        expect(scope.showError).toBe(true);
    }));

});
