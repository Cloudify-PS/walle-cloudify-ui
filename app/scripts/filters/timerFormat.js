'use strict';

/**
 * @ngdoc filter
 * @name cosmoUiApp.filter:timerFormat
 * @function
 * @description
 * # timerFormat
 * Filter in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .filter('timerFormat', function () {
        function handleSingleDigit(num){
            if((''+num).length === 1){
                return '0'+num;
            }
            return num;
        }

        return function (timeInSeconds, isHours) {
            if(!timeInSeconds){
                return isHours ? '00:00:00' : '00:00';
            }
            var format = '';
            var seconds = timeInSeconds % 60;
            var minutes = Math.floor(timeInSeconds / 60);
            var hours;

            if(isHours){
                hours = Math.floor(minutes / 60);
                minutes = minutes % 60;

                format += handleSingleDigit(hours)+':';
            }
            format += handleSingleDigit(minutes)+':'+handleSingleDigit(seconds);
            return format;
        };
    });
