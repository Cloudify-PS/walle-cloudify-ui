'use strict';

angular.module('cosmoUiApp')
    .filter('eventTimeFilter', function () {
        return function (input) {
            var dateObj = new Date(input);
            var todayTimeStamp = new Date().getTime();
            var daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var seconds = dateObj.getMilliseconds();
            var minutes = dateObj.getMinutes();
            var hour = dateObj.getHours();
            var weekday = dateObj.getDay();
            var day = dateObj.getDate();
            var month = dateObj.getMonth() + 1;
            var dayStr = '';

            var deltaFromNow = todayTimeStamp - input;
            if (deltaFromNow < 86400000) {
                dayStr = 'Today';
            } else if (deltaFromNow > 86400000 &&  deltaFromNow < 259200000) {
                dayStr = daysArr[weekday];
            } else {
                dayStr = day + '/' + month;
            }

            return dayStr + ' ' + hour + ':' + minutes + ':' + seconds;
        };
    });
