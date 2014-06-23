'use strict';

angular.module('cosmoUi')
    .service('topologyTypes', function topologyTypes() {

        var types = {
            'cloudify.types.base': {
                icon: 'cloudify-types-base'
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
            'cloudify.openstack.floatingip': {
                icon: 'cloudify-types-base cloudify-openstack-floatingip'
            },
            'cloudify.openstack.port': {
                icon: 'cloudify-types-base cloudify-openstack-port'
            },
            'cloudify.openstack.network': {
                icon: 'cloudify-types-base cloudify-openstack-network'
            },
            'cloudify.openstack.subnet': {
                icon: 'cloudify-types-base cloudify-openstack-subnet'
            },
            'cloudify.openstack.server': {
                icon: 'cloudify-types-base cloudify-openstack-server'
            },
            'cloudify.openstack.router': {
                icon: 'cloudify-types-base cloudify-openstack-router'
            },
            'cloudify.openstack.load_balancer': {
                icon: 'cloudify-types-base cloudify-openstack-load-balancer'
            },
            'cloudify.openstack.virtual_ip': {
                icon: 'cloudify-types-base cloudify-openstack-virtual-ip'
            },
            'cloudify.openstack.security_group': {
                icon: 'cloudify-types-base cloudify-openstack-security-group'
            },
            'cloudify.types.tier': {
                icon: 'cloudify-types-base cloudify.types.tier'
            },
            'cloudify.types.object_container': {
                icon: 'cloudify-types-base cloudify.types.object-container'
            },
            'cloudify.types.message_bus_server': {
                icon: 'cloudify-types-base cloudify.types.message-bus-server'
            }
        };

        this.getList = function() {
            return types;
        };

    });
