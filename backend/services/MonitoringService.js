'use strict';
var conf = require('../appConf');
var log4js = require('log4js');
var logger = log4js.getLogger('MonitoringService');
var influx = require('influx');

logger.info('loaded');

function _createInfluxRequest(query, callback) {
    var influxClient = influx({
        host: conf.influx.host,
        username : conf.influx.user,
        password : conf.influx.pass,
        database : conf.influx.dbname
    });

    influxClient.request.get({
        url: influxClient.url('db/' + influxClient.options.database + '/series', query),
        json: true
    }, influxClient._parseCallback(callback));
}

function _getDashboardSeries(query, callbackFn) {
    _createInfluxRequest(query, callbackFn);
}

function _getDashboardSeriesList(query, callbackFn) {
    if(!query.hasOwnProperty('dashboardId')) {
        callbackFn({
            'status': 400,
            'message': '400: Invalid dashboardId',
            'error_code': 'Dashboard ID required'
        }, null);
    }
    _createInfluxRequest({q: 'list series like /' + query.dashboardId + '..*/i', time_precision: query.time_precision}, function(err, data){
        return callbackFn(err, data);
    });
}

function _getDeploymentDashboard(query, callbackFn) {
    var dashboard = require('../mock/grafana_dashboard_default.json');

    // Update title
    dashboard.title = query.dashboardId;

    // Inject deployment to template
    if (dashboard.hasOwnProperty('rows')) {
        for(var i in dashboard.rows) {
            var row = dashboard.rows[i];

            for(var j in row.panels) {
                var panel = row.panels[j];

                for(var k in panel.targets) {
                    var target = panel.targets[k];

                    target.query = target.query.replace(/{%deployment%}/gi, query.dashboardId);
                }
            }
        }
    }

    // Remove the require object from cache
    delete require.cache[require.resolve('../mock/grafana_dashboard_default.json')];

    // return callback function
    callbackFn(null, dashboard);
}

module.exports.getDashboardSeries = _getDashboardSeries;
module.exports.getDashboardSeriesList = _getDashboardSeriesList;
module.exports.getDeploymentDashboard = _getDeploymentDashboard;

