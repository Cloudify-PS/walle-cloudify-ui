'use strict';

angular.module('cosmoUiApp')
    .service('topologyTypes', function topologyTypes() {

        var types = {
            'cloudify.nodes.Root': {
                icon: 'cloudify-types-base'
            },
            'cloudify.nodes.Compute': {
                icon: 'cloudify-types-base cloudify-types-host'
            },
            'cloudify.nodes.SoftwareComponent': {
                icon: 'cloudify-types-base cloudify-types-middleware-server'
            },
            'cloudify.nodes.WebServer': {
                icon: 'cloudify-types-base cloudify-types-middleware-server cloudify-types-web-server'
            },
            'cloudify.nodes.ApplicationServer': {
                icon: 'cloudify-types-base cloudify-types-middleware-server cloudify-types-app-server'
            },
            'cloudify.nodes.DBMS': {
                icon: 'cloudify-types-base cloudify-types-middleware-server cloudify-types-db-server'
            },
            'cloudify.nodes.ApplicationModule': {
                icon: 'cloudify-types-base cloudify-types-app-module'
            },
            'cloudify.nodes.Port': {
                icon: 'cloudify-types-base cloudify-types-port'
            },
            'cloudify.nodes.Network': {
                icon: 'cloudify-types-base cloudify-types-network'
            },
            'cloudify.nodes.Subnet': {
                icon: 'cloudify-types-base cloudify-types-subnet'
            },
            'cloudify.nodes.Router': {
                icon: 'cloudify-types-base cloudify-types-router'
            },
            'cloudify.nodes.LoadBalancer': {
                icon: 'cloudify-types-base cloudify-types-load-balancer'
            },
            'cloudify.nodes.VirtualIP': {
                icon: 'cloudify-types-base cloudify-types-virtual-ip'
            },
            'cloudify.nodes.SecurityGroup': {
                icon: 'cloudify-types-base cloudify-types-security-group'
            },
            'cloudify.nodes.Tier': {
                icon: 'cloudify-types-base cloudify-types-tier'
            },
            'cloudify.nodes.ObjectStorage': {
                icon: 'cloudify-types-base cloudify-types-object-container'
            },
            'cloudify.nodes.MessageBusServer': {
                icon: 'cloudify-types-base cloudify-types-message-bus-server'
            }
        };

        this.getList = function() {
            return types;
        };

    });
