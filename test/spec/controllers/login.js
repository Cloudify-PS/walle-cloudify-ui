'use strict';

describe('Controller: LoginCtrl', function () {

    // load the controller's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    var LoginCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope
        });
    }));

    describe('#isLoginEnabled', function () {
        it('should return true iff username and password are defined', function () {
            scope.loginPage = {'username': undefined, 'password': undefined};
            expect(scope.isLoginEnabled()).toBe(false);
            scope.loginPage.username = 'foo';
            expect(scope.isLoginEnabled()).toBe(false);
            scope.loginPage.password = 'foo';
            expect(scope.isLoginEnabled()).toBe(true);
            scope.loginPage.username = undefined;
            expect(scope.isLoginEnabled()).toBe(false);
        });
    });

    describe('#login', function () {
        it('should call to login if enabled', inject(function (LoginService) {
            spyOn(LoginService, 'login').and.callFake(function () {
                return {
                    then: function () {
                    }
                };
            });
            scope.loginPage = {username: 'foo', password: 'bar'};
            scope.login();
            expect(LoginService.login).toHaveBeenCalled();
        }));

        it('should not call login if disabled', inject(function (LoginService) {
            spyOn(LoginService, 'login');
            scope.loginPage = {};
            scope.login();
            expect(LoginService.login).not.toHaveBeenCalled();
        }));

        it('should log error if login failed', inject(function ($location, LoginService, $log) {
            var isSuccess = false;
            spyOn($location, 'path');
            spyOn($log, 'info');

            spyOn(LoginService, 'login').and.callFake(function () {
                return {
                    then: function (success, error) {
                        if (isSuccess) {
                            success();
                        } else {
                            error();
                        }
                    }
                };
            });

            scope.loginPage = {'username': 'foo', 'password': 'bar'};
            scope.login();

            expect(scope.errorMessage).not.toBeNull();

            isSuccess = true;
            scope.login();
            expect($log.info).toHaveBeenCalled();
            expect($location.path).toHaveBeenCalled();
        }));
    });
});
