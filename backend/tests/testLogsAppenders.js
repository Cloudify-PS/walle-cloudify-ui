var log4js = require('log4js');

log4js.loadAppender('file');

log4js.addAppender(log4js.appenders.file('logs/apilogs.log'), 'apilogs');

var logger = log4js.getLogger('apilogs');

logger.setLevel('OFF');


logger.info('TestLog');

console.log('Appender:', log4js.levels);


