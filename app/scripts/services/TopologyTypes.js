'use strict';

angular.module('cosmoUiApp')
    .service('TopologyTypes', function (TopologyTypesValues, TopologyNetworkValues, TopologyConnectionsValues, $log) {

        this.getList = function () {
            return TopologyTypesValues;
        };

        this.isNetworkNode = function (node) {
            try {
                if (!node) {
                    return;
                }

                var searchExp = new RegExp(TopologyNetworkValues.join('|'), 'gi');
                return searchExp.test(node.type_hierarchy.join(' '));
            } catch (e) {
                $log.error('could not check if node belongs to network', e);
                return false;
            }
        };

        this.isValidConnection = function (node) {
            try {
                if (!node) {
                    return;
                }

                var searchExp = new RegExp(TopologyConnectionsValues.join('|'), 'gi');
                return searchExp.test(node.type_hierarchy.join(' '));
            } catch (e) {
                $log.error('could not check if node is valid connection', e);
                return false;
            }
        };

        this.isHostNode = function (typeHierarchy) {
            return typeHierarchy.indexOf('cloudify-nodes-Compute') > 0;
        };

        this.isAppNode = function (typeHierarchy) {
            return typeHierarchy.indexOf('cloudify-nodes-ApplicationModule') > 0;
        };

    });
