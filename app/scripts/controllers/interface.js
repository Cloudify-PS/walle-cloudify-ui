'use strict';

angular.module('cosmoUiApp')
    .controller('InterfaceCtrl', function ($scope, TopologyTypes, EventsMap, nodeStatus) {

        $scope.typesList = TopologyTypes.getList();

        $scope.eventsList = EventsMap.getEventsList();

        $scope.nodeStatusList = nodeStatus.getStatuses();

        $scope.getIconClass = nodeStatus.getIconClass;

        $scope.getBadgeStatusAndIcon = function (status, data) {
            return data + ' ' + nodeStatus.getIconClass(status);
        };

    });
