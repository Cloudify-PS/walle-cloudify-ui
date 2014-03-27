'use strict';

angular.module('cosmoUi')
    .service('Cosmotypesservice', function Cosmotypesservice() {
        var typeData = [
            {
                name: 'cloudify.openstack.server',
                baseType: 'host'
            },
            {
                name: 'server',
                baseType: 'host'
            },
            {
                name: 'cloudify.openstack.network',
                baseType: 'network'
            },
            {
                name: 'network',
                baseType: 'network'
            },
            {
                name: 'cloudify.openstack.subnet',
                baseType: 'subnet'
            },
            {
                name: 'subnet',
                baseType: 'subnet'
            },
            {
                name: 'cloudify.openstack.router',
                baseType: 'router'
            },
            {
                name: 'router',
                baseType: 'router'
            },
            {
                name: 'cloudify.openstack.virtual_ip',
                baseType: 'floating-ip'
            },
            {
                name: 'virtual_ip',
                baseType: 'floating-ip'
            },
            {
                name: 'cloudify.openstack.security_group',
                baseType: 'security-group'
            },
            {
                name: 'security_group',
                baseType: 'security-group'
            },
            {
                name: 'cloudify.openstack.port',
                baseType: 'port'
            },
            {
                name: 'port',
                baseType: 'port'
            },
            {
                name: 'cloudify.types.bash.web_server',
                baseType: 'web-server'
            },
            {
                name: 'web_server',
                baseType: 'web-server'
            },
            {
                name: 'cloudify.types.bash.qpp_server',
                baseType: 'app-server'
            },
            {
                name: 'qpp_server',
                baseType: 'app-server'
            },
            {
                name: 'cloudify.types.bash.db_server',
                baseType: 'db-server'
            },
            {
                name: 'db_server',
                baseType: 'db-server'
            },
            {
                name: 'cloudify.types.bash.message_bus_server',
                baseType: 'message-bus-server'
            },
            {
                name: 'message_bus_server',
                baseType: 'message-bus-server'
            },
            {
                name: 'cloudify.types.bash.app_module',
                baseType: 'app-module'
            },
            {
                name: 'app_module',
                baseType: 'app-module'
            }
        ];

        function _getTypeData(typeName) {
            for (var i = 0; i < typeData.length; i++) {
                if (typeData[i].name === typeName) {
                    return typeData[i];
                }
            }
            return {
                baseType: typeName,
                name: typeName
            };
        }

        this.getTypeData = _getTypeData;
    });
