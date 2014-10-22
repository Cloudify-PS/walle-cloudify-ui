var conf = require("../appConf");
var log4js = require('log4js');
var logger = log4js.getLogger('MonitoringService');

module.exports.cutNameFromSeriesList = function (data, name, callbackFn) {
    for(var i in data) {
        var rowData = data[i];
        if(rowData.hasOwnProperty('points')) {
            for(var r in rowData.points) {
                var serie = rowData.points[r];
                var serieSplit = serie[1].split('.');
                serieSplit.shift();
                serie[1] = serieSplit.join('.');
            }
        }
    }
    callbackFn(null, data);
};