'use strict';

angular.module('cosmoUi')
    .service('d3Networks', function d3Networks() {

        var topology = {};

        this.addNetwork = function (data) {
            if (!topology.hasOwnProperty('networks')) {
                topology.networks = {};
            }
            topology.networks[data.name] = data;
        };

        this.addSubnet = function (data) {
            if (!topology.hasOwnProperty('subnets')) {
                topology.subnets = {};
            }
            topology.subnets[data.name] = data;
            if (data.hasOwnProperty('relationships')) {
                for (var i = 0; i < data.relationships.length; i++) {
                    addRouterRelationships(data.name, data.relationships[i]);
                }
            }
        };

        this.addRouter = function (data) {
            if (!topology.hasOwnProperty('router')) {
                topology.router = {};
            }
            topology.router[data.name] = data;
        };

        function addRouterRelationships(source, data) {
            if (!topology.hasOwnProperty('relationships')) {
                topology.relationships = {};
            }
            if (!topology.relationships.hasOwnProperty(data.type)) {
                topology.relationships[data.type] = [];
            }
            topology.relationships[data.type].push({
                source: source,
                target: data.target
            });
        }
    });
