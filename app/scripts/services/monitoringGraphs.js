'use strict';

angular.module('cosmoUi')
    .service('monitoringGraphs', function monitoringGraphs(RestService) {

        var defaults = {
            'nvd3-line-with-focus-chart': {
                'height': '400',
                'height2': '50',
                'showLegend': 'false',
                'tooltips': 'true',
                'interactive': 'true',
                'isArea': 'false',
                'interpolate': 'basis',
                'objectequality': 'true'
            }
        };

        function _addGraph(data, graph) {
            if(graph.hasOwnProperty('type') && defaults.hasOwnProperty(graph.type)) {
                for(var p in defaults[graph.type]) {
                    var property = defaults[graph.type][p];
                    if(!graph.properties.hasOwnProperty(p)) {
                        graph.properties[p] = property;
                    }
                }
            }
            data.push(graph);
        }

        function _executeQuery(data, graph) {
            var currnetGraph = data[data.indexOf(graph)];
            if(currnetGraph && graph.hasOwnProperty('query')) {
                switch(graph.query) {
                case 'CPU':
                    RestService.getMonitorCpu()
                        .then(function(data){
                            currnetGraph.data = data;
                        });
                    break;
                case 'Memory':
                    RestService.getMonitorMemory()
                        .then(function(data){
                            currnetGraph.data = data;
                        });
                    break;
                }
            }
        }

        function _getDirective(data, graph) {
            var currnetGraph = data[data.indexOf(graph)];
            currnetGraph.directive = ('<div ' + graph.type + ' ' + _setProperties(graph.properties).join(' ') + '></div>');
        }

        function _setProperties(properties) {
            var attrs = [];
            for(var i in properties) {
                var property = properties[i];
                attrs.push(i + '="' + property + '"');
            }
            return attrs;
        }


        function _getPaginationByData(pages, data, perPage) {
            var numOfPages = Math.floor(data.length / perPage);

            for(var i = pages.length; i <= numOfPages; i++) {
                pages.push({
                    'from': i * perPage,
                    'to': i * perPage + perPage
                });
            }

            return pages;
        }

        this.addGraph = _addGraph;
        this.executeQuery = _executeQuery;
        this.getDirective = _getDirective;
        this.getPaginationByData = _getPaginationByData;

    });
