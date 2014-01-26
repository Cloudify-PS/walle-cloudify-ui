'use strict';

angular.module('ngBreadcrumbs', []).factory('BreadcrumbsService', function() {

    var data = {};
    var currentId = '';

    function _checkIdExists(id) {
        if (angular.isUndefined(data[id])) {
            data[id] = [];
        }
        if (id !== currentId) {
            data[currentId] = [];
            currentId = id;
        }
    }

    function _checkItemExists(id, item) {
        var exists = false;
        for (var i = 0; i < data[id].length; i++) {
            if (item.id === data[id][i].id) {
                exists = true;
                if (i === 0) {
                    _setLastIndex(id, i);
                }
            }
        }
        return exists;
    }

    function _setLastIndex(id, idx) {
        data[id].splice(1 + idx, data[id].length - idx);
    }

    return {
        push: function(id, item) {
            _checkIdExists(id);
            if (!_checkItemExists(id, item)) {
                data[id].push(item);
            }
        },

        get: function(id) {
            _checkIdExists(id);
            return angular.copy(data[id]);
        },

        setLastIndex: function(id, idx) {
            _setLastIndex(id, idx);
        }
    };
});