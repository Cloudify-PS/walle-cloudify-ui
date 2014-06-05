'use strict';

angular.module('cosmoUi')
    .service('Cosmotypesservice', function Cosmotypesservice() {

        var typeData = {
            'host': [
                'cloudify.openstack.server',
                'cloudify.types.server',
                'cloudify.types.host',
                'cloudify.types.middleware_server',
                'server',
                'vm_host',
                'host'
            ],
            'network': [
                'cloudify.openstack.network',
                'cloudify.types.network',
                'network'
            ],
            'subnet': [
                'cloudify.openstack.subnet',
                'cloudify.types.subnet',
                'subnet'
            ],
            'router': [
                'cloudify.openstack.router',
                'cloudify.types.router',
                'router'
            ],
            'floating-ip': [
                'cloudify.openstack.virtual_ip',
                'cloudify.types.virtual_ip',
                'cloudfiy.openstack.virtual_ip',
                'cloudfiy.types.virtual_ip',
                'cloudify.openstack.floatingip',
                'cloudify.types.floatingip',
                'cloudfiy.openstack.floatingip',
                'cloudfiy.types.floatingip',
                'virtual_ip',
                'floating-ip'
            ],
            'security-group': [
                'cloudify.openstack.security_group',
                'cloudify.types.security_group',
                'cloudfiy.openstack.security_group',
                'cloudfiy.types.security_group',
                'security_group',
                'security-group'
            ],
            'port': [
                'cloudify.openstack.port',
                'cloudify.types.port',
                'port'
            ],
            'web-server': [
                'cloudify.types.bash.web_server',
                'cloudify.openstack.web_server',
                'cloudify.types.web_server',
                'web_server',
                'web-server'
            ],
            'app-server': [
                'cloudify.types.bash.app_server',
                'cloudify.types.app_server',
                'app_server',
                'app-server'
            ],
            'db-server': [
                'cloudify.types.bash.db_server',
                'cloudify.types.db_server',
                'db_server',
                'db-server'
            ],
            'message-bus-server': [
                'cloudify.types.bash.message_bus_server',
                'cloudify.types.message_bus_server',
                'message_bus_server',
                'message-bus-server'
            ],
            'app-module': [
                'cloudify.types.bash.app_module',
                'cloudify.types.app_module',
                'app_module',
                'app-module'
            ],
            'load-balancer': [
                'cloudify.types.load_balancer',
                'load-balancer'
            ]
        };

        function _getTypeData(typeName) {
            for (var baseType in typeData) {
                var typesList = typeData[baseType];
                if(typesList.indexOf(typeName) !== -1) {
                    return {
                        baseType: baseType,
                        name: typeName,
                        icon: baseType
                    };
                }
            }
            return {
                baseType: typeName,
                name: typeName,
                icon: 'fa fa-cog'
            };
        }

        this.getTypeData = _getTypeData;
    });
