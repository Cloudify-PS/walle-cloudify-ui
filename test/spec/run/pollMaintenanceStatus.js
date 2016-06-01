'use strict';

describe('Run: pollMaintenanceStatus', function () {


    var cloudifyClient, MaintenanceService, TickerSrv, $state, $rootScope;

    //load the service's module
    beforeEach(function(){
        module('cosmoUiApp',function($provide){
            var tickerSrv = {
                register: function(id, callback){
                    callback();
                }
            };
            spyOn(tickerSrv, 'register').and.callThrough();
            $provide.value('TickerSrv', tickerSrv);

            var client = {
                maintenance:{
                    get: {}
                }
            };
            spyOn(client.maintenance, 'get').and.returnValue(window.mockPromise({
                data: {
                    status: 'activated'
                }
            }));
            $provide.value('cloudifyClient', client);

            var maintenanceService = {
                onStatusChange: function(){},
                setMaintenanceData: function(){}
            };
            spyOn(maintenanceService, 'setMaintenanceData').and.callThrough();
            spyOn(maintenanceService, 'onStatusChange').and.callFake(window.maintenanceMock.getOnStatusChangeMock('activated'));
            $provide.value('MaintenanceService', maintenanceService);

            var state = {
                is: function(){
                    return false;
                },
                go: function(){}
            };
            spyOn(state, 'is').and.callThrough();
            spyOn(state, 'go').and.callThrough();
            $provide.value('$state', state);
        });

        inject(function(_cloudifyClient_, _MaintenanceService_, _TickerSrv_, _$state_, _$rootScope_){
            cloudifyClient = _cloudifyClient_;
            MaintenanceService = _MaintenanceService_;
            TickerSrv = _TickerSrv_;
            $state = _$state_;
            $rootScope = _$rootScope_;
        });
    });

    it('should poll and set maintenance status', function () {
        expect(TickerSrv.register).toHaveBeenCalled();
        expect(cloudifyClient.maintenance.get).toHaveBeenCalled();
        expect(MaintenanceService.setMaintenanceData).toHaveBeenCalledWith({status: 'activated'});
    });

    it('should route to maintenance when activated', function(){
        expect($state.is).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalled();
    });

});
