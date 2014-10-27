'use strict';

var logger = require('log4js').getLogger('MonitoringService.spec');
var MonitoringService = require('../../../../backend/services/MonitoringService');

describe ('MonitoringService', function(){

    describe ('Get Deployment default dashboards', function(){

        var dashboard;

        beforeEach(function(){
            MonitoringService.getDeploymentDashboard({dashboardId: 'unitTestDashboard'}, function(err, data){
                dashboard = data;
            });
        });

        it ('should create default dashboard', function(){
            expect(dashboard).not.toBeUndefined();
        });

        it ('should have the title "unitTestDashboard"', function(){
            expect(dashboard.title).toBe('unitTestDashboard');
        });

        it ('should have dashboard with 2 rows', function(){
            expect(dashboard.rows.length).toBe(2);
        });

        it ('should have row with 2 panels', function(){
            expect(dashboard.rows[0].panels.length).toBe(2);
        });

        it ('should have panel with 2 targets', function(){
            expect(dashboard.rows[0].panels[0].targets.length).toBe(2);
        });

        it ('should have target query with series of "unitTestDashboard"', function(){
            expect(dashboard.rows[0].panels[0].targets[0].query).toBe('select  mean(value) from /unitTestDashboard\\.vm\\..*?\\.cpu_total_user/ where  time > now() - 5m     group by time(10)  order asc');
        });

    });

});