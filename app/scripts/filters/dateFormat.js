'use strict';

angular.module('cosmoUiApp')
    .filter('dateFormat', function myDateFormat($filter) {
        return function (text, newformat) {
            Date.fromISO = (function () {
                var testIso = '2011-11-24T09:00:27+0200';
                // Chrome
//                var diso = Date.parse(testIso);
//                if (diso === 1322118027000) {
//                    return function (s) {
//                        return new Date(Date.parse(s));
//                    };
//                }
                // JS 1.8 gecko
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
                    return day.getTime();
                };
                if (noOffset(testIso) === 1322118027000) {
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
                        return day;
                    }
                    return NaN;
                };
            })();
            if(text !== undefined) {
                var tempdate = new Date(Date.fromISO(text));
                return $filter('date')(tempdate, newformat ? newformat : 'MMM-dd-yyyy');
            }
        };
    });
