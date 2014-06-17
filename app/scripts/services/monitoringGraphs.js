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
            if(currnetGraph && graph.hasOwnProperty('query') && graph.query !== '') {
                RestService.influxQuery({query: graph.query})
                    .then(function(data){
                        _clearSequenceNumber(data[0].points);
                        currnetGraph.data = [{
                            key: data[0].name,
                            values: data[0].points
                        }];
                    });
            }
            else {
                currnetGraph.data = [{
                    values: []
                }];
            }
        }

        function _clearSequenceNumber(data) {
            for(var i in data) {
                data[i].splice(1, 1);
            }
        }

        function _getDirective(data, graph) {
            var currnetGraph = data[data.indexOf(graph)];
            currnetGraph.directive = ('<a class="close fa fa-times" ng-click="deleteGraph(graph)"></a><div ' + graph.type + ' ' + _setProperties(graph.properties).join(' ') + '></div>');
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
