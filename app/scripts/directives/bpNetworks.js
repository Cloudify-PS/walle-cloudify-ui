'use strict';

angular.module('cosmoUi')
    .directive('bpNetworks', function (bpNetworkService) {
        return {
            restrict: 'A',
            link: function postLink($scope, $element) {

                var width = '100%',
                    height = '100%';

                var vis = d3.select($element[0]).append('svg:svg')
                    .attr('width', width)
                    .attr('height', height);

                var group = vis.append('g')
                    .attr('transform', 'translate(0, 0)');

                var diagonal = d3.svg.diagonal();

                function applyDiagonals(data) {
                    /* jshint validthis:true */
                    return diagonal.apply(this, [
                        {
                            source: {
                                x: data.source.x,
                                y: data.source.y
                            },
                            target: {
                                x: data.target.x,
                                y: data.target.y
                            }
                        }
                    ]);
                }

                function broadcastResize() {
                    $element.scope().$apply(function () {
                        bpNetworkService.render();
                    });
                }
                document.addEventListener('DOMContentLoaded', broadcastResize, false);
                window.onresize = broadcastResize;

                function draw(data) {
                    if (data) {
                        group.selectAll('path')
                            .remove();

                        group.selectAll('path')
                            .data(data)
                            .enter()
                            .append('path')
                            .attr('d', applyDiagonals)
                            .attr('fill', 'none')
                            .attr('stroke', function (d) {
                                return d.color;
                            })
                            .attr('stroke-width', '4px');
                    }
                }

                $scope.$on('coordinatesUpdated', function(e, data) {
                    if (data.length > 0) {
                        draw(data);
                    }
                });

                $scope.$watch(function() {
                    return $element.is(':visible');
                },
                function() {
                    bpNetworkService.render();
                });
            }
        };
    });

angular.module('cosmoUi')
    .directive('bpNetworkCoordinate', function (bpNetworkService) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function ($scope, $element, $attr, ngModel) {
                if (!ngModel) {
                    return;
                }

                ngModel.$render = function () {
                    var data = ngModel.$viewValue || false;
                    switch (data.type) {
                    case 'subnet':
                        $element.css('backgroundColor', data.color);
                        bpNetworkService.addSubnet(data.id, $element, data.color);
                        break;

                    case 'network':
                        $element.css('backgroundColor', data.color);
                        bpNetworkService.addNetwork(data.id, $element, data.color);
                        break;

                    case 'router':
                        $element.css('backgroundColor', data.color);
                        bpNetworkService.addRouter(data.id, $element);
                        break;

                    default:
                        bpNetworkService.addDevice(data.id, $element);
                        break;
                    }

                    $scope.$root.$broadcast('elementsUpdated');
                };
            }
        };
    });

angular.module('cosmoUi')
    .service('bpNetworkService', ['$rootScope', function($rootScope){

        var elements = {},
            coordinates = [],
            map = {};

        this.render = function () {
            _render();
        };

        $rootScope.$on('elementsUpdated', function() {
            _render();
        });

        $rootScope.$watch(function() {
            return coordinates;
        }, function () {
            $rootScope.$broadcast('coordinatesUpdated', coordinates);
        }, true);

        function _render() {
            var Coords = [];
            angular.forEach(map, function (relation) {
                if(!elements.hasOwnProperty(relation.source) || !elements.hasOwnProperty(relation.target)) {
                    return;
                }

                var from = elements[relation.source],
                    to = elements[relation.target],
                    height = to.element.outerHeight();

                Coords.push({
                    source: {
                        x: getAttachPoint(from.x, to.x, from.element),
                        y: to.y + (height / 2)
                    },
                    target: {
                        x: getAttachPoint(to.x, from.x, to.element),
                        y: to.y + (height / 2)
                    },
                    color: from.color !== undefined ? from.color : to.color
                });
            });
            angular.extend(coordinates, Coords);
        }

        function getAttachPoint(startPoint, endPoint, element) {
            var width = element.outerWidth(),
                pointPosition = startPoint - endPoint;

            if (pointPosition < 0) { // Target right
                return startPoint + width;
            }
            else { // Target left
                return startPoint;
            }
        }

        this.addDevice = function (id, element) {
            elements[id] = angular.extend(elementCoords(element), {
                'type': 'device'
            });
        };

        this.addRouter = function (id, element) {
            elements[id] = angular.extend(elementCoords(element), {
                'type': 'router'
            });
        };

        this.addSubnet = function (id, element, color) {
            elements[id] = angular.extend(elementCoords(element), {
                'color': color || 'silver',
                'type': 'subnet'
            });
        };

        this.addNetwork = function (id, element, color) {
            elements[id] = angular.extend(elementCoords(element), {
                'color': color || 'silver',
                'type': 'network'
            });
        };

        function elementCoords(element) {
            return {
                'x': element.offset().left - element.parents('.networksContainer').offset().left,
                'y': element.offset().top - element.parents('.networksContainer').offset().top,
                'element': element
            };
        }

        this.setMap = function (data) {
            map = data;
//            elements = {};
            coordinates = [];
        };

        this.getCoordinates = function () {
            return coordinates;
        };

    }]);