'use strict';

angular.module('cosmoUi')
    .factory('WhiteLabel', ['$resource', function ($resource) {

        var obj = $resource('/backend/whitelabel').get() || {};
//        console.log(obj)

        return {

            value: function (key) {
                return key in obj && obj[key] || '';
            },

            classnamePrefix: function () {
                return this.value('classnamePrefix');
            },

            colors: function () {
                return this.value('colors');
            },

            colorSuffix: function () {
                return this.value('colorSuffix');
            },

            classname: function (filename) {

                var colorSuffix = this.colorSuffix() || ''; // may be absent
                var classname = this.classnamePrefix() + filename + colorSuffix;

                // TODO why is it called with undefined prefix?
//                console.log('classname: ', classname);
                return classname;
            }

        };
    }]);
