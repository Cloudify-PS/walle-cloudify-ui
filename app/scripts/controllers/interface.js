'use strict';

angular.module('cosmoUiApp')
    .controller('InterfaceCtrl', function ($scope, BreadcrumbsService, TopologyTypes, EventsMap, nodeStatus) {

        /**
         * Breadcrumbs
         */
        BreadcrumbsService.push('interface', {
            href: '#/interface',
            i18nKey: 'breadcrumb.interface',
            id: 'interface'
        });

        $scope.typesList = TopologyTypes.getList();

        $scope.eventsList = EventsMap.getEventsList();

        $scope.nodeStatusList = nodeStatus.getStatuses();

        $scope.getIconClass = nodeStatus.getIconClass;

        $scope.getBadgeStatusAndIcon = function(status, data) {
            return data + ' ' + nodeStatus.getIconClass(status);
        }

    });
