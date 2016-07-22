'use strict';

describe('Directive: imageBakeryWizard', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element, scope, isolateScope;
    var cloudifyClient, $rootScope, hotkeys, FlowService, LoginService, $timeout, $state;

    beforeEach(inject(function (_$rootScope_, _cloudifyClient_, _hotkeys_, _FlowService_, _LoginService_, _$timeout_, _$state_) {
        cloudifyClient = _cloudifyClient_;
        $rootScope = _$rootScope_;
        hotkeys = _hotkeys_;
        FlowService = _FlowService_;
        LoginService = _LoginService_;
        $timeout = _$timeout_;
        $state = _$state_;
        scope = $rootScope.$new();

        spyOn(hotkeys, 'pause').and.callThrough();
        spyOn(hotkeys, 'unpause').and.callThrough();
        spyOn($rootScope, '$on').and.callThrough();
        spyOn(cloudifyClient.providerContext, 'get').and.returnValue(window.mockPromise(getContextMock({enabled: true, completed: false, inputs: [], title:'aws configuration'})));
        spyOn(cloudifyClient.providerContext, 'update').and.returnValue(window.mockPromise({}));
        spyOn(cloudifyClient.executions, 'list').and.returnValue(window.mockPromise({}));
        spyOn(cloudifyClient.events, 'get').and.returnValue(window.mockPromise({data:{items:[]}}));
        spyOn(LoginService, 'isLoggedIn').and.returnValue(window.mockPromise({data:{result: true}}));
        spyOn(LoginService, 'logout').and.returnValue(window.mockPromise({}));
        spyOn(FlowService, 'deployAndExecute').and.returnValue(window.mockPromise({}));
        spyOn(location, 'reload').and.callFake(function(){});
        spyOn(localStorage, 'removeItem').and.callThrough();
        spyOn($state, 'go').and.callThrough();
    }));

    function getContextMock(managerConf){
        return {data: {context: {cloudify: {manager_configuration: managerConf}}}};
    }

    var setup = inject(function( $compile ){
        element = angular.element('<image-bakery-wizard></image-bakery-wizard>');
        element = $compile(element)(scope);
        scope.$digest();
        isolateScope = element.isolateScope();
    });

    describe('shouldBakeImage', function(){
        it('should bake image', function(){
            setup();

            expect(isolateScope.isCompleted).toBe(undefined);
            expect(isolateScope.showWizard).toBe(true);
            expect(isolateScope.panelIndex).toBe(1);
            expect(isolateScope.inputs).toEqual([]);
            expect(isolateScope.title).toBe('aws configuration');

            expect(hotkeys.pause).toHaveBeenCalled();
            expect($rootScope.$on).toHaveBeenCalled();

        });

        it('should not bake image', function(){
            cloudifyClient.providerContext.get.and.returnValue(window.mockPromise(getContextMock({enabled: false, completed: false})));
            setup();

            expect(isolateScope.isCompleted).toBe(null);
            expect(isolateScope.showWizard).toBe(undefined);
        });

        it('should open completed bake panel', function(){
            cloudifyClient.providerContext.get.and.returnValue(window.mockPromise(getContextMock({enabled: false, completed: true})));
            setup();

            expect(isolateScope.isCompleted).toBe(true);
            expect(isolateScope.showWizard).toBe(true);

            expect(hotkeys.pause).toHaveBeenCalled();
            expect($rootScope.$on).toHaveBeenCalled();
        });
    });

    describe('configure manager', function(){
        it('should start configuring and poll status', function(){
            setup();
            spyOn(isolateScope, 'registerTickerTask').and.callThrough();

            isolateScope.panelIndex = 2;
            isolateScope.configure();

            expect(isolateScope.panelIndex).toBe(3);
            expect(FlowService.deployAndExecute).toHaveBeenCalled();
            expect(cloudifyClient.providerContext.update).toHaveBeenCalled();
            expect(isolateScope.registerTickerTask.calls.argsFor(0)[0]).toBe('imageBakeryWizard/timer');
            expect(isolateScope.registerTickerTask.calls.argsFor(1)[0]).toBe('imageBakeryWizard/pollEvents');
            expect(isolateScope.registerTickerTask.calls.argsFor(2)[0]).toBe('imageBakeryWizard/pollExecutions');
        });

        it('should finish successful configuring', function(){
            cloudifyClient.executions.list.and.returnValue(window.mockPromise({data:{items:[{status: 'terminated'}]}}));
            setup();
            spyOn(isolateScope, 'registerTickerTask').and.callFake(function(id, callback){
                if(id === 'imageBakeryWizard/pollExecutions'){
                    callback();
                }
            });
            spyOn(isolateScope, 'unregisterTickerTask').and.callFake(function(){});

            isolateScope.configure();

            expect(LoginService.isLoggedIn).toHaveBeenCalled();

            //TODO - timeout flush cause digest loop (probably because $timeout is called inside another asynchronous function
            //$timeout.flush();
            //expect(LoginService.logout).toHaveBeenCalled();
            //expect(cloudifyClient.providerContext.update).toHaveBeenCalled();
            //expect(isolateScope.registerTickerTask.calls.argsFor(3)[0]).toBe('imageBakeryWizard/countdown');
            //expect(location.reload).toHaveBeenCalled();
        });

        it('should finish failed configuring', function(){
            cloudifyClient.executions.list.and.returnValue(window.mockPromise({data:{items:[{status: 'failed'}]}}));
            setup();
            spyOn(isolateScope, 'registerTickerTask').and.callFake(function(id, callback){
                if(id === 'imageBakeryWizard/pollExecutions'){
                    callback();
                }
            });
            spyOn(isolateScope, 'unregisterTickerTask').and.callThrough();

            isolateScope.configure();

            expect(isolateScope.setupFailed).toBe(true);
            expect(isolateScope.unregisterTickerTask.calls.argsFor(0)[0]).toBe('imageBakeryWizard/pollEvents');
            expect(isolateScope.unregisterTickerTask.calls.argsFor(1)[0]).toBe('imageBakeryWizard/pollExecutions');
        });
    });

    it('#closeCompletedWizard', function(){
        var settingsDeployment = 'dep';
        cloudifyClient.providerContext.get.and.returnValue(window.mockPromise(getContextMock({enabled: false, completed: true, inputs: [], title:'aws configuration', settingsDeployment: settingsDeployment})));
        setup();
        isolateScope.closeCompletedWizard();

        expect(localStorage.removeItem).toHaveBeenCalledWith('imageBakerySucceed');
        expect(localStorage.removeItem).toHaveBeenCalledWith('settingsDeployment');
        expect(cloudifyClient.providerContext.update).toHaveBeenCalledWith('provider', {cloudify: {manager_configuration: {completed: false}}});
        expect($state.go).toHaveBeenCalledWith('cloudifyLayout.deploymentLayout.inputsOutputs', {deploymentId: settingsDeployment});
        expect(hotkeys.unpause).toHaveBeenCalled();
        expect(isolateScope.showWizard).toBe(false);
    });

    it('#closeFailedWizard', function(){
        setup();

        isolateScope.closeFailedWizard();

        expect(hotkeys.unpause).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalledWith('cloudifyLayout.logs');
        expect(isolateScope.showWizard).toBe(false);
    });
});
