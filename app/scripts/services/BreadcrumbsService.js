'use strict';

angular.module('ngBreadcrumbs', []).factory('BreadcrumbsService', function($rootScope) {

    var data = {};
    var ensureIdIsRegistered = function(id) {
        if (angular.isUndefined(data[id])) {
            data[id] = [];
        }
    };

    function checkIdExists(id) {
        return data[id].length > 0;
    }

    return {
        push: function(id, item) {
            ensureIdIsRegistered(id);
             if (!checkIdExists(id)) {
                 data[id].push(item);
             }
            console.log('$broadcast breadcrumbsRefresh');
            $rootScope.$broadcast('breadcrumbsRefresh');
        },

        get: function(id) {
            ensureIdIsRegistered(id);
            return angular.copy(data[id]);
        },

        setLastIndex: function(id, idx) {
            ensureIdIsRegistered(id);
            if (data[id].length > 1 + idx) {
                data[id].splice(1 + idx, data[id].length - idx);
            }
        }
    };
});