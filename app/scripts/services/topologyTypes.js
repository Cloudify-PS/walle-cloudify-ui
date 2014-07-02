'use strict';

angular.module('cosmoUiApp')
    .service('topologyTypes', function topologyTypes() {

        var types = {
            'cloudify.types.base': {
                icon: 'cloudify-types-base'
            },
            'cloudify-types-host': {
                icon: 'cloudify-types-base cloudify-types-host'
            },
            'cloudify.types.middleware-server': {
                icon: 'cloudify-types-base cloudify-types-middleware-server'
            },
            'cloudify.types.web-server': {
                icon: 'cloudify-types-base cloudify-types-middleware-server cloudify-types-web-server'
            },
            'cloudify.types.app-server': {
                icon: 'cloudify-types-base cloudify-types-middleware-server cloudify-types-app-server'
            },
            'cloudify.types.db-server': {
                icon: 'cloudify-types-base cloudify-types-middleware-server cloudify-types-db-server'
            },
            'cloudify.types.app-module': {
                icon: 'cloudify-types-base cloudify-types-app-module'
            },
            'cloudify.types.floatingip': {
                icon: 'cloudify-types-base cloudify-types-floatingip'
            },
            'cloudify.types.port': {
                icon: 'cloudify-types-base cloudify-types-port'
            },
            'cloudify.types.network': {
                icon: 'cloudify-types-base cloudify-types-network'
            },
            'cloudify.types.subnet': {
                icon: 'cloudify-types-base cloudify-types-subnet'
            },
            'cloudify.types.server': {
                icon: 'cloudify-types-base cloudify-types-server'
            },
            'cloudify.types.router': {
                icon: 'cloudify-types-base cloudify-types-router'
            },
            'cloudify.types.load_balancer': {
                icon: 'cloudify-types-base cloudify-types-load-balancer'
            },
            'cloudify.types.virtual_ip': {
                icon: 'cloudify-types-base cloudify-types-virtual-ip'
            },
            'cloudify.types.security_group': {
                icon: 'cloudify-types-base cloudify-types-security-group'
            },
            'cloudify.types.tier': {
                icon: 'cloudify-types-base cloudify-types-tier'
            },
            'cloudify.types.object_container': {
                icon: 'cloudify-types-base cloudify-types-object-container'
            },
            'cloudify.types.message_bus_server': {
                icon: 'cloudify-types-base cloudify-types-message-bus-server'
            }
        };

        this.getList = function() {
            return types;
        };

    });
