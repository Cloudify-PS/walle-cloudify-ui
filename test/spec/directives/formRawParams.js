'use strict';

describe('Directive: formRawParams', function () {
    var element;
    var scope;
    var isolateScope;

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope.$new();
        scope.valid = false;
        scope.params = [];
        scope.rawString = '';
        scope.onError = jasmine.createSpy('onError');

        element = angular.element('<div form-raw-params on-error="onError" raw-string="rawString" valid="valid" params="params"></div>');
        element = $compile(element)(scope);

        scope.$digest();

        isolateScope = element.isolateScope();
    }));

    it('should update input JSON object when one of the inputs is updated', function () {
        scope.params = {image_name: {default: 'new value'}};
        scope.$digest();

        expect(JSON.parse(isolateScope.rawString).image_name).toBe('new value');
    });

    it('should save input type when converting inputs to JSON', function () {
        scope.params = {
            'webserver_port': {default: 80},
            'bool_variable': {default: true},
            'str_variable': {default: 'foo bar'}
        };
        scope.$digest();

        expect((typeof JSON.parse(isolateScope.rawString).webserver_port)).toBe('number');
        expect((typeof JSON.parse(isolateScope.rawString).bool_variable)).toBe('boolean');
        expect((typeof JSON.parse(isolateScope.rawString).str_variable)).toBe('string');
    });

    it('should not let resize #rawString textarea', function () {
        var textarea = element.find('#rawString');

        expect(textarea.hasClass('resize-vertical')).toBeTruthy();
    });

    describe('#validateJsonKeys', function () {
        beforeEach(function () {
            scope.params = { 'foo': 'bar', 'hello': 'world'};
            scope.$digest();
        });

        it('should return error and false if key is missing', function () {
            isolateScope.rawString = JSON.stringify({'foo': 'bar'});

            expect(isolateScope.validateJsonKeys()).toBe(false);
            expect(scope.onError).toHaveBeenCalledWith('formRawParams.missingKeyInJson');

        });

        it('should return error and false if key is missing', function () {
            isolateScope.rawString = JSON.stringify({
                'foo': undefined,
                'hello': 'world'
            });

            expect(isolateScope.validateJsonKeys(true)).toBe(false);
            expect(scope.onError).toHaveBeenCalledWith(null);
        });

        it('should return true if all keys exist', function () {
            isolateScope.rawString = JSON.stringify({
                'foo': 'bar',
                'hello': 'world'
            });

            expect(isolateScope.validateJsonKeys()).toBe(true);
            expect(scope.onError).toHaveBeenCalledWith(null);
        });

        it('should return error and false if addition unexpected key was added', function () {
            isolateScope.rawString = JSON.stringify({
                'foo': 'bar',
                'hello': 'world',
                'unexpected': 'key'
            });

            expect(isolateScope.validateJsonKeys()).toBe(false);
            expect(scope.onError).toHaveBeenCalledWith('formRawParams.unexpectedKeyInJson');
        });
    });

    describe('#validateJSON', function () {
        it('should return false if rawString is an invalid JSON', function () {
            isolateScope.rawString = 1;

            expect(isolateScope.validateJSON(true)).toBe(false);
            expect(scope.onError).toHaveBeenCalled();
        });
    });

    describe('#validateInputsNotEmpty', function () {
        it('should return false if one of the inputs is empty', function () {
            isolateScope.rawString = ' { "input" : "", "empty" : "I aint no empty homie" } ';

            expect(isolateScope.validateInputsNotEmpty()).toBe(false);
        });

        it('should return true if all inputs are not empty', function () {
            isolateScope.rawString = ' { "input" : "What would life be if we had no courage to attempt anything - Vincent Van Gogh", "empty" : "I aint no empty homie" } ';

            expect(isolateScope.validateInputsNotEmpty()).toBe(true);
        });
    });

    describe('updating params object', function () {
        it('should set default values as an empty string', function () {
            scope.params = {'money': {}, 'happiness': {}};
            scope.$digest();

            expect(isolateScope.inputs.money).toBe('');
            expect(isolateScope.inputs.happiness).toBe('');
        });
    });

    describe('#rawToForm', function () {
        it('should stringify "1","true" and "null" and not convert them to 1,true,null', function () {
            isolateScope.rawString = '{ "foo" : "1", "bar" : "true", "hello" : "null" }';
            scope.$digest();

            expect(isolateScope.inputs.foo).toBe('"1"');
            expect(isolateScope.inputs.bar).toBe('"true"');
            expect(isolateScope.inputs.hello).toBe('"null"');
        });

        it('should handle invalid raw string', inject(function () {
            isolateScope.rawString = '{ foo bar }';
            scope.$digest();

            expect(scope.onError).toHaveBeenCalledWith('<div>Parse error on line 1:</div><div>{ foo bar }</div><div>--^</div><div>Expecting \'STRING\', \'}\', got \'undefined\'</div>');
        }));
    });

    describe('load defaults', function () {
        it('should load inputs defaults when dialog is opened', function () {
            scope.params = {
                'int_variable': {'default': 80},
                'bool_variable': {'default': true},
                'str_variable': {'default': 'foo bar'},
                'null_variable': {'default': null},
                'array': {'default': [1, 2, 3, true]},
                'object': {'default': {'key': 'value'}}
            };
            scope.$digest();

            expect(JSON.parse(isolateScope.rawString).int_variable).toBe(80);
            expect(JSON.parse(isolateScope.rawString).bool_variable).toBe(true);
            expect(JSON.parse(isolateScope.rawString).str_variable).toBe('foo bar');
            expect(JSON.parse(isolateScope.rawString).null_variable).toBe(null);
            expect(JSON.parse(isolateScope.rawString).array).toEqual([1, 2, 3, true]);
            expect(JSON.parse(isolateScope.rawString).object).toEqual({'key': 'value'});
        });
    });

    describe('restore-default button logic', function () {
        it('should return value to default value', function () {
            scope.params = {
                'int_variable': {'default': 80},
                'bool_variable': {'default': true},
                'str_variable': {'default': 'foo bar'},
                'null_variable': {'default': null},
                'array': {'default': [1, 2, 3, true]},
                'object': {'default': {'key': 'value'}}
            };
            scope.$digest();

            isolateScope.inputs.int_variable = 'changed default';
            isolateScope.inputs.bool_variable = 'changed default';
            isolateScope.inputs.str_variable = 'changed default';
            isolateScope.inputs.null_variable = 'changed default';
            isolateScope.inputs.array = 'changed default';
            isolateScope.inputs.object = 'changed default';

            isolateScope.restoreDefault('int_variable', 80);
            isolateScope.restoreDefault('bool_variable', true);
            isolateScope.restoreDefault('str_variable', 'foo bar');
            isolateScope.restoreDefault('null_variable', null);
            isolateScope.restoreDefault('array', [1, 2, 3, true]);
            isolateScope.restoreDefault('object', {'key': 'value'});

            //checking inputs before digest since it changes them (for example "null" turns to - null
            //meaning this is what the user see immediately after clicking the button before value is parsed / changed
            expect(isolateScope.inputs.int_variable).toBe(80);
            expect(isolateScope.inputs.bool_variable).toBe(true);
            expect(isolateScope.inputs.str_variable).toBe('foo bar');
            expect(isolateScope.inputs.null_variable).toBe(null);
            expect(isolateScope.inputs.array).toEqual('[1,2,3,true]');
            expect(isolateScope.inputs.object).toEqual('{"key":"value"}');

            expect(JSON.parse(isolateScope.rawString).int_variable).toBe(80);
            expect(JSON.parse(isolateScope.rawString).bool_variable).toBe(true);
            expect(JSON.parse(isolateScope.rawString).str_variable).toBe('foo bar');
            expect(JSON.parse(isolateScope.rawString).null_variable).toBe(null);
            expect(JSON.parse(isolateScope.rawString).array).toEqual([1, 2, 3, true]);
            expect(JSON.parse(isolateScope.rawString).object).toEqual({'key': 'value'});
        });
    });

    describe('views tests', function () {

        var content = null;
        beforeEach(function () {
            var wrapper = angular.element('<div class="ngdialog"><div class="ngdialog-content"></div></div>');
            $('body').append(wrapper);
            content = wrapper.find('.ngdialog-content');
        });

        afterEach(function () {
            $('body .ngdialog').remove();
        });
        describe('overflow', function () {
            function hasScrollbar(element) {
                return element.scrollHeight > element.clientHeight;
            }

            it('should have a scrollbar if overflow', function () {
                scope.params = {
                    'foo': '',
                    'bar': '',
                    'hello': '',
                    'world': '',
                    'long': '',
                    'short': ''
                };
                scope.$digest();
                content.append(element);
                var inputParameters = element.find('ul')[0];
                var elementHasScrollbar = hasScrollbar(inputParameters);
                expect(elementHasScrollbar).toBe(true);
            });

            it('should not have a scrollbar if does not overflow', function () {
                scope.params = {'foo': '', 'bar': '', 'hello': ''};
                scope.$digest();
                content.append(element);
                var inputParameters = element.find('ul')[0];
                var elementHasScrollbar = hasScrollbar(inputParameters);
                expect(elementHasScrollbar).toBe(false);
            });
        });

        describe('inputs params tooltip', function () {
            it('should show input params description as tooltip', function () {
                scope.params = {'foo': {'description': 'A yummy snickers'}};
                scope.$digest();
                content.append(element);
                var inputParameters = element.find('li div');
                expect(inputParameters[0].getAttribute('title')).toBe('foo: A yummy snickers');
            });

            it('should show no description defined message as tooltip', function () {
                scope.params = {'bar': {}};
                scope.$digest();
                content.append(element);
                var inputParameters = element.find('li div');
                expect(inputParameters[0].getAttribute('title')).toBe('bar: formRawParams.noDescriptionTooltip');
            });
        });

        describe('placeholder', function () {
            it('should make placeholder "null" when input has a null value', function () {
                scope.params = {'foo': {}};
                content.append(element);
                scope.$digest();
                isolateScope.rawString = ' { "foo" : null } ';
                scope.$digest();
                var input = element.find('li input');

                expect(input[0].getAttribute('placeholder')).toBe('null');
            });

            it('should make placeholder translate "dialogs.deploy.value" when input has no value and is not null', function () {
                scope.params = {'foo': {}};
                content.append(element);
                scope.$digest();
                isolateScope.rawString = ' { "foo" : "" } ';
                var input = element.find('li input');

                expect(input[0].getAttribute('placeholder')).toBe('dialogs.deploy.value');
            });
        });

        describe('restore-default button', function () {
            it('should show default value as tooltip', function () {
                scope.params = {
                    'int_variable': {'default': 80},
                    'bool_variable': {'default': true},
                    'str_variable': {'default': 'foo bar'},
                    'null_variable': {'default': null},
                    'array': {'default': [1, 2, 3, true]},
                    'object': {'default': {'key': 'value'}}
                };
                scope.$digest();
                content.append(element);
                var restoreDefault = element.find('.restore-default');

                // Checking - Array, Object, String, null, number, boolean
                expect(restoreDefault[0].getAttribute('title')).toBe('80');
                expect(restoreDefault[1].getAttribute('title')).toBe('true');
                expect(restoreDefault[2].getAttribute('title')).toBe('foo bar');
                expect(restoreDefault[3].getAttribute('title')).toBe('null');
                expect(restoreDefault[5].getAttribute('title')).toBe('{"key":"value"}');
                expect(restoreDefault[4].getAttribute('title')).toBe('[1,2,3,true]');
            });

            it('should have restore-default button if has default', function () {
                scope.params = {
                    'array': {'default': [1, 2, 3, true]},
                    'object': {'default': '{"key":"value"}'},
                    'string': {'default': 'bloop'},
                    'null': {'default': null},
                    'noDefault': {'description': 'making sure not all has restore-default button'}
                };
                scope.$digest();
                content.append(element);
                var restoreDefault = element.find('.restore-default');
                expect(restoreDefault.length).toBe(4);
            });

            it('should not have restore-default button if has no default', function () {
                scope.params = {'foo': {}, 'bar': {}, 'bloop': {}};
                scope.$digest();
                content.append(element);
                var restoreDefault = element.find('.restore-default');
                expect(restoreDefault.length).toBe(0);
            });
        });

    });
});
