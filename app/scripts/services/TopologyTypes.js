'use strict';

angular.module('cosmoUiApp')
    .service('TopologyTypes', function (TopologyTypesValues, TopologyNetworkValues, TopologyConnectionsValues) {

        this.getList = function() {
            return TopologyTypesValues;
        };

        this.isNetworkNode = function(node) {
            if (!node) {
                return;
            }

            var searchExp = new RegExp(TopologyNetworkValues.join('|'), 'gi');
            return searchExp.test(node.type);
        };

        this.isValidConnection = function(node) {
            if (!node) {
                return;
            }

            var searchExp = new RegExp(TopologyConnectionsValues.join('|'), 'gi');
            return searchExp.test(node.type);
        };

        this.isHostNode = function(typeHierarchy) {
            return typeHierarchy.indexOf('cloudify-nodes-Compute') > 0;
        };

        this.isAppNode = function(typeHierarchy) {
            return typeHierarchy.indexOf('cloudify-nodes-ApplicationModule') > 0;
        };

    });
