'use strict';

//angular.module('cosmoUiApp')
//  .service('Breadcrumbsservice', function Breadcrumbsservice() {
//    // AngularJS will instantiate a singleton by calling "new" on this function
//  });


angular.module('ngBreadcrumbs', []).factory('BreadcrumbsService', function($rootScope) {
    var data = {};
    var ensureIdIsRegistered = function(id) {
        if (angular.isUndefined(data[id])) {
            data[id] = [];
        }
    };
    return {
        push: function(id, item) {
            ensureIdIsRegistered(id);
            data[id].push(item);
            console.log( '$broadcast' );
            $rootScope.$broadcast( 'breadcrumbsRefresh' );
        },
        get: function(id) {
            ensureIdIsRegistered(id);
            return angular.copy(data[id]);
        },
        setLastIndex: function( id, idx ) {
            ensureIdIsRegistered(id);
            if ( data[id].length > 1+idx ) {
                data[id].splice( 1+idx, data[id].length - idx );
            }
        }
    };
});