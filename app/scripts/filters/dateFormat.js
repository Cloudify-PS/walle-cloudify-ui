'use strict';

angular.module('cosmoUiApp')
    .filter('dateFormat', function myDateFormat($filter) {
        //Supporting 3 date formats currently received from rest
        function hasTimezone(timestamp){
            //check is ISO
            var isoRegex = /T.*Z$/;
            //second format: 2015-12-21 12:59:32.181+0000
            var secondRegex = /\+[0-9]{4}$/;

            //third known format has no timezone: 2015-12-21 12:59:17.362781
            return isoRegex.test(timestamp) || secondRegex.test(timestamp);
        }

        return function (text, newformat) {
            if(text !== undefined) {
                var tempdate;
                //if date has timezone
                if(hasTimezone(text)){
                    tempdate = moment(text).toISOString();
                }
                else{
                    tempdate = moment(text+'+00:00').toISOString();
                }
                return $filter('date')(tempdate, newformat ? newformat : 'MMM-dd-yyyy');
            }
        };
    });
