'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:deployments/deploymentLayoutCtrl
 * @description
 * # deployments/deploymentLayoutCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
  .controller('DeploymentLayoutCtrl', function ($scope, $state, nodeStatus, cloudifyClient, CloudifyService, ExecutionsService, $stateParams, HotkeysManager) {

      var url = $state.href($state.current).slice(1);

      $scope.deploymentId = $stateParams.deploymentId;

      // Set Navigation Menu - Need to set only after blueprint id available for source page href
      $scope.navMenu = [
          {'name': 'Topology', 'href': '/topology', default: true},
          {'name': 'Nodes', 'href': '/nodes'},
          {'name': 'Executions', 'href': '/executions'},
          {'name': 'Inputs & Outputs', 'href': '/inputs-outputs'},
          {'name': 'Source', 'href': '/source'},
          {'name': 'Monitoring', 'href': '/monitoring'}
      ];
      _.each($scope.navMenu, function (nm) {
          if ( $state.href($state.current).slice(1).indexOf(nm.href) >=0 ){
              nm.active = true;
          }
          nm.href = '#/deployment/' + $scope.deploymentId + nm.href;

      });

      // Get Deployment Data
      cloudifyClient.deployments.get($scope.deploymentId, 'blueprint_id, workflows')
          .then(function (result) {
              $scope.blueprintId = result.data.blueprint_id;
              $scope.deployment = result.data;
          }, function( result ){
              $scope.showDeploymentEvents = false;
              if ( result.status === 404 ){
                  $scope.deploymentNotFound = true;
              }else {
                  $scope.loadError = CloudifyService.getErrorMessage(result);
              }
          });

      function _loadExecutions() {
          if ( $scope.deploymentNotFound ){
              return { then: function(){} };
          }
          return cloudifyClient.executions.getRunningExecutions({deployment_id : $scope.deploymentId, _include: 'id,workflow_id,status'})
              .then(function (result) {
                  $scope.currentExecution = _.first(result.data.items);
              }, function() {});
      }


      $scope.isInitializing = function () {
          return $scope.currentExecution && $scope.currentExecution.workflow_id === 'create_deployment_environment';
      };

      $scope.goToDeployments = function() {
          if($state.href($state.current).slice(1).indexOf(url.split('/').slice(0, -1).join('/')) !== -1) {
              $state.go('cloudifyLayout.deployments');
          }
      };

      $scope.registerTickerTask('deploymentLayout/loadExecutions', _loadExecutions, 1000);

      $scope.setShowEventsWidget = function(isShow){
          $scope.showDeploymentEvents = isShow;
      };

      $scope.$on('$stateChangeStart', function(){
          $scope.showDeploymentEvents = false;
      });

      /// for tests

      $scope.loadExecutions = _loadExecutions;
      HotkeysManager.bindDeploymentActions($scope);
  });
