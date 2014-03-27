'use strict';

angular.module('cosmoUi')
    .service('Cosmotypesservice', function Cosmotypesservice() {
        var typeData = [
            {
                name: 'cloudify.openstack.server',
                baseType: 'host'
            },
            {
                name: 'cloudify.openstack.network',
                baseType: 'network'
            },
            {
                name: 'cloudify.openstack.subnet',
                baseType: 'subnet'
            },
            {
                name: 'cloudify.openstack.router',
                baseType: 'router'
            },
            {
                name: 'cloudify.openstack.virtual_ip',
                baseType: 'floating_ip'
            },
            {
                name: 'cloudify.openstack.security_group',
                baseType: 'security_group'
            },
            {
                name: 'cloudify.openstack.port',
                baseType: 'port'
            },
            {
                name: 'cloudify.types.bash.web_server',
                baseType: 'web_server'
            },
            {
                name: 'cloudify.types.bash.qpp_server',
                baseType: 'app_server'
            },
            {
                name: 'cloudify.types.bash.db_server',
                baseType: 'db_server'
            },
            {
                name: 'cloudify.types.bash.message_bus_server',
                baseType: 'message_bus_server'
            },
            {
                name: 'cloudify.types.bash.app_module',
                baseType: 'app_module'
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
