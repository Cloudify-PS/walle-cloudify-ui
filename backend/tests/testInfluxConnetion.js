var influx = require('influx');

var influxClient = influx({
    host: '54.74.70.218',
    username : 'root',
    password : 'root',
    database : 'influxdb'
});

var query = "list series";

influxClient.query(query, function(err, data){

    console.log(err, data);

});