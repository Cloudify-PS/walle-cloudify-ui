'use strict';

Date.fromISO = (function () {
    var testIso = '2011-11-24T09:00:27+0200';

    var noOffset = function (s) {
        var day = s.slice(0, -5).split(/\D/).map(function (itm) {
            return parseInt(itm, 10) || 0;
        });
        day[1] -= 1;
        day = new Date(Date.UTC.apply(Date, day));
        var offsetString = s.slice(-5);
        var offset = parseInt(offsetString, 10) / 100;
        if (offsetString.slice(0, 1) === '+') {
            offset *= -1;
            day.setHours(day.getHours() + offset);
        }
        return day;
    };
    if (noOffset(testIso) === 1322118027000 && !Date.forceIsoOffset /* make it testable */ ) {
        return noOffset;
    }
    return function (s) {

        var day, tz,
            rx = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/,

            p = rx.exec(s) || [];
        if (p[1]) {
            day = p[1].split(/\D/).map(function (itm) {
                return parseInt(itm, 10) || 0;
            });
            day[1] -= 1;
            day = new Date(Date.UTC.apply(Date, day));
            if (!day.getDate()) {
                return NaN;
            }
            if (p[5]) {
                tz = parseInt(p[5], 10) / 100 * 60;
                if (p[6]) {
                    tz += parseInt(p[6], 10);
                }
                if (p[4] === '+') {
                    tz *= -1;
                }
                if (tz) {
                    day.setUTCMinutes(day.getUTCMinutes() + tz);
                }
            }
            return new Date(day);
        }
        return NaN;
    };
})();

angular.module('cosmoUiApp')
    .filter('dateFormat', function myDateFormat($filter) {

        return function (text, newformat) {

            if(text !== undefined) {
                var fromiso = Date.fromISO(text);
                var tempdate = new Date( fromiso );
                tempdate.setUTCHours(tempdate.getUTCHours() + tempdate.getTimezoneOffset() / 60);
                return $filter('date')(tempdate, newformat ? newformat : 'MMM-dd-yyyy');
            }
        };
    });
