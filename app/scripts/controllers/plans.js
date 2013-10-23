'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render) {

//        yamlService.getFilesList('/', function(data) {
//            $scope.files = data;
//        });
        $scope.showFile = function (file) {
            console.log(file.name);
        };

        $scope.renderer = Render.Topology.D3;
        $scope.layouter = Layout.Topology.Tensor;
        $scope.graph = {
            'nodes': [
                {
                    'id': 0,
                    'name': 'Tier A',
                    'type': ['cloudify.tosca.types.tier']
                },
                {
                    'id': 1,
                    'name': 'Vagrant Host',
                    'type': ['cloudify.tosca.types.host']
                },
                {
                    'id': 2,
                    'name': 'Pickle DB',
                    'type': ['cloudify.tosca.types.db_server', 'cloudify.tosca.types.middleware_server']
                },
                {
                    'id': 3,
                    'name': 'Flask',
                    'type': ['cloudify.tosca.types.web_server', 'cloudify.tosca.types.middleware_server']
                    /*
                     },
                     {
                     'id': 3,
                     'name': 'Flask App',
                     'type': ['cloudify.tosca.types.app_module']
                     */
                    /*
                     },
                     {
                     'id': 5,
                     'name': 'network_b',
                     'type': ['cloudify.tosca.types.network']
                     },
                     {
                     'id': 6,
                     'name': 'tier',
                     'type': ['cloudify.tosca.types.tier']
                     */
                }
            ],
            'edges': [
                {
                    'type': 'contained_in',
                    'source': 1,
                    'target': 0
                },
                {
                    'type': 'contained_in',
                    'source': 2,
                    'target': 1
                },
                {
                    'type': 'contained_in',
                    'source': 3,
                    'target': 1
                },
                {
                    'type': 'connected_to',
                    'source': 1,
                    'target': 2
                }
            ]
        };

        $scope.showDirectory = function (directory) {
            console.log(directory.name);
            YamlService.getFilesList('/' + directory.name, function (data) {
                $scope.files = data;
            });
        };
    });
