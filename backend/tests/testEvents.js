var conf = require("../appConf");
var cloudify4node = require('../Cloudify4node');
var log4js = require('log4js');
log4js.configure(conf.log4js);
var logger = log4js.getLogger('tests/testEvents');

// Working Data
var dataBody = {
    "filtered": {
        "query": {
            "query_string": {
                "query": "*"
            }
        },
        "filter": {
            "and": {
                "filters": [
                    {
                        "terms": {
                            "context.blueprint_id": [
                                "monitoringbp"
                            ]
                        }
                    },
                    {
                        "terms": {
                            "context.deployment_id": [
                                "monitoringdep",
                                "monitoringbptest"
                            ]
                        }
                    }
                ]
            }
        }
    }
};

var baseData = {
    from: 0,
    size: 1000,
    query: dataBody
};

cloudify4node.getEvents(baseData, function(err, data) {
    logger.debug(err, data);
});