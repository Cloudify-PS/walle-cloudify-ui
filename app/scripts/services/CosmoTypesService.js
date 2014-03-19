'use strict';

angular.module('cosmoUi')
    .service('Cosmotypesservice', function Cosmotypesservice() {
        var typeData = [
            {
                name: 'typeName',
                baseType: 'baseType'
            }
        ];

        function _getTypeData(typeName) {
            for (var i = 0; i < typeData.length; i++) {
                if (typeData[i].name === typeName) {
                    return typeData[i];
                }
            }
        }

        this.getTypeData = _getTypeData;
    });
