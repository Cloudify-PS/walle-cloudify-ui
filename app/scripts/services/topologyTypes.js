'use strict';

angular.module('cosmoUiApp')
    .service('topologyTypes', ['topologyTypesValues', 'topologyNetworkValues', 'topologyConnectionsValues', function topologyTypes(topologyTypesValues, topologyNetworkValues, topologyConnectionsValues) {

        this.getList = function() {
            return topologyTypesValues;
        };

        this.isNetworkNode = function(node) {
            if (!node) {
                return;
            }

            var searchExp = new RegExp(topologyNetworkValues.join('|'), 'gi');
            return searchExp.test(node.type);
        };

        this.isValidConnection = function(node) {
            if (!node) {
                return;
            }

            var searchExp = new RegExp(topologyConnectionsValues.join('|'), 'gi');
            return searchExp.test(node.type);
        };

        this.isHostNode = function(typeHierarchy) {
            return typeHierarchy.indexOf('cloudify-nodes-Compute') > 0;
        };

        this.isAppNode = function(typeHierarchy) {
            return typeHierarchy.indexOf('cloudify-nodes-ApplicationModule') > 0;
        };

    }]);