'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $cookieStore, BreadcrumbsService, $log, ngDialog, cloudifyClient) {
        $scope.lastExecutedPlan = null;
        $scope.selectedBlueprint = null;
        $scope.managerError = false;
        var _dialog = null;
        $scope.itemToDelete = null;

        BreadcrumbsService.push('blueprints',
            {
                href: '#/blueprints',
                i18nKey: 'breadcrumb.blueprints',
                id: 'blueprints'
            });

        $scope.redirectTo = function (blueprint) {
            $location.path('/blueprint/' + blueprint.id + '/topology');
        };

        $scope.openAddDialog = function() {
            if (_isDialogOpen()) {
                return;
            }
            _dialog = ngDialog.open({
                template: 'views/dialogs/upload.html',
                controller: 'FileSelectionDialogCtrl',
                scope: $scope,
                className: 'upload-dialog'
            });
        };

        $scope.openDeployDialog = function(blueprint) {
            _dialog = ngDialog.open({
                template: 'views/dialogs/deploy.html',
                controller: 'DeployDialogCtrl',
                scope: $scope,
                className: 'deploy-dialog'
            });

            cloudifyClient.blueprints.get(blueprint.id, null).then(function(result){
                $scope.selectedBlueprint = result.data || null;

            }); // todo: add error handling
        };

        $scope.openDeleteDialog = function() {
            if (_isDialogOpen()) {
                return;
            }
            _dialog = ngDialog.open({
                template: 'views/dialogs/delete.html',
                controller: 'DeleteDialogCtrl',
                scope: $scope,
                className: 'delete-dialog'
            });
        };

        $scope.deleteBlueprint = function(blueprint) {
            $scope.itemToDelete = blueprint;
            $scope.openDeleteDialog();
        };

        function loadBlueprints() {
            $scope.blueprints = null;
            $scope.managerError = false;
            cloudifyClient.blueprints.list('id,updated_at,created_at').then(function (result) {

                if (result.data.length < 1) {
                    $scope.blueprints = [];
                } else {
                    $scope.blueprints = _.sortByOrder(result.data, ['updated_at'], [false]);
                }
            }, function (result) {
                $scope.managerError = result.data;
                $log.error('got error result', result.data);
            });
        }

        // blueprintID to deployment count map
        var deploymentsCount = {};
        function loadDeployments(){
            cloudifyClient.deployments.list('blueprint_id').then(function( result ){
                _.each(result.data, function( dep ){
                    $log.info( dep );
                    if ( !deploymentsCount.hasOwnProperty(dep.blueprint_id)){
                        deploymentsCount[dep.blueprint_id] = 0;
                    }
                    deploymentsCount[dep.blueprint_id]++;
                });
            }, function(/*result*/){
                // alert on error somewhere. todo.
            });
        }



        $scope.countDeployments = function(blueprint){
            return deploymentsCount.hasOwnProperty(blueprint.id) ? deploymentsCount[blueprint.id] : 0;
        };

        $scope.uploadDone = function(blueprint_id) {
            $scope.redirectTo({
                id: blueprint_id
            });
        };

        $scope.redirectToDeployments = function() {
            $location.path('/deployments');
        };

        $scope.redirectToDeployment = function(deployment_id) {
            $location.path('/deployment/' + deployment_id + '/topology');
        };


        function _isDialogOpen() {
            return _dialog !== null && ngDialog.isOpen(_dialog.id);
        }

        loadBlueprints();
        loadDeployments();
    });
