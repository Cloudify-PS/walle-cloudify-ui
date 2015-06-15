'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.TopologyConnectionsValues
 * @description
 * # TopologyConnectionsValues
 * Constant in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .constant('TopologyConnectionsValues', [
        'cloudify-nodes-FloatingIp',
        'cloudify-nodes-VirtualIp',
        'cloudify-nodes-KeyPair',
        'cloudify-nodes-SecurityGroup'
    ]);
