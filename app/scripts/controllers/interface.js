'use strict';

angular.module('cosmoUi')
    .controller('InterfaceCtrl', function ($scope, BreadcrumbsService, topologyTypes, EventsMap) {

        /**
         * Breadcrumbs
         */
        BreadcrumbsService.push('interface', {
            href: '#/interface',
            i18nKey: 'breadcrumb.interface',
            id: 'interface'
        });

        $scope.typesList = topologyTypes.getList();

        $scope.eventsList = EventsMap.getEventsList();

    });
