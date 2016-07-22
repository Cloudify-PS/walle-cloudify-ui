'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:imageBakeryWizard
 * @description
 * # imageBakeryWizard
 */
angular.module('cosmoUiApp')
  .directive('imageBakeryWizard', function (cloudifyClient, hotkeys, LoginService, FlowService, $rootScope, $timeout, $state) {
      return {
          templateUrl: 'views/directives/imageBakeryWizard.html',
          restrict: 'E',
          scope: {},
          controller: function($scope){
              // formRawParams set error null before link
              $scope.setError = function(error){
                  $scope.error = error;
              };
          },
          link: function postLink(scope) {
              var removeStateListener;
              function openWizard(managerContext){
                  hotkeys.pause();
                  removeStateListener = $rootScope.$on('$stateChangeStart', function(event) {
                      event.preventDefault();
                  });
                  scope.showWizard = true;
                  scope.panelIndex = 1;
                  if(managerContext){
                      scope.inputs = managerContext.inputs;
                      scope.title = managerContext.title;
                  }
              }
              function closeWizard(){
                  hotkeys.unpause();
                  removeStateListener();
                  scope.showWizard = false;
              }
              scope.closeFailedWizard = function(){
                  closeWizard();
                  $state.go('cloudifyLayout.logs');
              };
              scope.closeCompletedWizard = function(){
                  var settingsDeployment = managerConf.settingsDeployment || localStorage.getItem('settingsDeployment');
                  localStorage.removeItem('imageBakerySucceed');
                  localStorage.removeItem('settingsDeployment');
                  cloudifyClient.providerContext.update('provider', {cloudify: {manager_configuration: {completed: false}}})
                      .then(null, function(response){
                          console.log('Failed marking wizard as complete, error:',response);
                      });
                  closeWizard();
                  $state.go('cloudifyLayout.deploymentLayout.inputsOutputs', {deploymentId: settingsDeployment});
              };
              scope.configure = function(){
                  function startConfigureSucceed() {
                      function finishSetup(immediately){
                          var isLoggedIn;
                          var delay = 55000;
                          if(immediately){
                              delay = 0;
                          }
                          LoginService.isLoggedIn().then(function(response){
                              isLoggedIn = response.data.result;
                          });
                          $timeout(function(){
                              cloudifyClient.providerContext.update('provider', {cloudify: {manager_configuration: {completed: true, settingsDeployment: deploymentName}}}).then(null, function(){
                                  localStorage.setItem('imageBakerySucceed', true);
                                  localStorage.setItem('settingsDeployment', deploymentName);
                              });
                              isLoggedIn && LoginService.logout(true);
                              scope.countdown = {
                                  value: 15
                              };
                              scope.registerTickerTask('imageBakeryWizard/countdown', function () {
                                  scope.countdown.value > 0 && scope.countdown.value--;
                                  return Promise.resolve();
                              }, 1000);
                              scope.unregisterTickerTask('imageBakeryWizard/timer');
                              $timeout(function(){
                                  if(isLoggedIn) {
                                      removeStateListener();
                                      $state.go('login');
                                  }
                                  location.reload();
                              },scope.countdown.value * 1000);
                          },delay);
                      }
                      function pollConfigureStatus(){
                          function stopPolling(){
                              scope.unregisterTickerTask('imageBakeryWizard/pollEvents');
                              scope.unregisterTickerTask('imageBakeryWizard/pollExecutions');
                          }
                          //look for the message of 60 seconds delay before services restart
                          scope.registerTickerTask('imageBakeryWizard/pollEvents', function(){
                              return cloudifyClient.events.get({deployment_id: deploymentName, 'message.text': 'Sleeping for 60 seconds'})
                                  .then(function(response){
                                      if(response.data.items.length > 0){
                                          stopPolling();
                                          if(!scope.setupFailed){
                                              finishSetup();
                                          }
                                      }
                                  });
                          },1000);
                          //make sure execution is still running and not failed
                          scope.registerTickerTask('imageBakeryWizard/pollExecutions', function(){
                              return cloudifyClient.executions.list({deployment_id: deploymentName, workflow_id: 'install'})
                                  .then(function(response){
                                      var execution = response.data.items[0];
                                      if(execution.status === 'failed' || execution.status === 'cancelled'){
                                          stopPolling();
                                          scope.unregisterTickerTask('imageBakeryWizard/timer');
                                          $timeout.cancel(timeout);
                                          scope.setupFailed = true;
                                      }
                                      if(execution.status === 'terminated'){
                                          stopPolling();
                                          finishSetup(true);
                                      }
                                  });
                          },1000);

                          var timeout = $timeout(function(){
                              //should not take more then a few minutes, aborting after 15
                              stopPolling();
                              scope.setupFailed = true;
                          },15 * 60000);
                      }
                      cloudifyClient.providerContext.update('provider', {cloudify: {manager_configuration: {enabled: false}}})
                          .then(pollConfigureStatus, function(){});
                  }
                  function startConfigureFailed(data){
                      console.log('configureFailed: ', data);
                  }
                  var blueprintName = 'CloudifySettings';
                  var deploymentName = blueprintName+Date.now();
                  var workflowId = 'install';
                  scope.panelIndex++;
                  scope.timer = 0;
                  scope.registerTickerTask('imageBakeryWizard/timer', function () {
                      scope.timer++;
                      return Promise.resolve();
                  },1000);
                  FlowService.deployAndExecute(blueprintName, deploymentName, scope.rawString ? JSON.parse(scope.rawString) : null, workflowId)
                      .then(startConfigureSucceed, startConfigureFailed);
              };

              var managerConf;
              (function shouldBakeImage(){
                  function requestSucceed(response){
                      managerConf = response.data.context.cloudify.manager_configuration;
                      var shouldBake = managerConf.enabled;
                      if(shouldBake){
                          openWizard(response.data.context.cloudify.manager_configuration);
                      }else{
                          scope.isCompleted = response.data.context.cloudify.manager_configuration.completed || localStorage.getItem('imageBakerySucceed');
                          if(scope.isCompleted){
                              openWizard();
                          }
                      }
                  }
                  function requestFailed(response){
                      console.log('Failed checking for image bakery wizard, error:',response);
                  }
                  cloudifyClient.providerContext.get().then(requestSucceed, requestFailed);
              })();
          }
      };
  });
