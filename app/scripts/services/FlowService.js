'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.FlowService
 * @description
 * # FlowService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
  .service('FlowService', function (cloudifyClient, TickerSrv, $q) {
      this.deployAndExecute = function(blueprintName, deploymentName, inputs, workflowId){
          var deferred = $q.defer();

          function executeFailed(response){
              deferred.reject({failed: 'executing', response: response});
          }

          function executeDeployment(){
              cloudifyClient.executions.start(deploymentName, workflowId)
                  .then(function(){
                      deferred.resolve();
                  }, executeFailed);
          }

          function pollingInitializationStatusFailed(response){
              TickerSrv.unregister('FlowService/pollExecutions');
              deferred.reject({failed: 'getInitializeStatus', response: response});
          }

          function waitForInitialization(){
              TickerSrv.register('FlowService/pollExecutions', function(){
                  return cloudifyClient.executions.list({deployment_id: deploymentName, workflow_id: 'create_deployment_environment'})
                      .then(function(response){
                          var execution = response.data.items[0];
                          var executionStatus = execution.status;
                          if(executionStatus === 'terminated'){
                              TickerSrv.unregister('FlowService/pollExecutions');
                              executeDeployment();
                          }
                          if(executionStatus === 'cancelled' || executionStatus === 'failed'){
                              TickerSrv.unregister('FlowService/pollExecutions');
                              deferred.reject({failed: 'initializing', execution: execution});
                          }
                      }, pollingInitializationStatusFailed);
              },500);
          }

          function deployFailed(response){
              deferred.reject({failed: 'deploying', response: response});
          }

          cloudifyClient.deployments.create(blueprintName, deploymentName, inputs)
              .then(waitForInitialization, deployFailed);

          return deferred.promise;
      };
  });
