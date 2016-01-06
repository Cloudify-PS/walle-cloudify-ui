'use strict';
var expect = require('expect.js');
var path = require('path');
var fse = require('fs.extra');
//var MonitoringService = require('../../../../../backend/services/MonitoringService');

describe('MonitoringService', function () {

    describe('charts', function () {
        var dashboardData;

        beforeEach(function () {
            var dashboardDataFile = path.join(__dirname, '../../../../../backend/mock/grafana_dashboard_default.json');
            dashboardData = fse.readJSONSync(dashboardDataFile);
        });

        it('should verify file exists', function () {
            expect(dashboardData).to.not.be(undefined);
        });

        it('line chart fill should be 0', function () {
            expect(dashboardData.rows).to.not.be.empty();

            for (var i = 0; i < dashboardData.rows.length; i++) {
                var row = dashboardData.rows[i];

                for (var j = 0; j < row.panels.length; j++) {
                    var panel = row.panels[j];
                    expect(panel.fill).to.equal(0);
                }
            }
        });

    });
});
