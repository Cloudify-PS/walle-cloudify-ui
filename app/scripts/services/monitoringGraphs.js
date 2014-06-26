'use strict';

angular.module('cosmoUiApp')
    .service('monitoringGraphs', function monitoringGraphs(RestService) {

        var defaults = {
            'nvd3-line-with-focus-chart': {
                'height': '400',
                'height2': '50',
                'showLegend': 'true',
                'tooltips': 'true',
                'interactive': 'true',
                'isArea': 'false',
                'interpolate': 'basis',
                'objectequality': 'true'
            },
            'nvd3-multi-bar-chart': {
                'height': '400',
                'showLegend': 'true',
                'tooltips': 'true',
                'showXAxis': 'true',
                'showYAxis': 'true',
                'showControls': 'true'
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

        function _executeSingleQuery(query, dataBind) {
            if(query.trim() !== '') {
                RestService.influxQuery({query: query})
                    .then(function (data) {
                        for (var i in data) {
                            _clearSequenceNumber(data[i].points);
                            dataBind.push({
                                key: data[i].name,
                                values: data[i].points
                            });
                        }
                    });
            }
        }

        function _executeQuery(data, graph) {
            var currnetGraph = data[data.indexOf(graph)];
            if(currnetGraph && graph.hasOwnProperty('query') && graph.query !== '') {
                currnetGraph.data = [];
                var multipleQuerys = graph.query.split(',');
                for(var q in multipleQuerys) {
                    var query = multipleQuerys[q];
                    _executeSingleQuery(query, currnetGraph.data);
                }
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
