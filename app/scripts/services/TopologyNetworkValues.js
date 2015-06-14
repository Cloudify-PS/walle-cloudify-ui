'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.TopologyNetworkValues
 * @description
 * # TopologyNetworkValues
 * Constant in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .constant('TopologyNetworkValues', [
        'cloudify-nodes-FloatingIP',
        'cloudify-nodes-VirtualIP',
        'cloudify-nodes-Network',
        'cloudify-nodes-Port',
        'cloudify-nodes-Subnet',
        'cloudify-nodes-Router'
    ]);
