'use strict';

describe('Directive: maintenanceMessage', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element, scope, MaintenanceService;
    var listenerCalled;

    beforeEach(inject(function ($rootScope, _MaintenanceService_) {
        MaintenanceService = _MaintenanceService_;
        listenerCalled = false;
        spyOn(MaintenanceService, 'onStatusChange').and.callFake(window.maintenanceMock.getOnStatusChangeMock('activating', function(){
            listenerCalled = true;
        }));
        scope = $rootScope.$new();
        setup();
    }));

    var setup = inject(function( $compile ){
        element = angular.element('<maintenance-message></maintenance-message>');
        element = $compile(element)(scope);
        scope.$digest();
    });

    it('should change maintenance message by status', function(){
        expect(scope.maintenanceMsg).toContain('activating');

        MaintenanceService.onStatusChange.and.callFake(window.maintenanceMock.getOnStatusChangeMock('deactivated', function(){
            listenerCalled = true;
        }));
        setup();
        expect(scope.maintenanceMsg).toContain('deactivated');
    });
});
