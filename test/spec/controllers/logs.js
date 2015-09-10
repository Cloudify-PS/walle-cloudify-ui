'use strict';

describe('Controller: LogsCtrl', function () {
    var LogsCtrl, scope;
    var anchorScroll = null;

    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock', 'backend-mock'));


    beforeEach(inject(function ($controller, $rootScope ) {
        scope = $rootScope.$new();
        anchorScroll = jasmine.createSpy();
        LogsCtrl = $controller('LogsCtrl', {
            $scope: scope,
            $anchorScroll : anchorScroll
        });
    }));


    /// tests to be readded by eden with filtering feature

});
