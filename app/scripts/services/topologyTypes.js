'use strict';

angular.module('cosmoUiApp')
    .service('topologyTypes', function topologyTypes() {

        // TODO: 3.2 - Add method to check if specific node should be ignored in topology (instead of _isIgnoreNode in NodeService)
        // TODO: 3.2 - Add method to check if specific node is app node (instead of _isAppNode in NodeService)
        var types = {
            'cloudify.nodes.Root': {
                icon: 'cloudify-nodes-Root'
            },
            'cloudify.nodes.Compute': {
                icon: 'cloudify-nodes-Root cloudify-nodes-Compute'
            },
            'cloudify.nodes.SoftwareComponent': {
                icon: 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent'
            },
            'cloudify.nodes.WebServer': {
                icon: 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-WebServer'
            },
            'cloudify.nodes.ApplicationServer': {
                icon: 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-ApplicationServer'
            },
            'cloudify.nodes.DBMS': {
                icon: 'cloudify-nodes-Root cloudify-nodes-SoftwareComponent cloudify-nodes-DBMS'
            },
            'cloudify.nodes.ApplicationModule': {
                icon: 'cloudify-nodes-Root cloudify-nodes-ApplicationModule'
            },
            'cloudify.nodes.Port': {
                icon: 'cloudify-nodes-Root cloudify-nodes-Port'
            },
            'cloudify.nodes.Network': {
                icon: 'cloudify-nodes-Root cloudify-nodes-Network'
            },
            'cloudify.nodes.Subnet': {
                icon: 'cloudify-nodes-Root cloudify-nodes-Subnet'
            },
            'cloudify.nodes.Router': {
                icon: 'cloudify-nodes-Root cloudify-nodes-Router'
            },
            'cloudify.nodes.LoadBalancer': {
                icon: 'cloudify-nodes-Root cloudify-nodes-LoadBalancer'
            },
            'cloudify.nodes.VirtualIP': {
                icon: 'cloudify-nodes-Root cloudify-nodes-VirtualIP'
            },
            'cloudify.nodes.SecurityGroup': {
                icon: 'cloudify-nodes-Root cloudify-nodes-SecurityGroup'
            },
            'cloudify.nodes.Tier': {
                icon: 'cloudify-nodes-Root cloudify-nodes-Tier'
            },
            'cloudify.nodes.ObjectStorage': {
                icon: 'cloudify-nodes-Root cloudify-nodes-ObjectStorage'
            },
            'cloudify.nodes.MessageBusServer': {
                icon: 'cloudify-nodes-Root cloudify-nodes-MessageBusServer'
            }
        };

        this.getList = function() {
            return types;
        };

    });
