'use strict';

angular.module('cosmoUiApp')
    .factory('PluginService', function(cloudifyClient, $window, $q, ngDialog) {
        var PluginService = {};

        PluginService.downloadPlugin = downloadPlugin;
        PluginService.deletePlugin = deletePlugin;
        PluginService.uploadPlugin = uploadPlugin;

        PluginService.actions = {
            download: {
                name: 'download',
                task: downloadPlugin
            },
            delete: {
                name: 'delete',
                task: deletePlugin
            }
        };

        return PluginService;

        /**
         * Makes a rest api call to get plugin archive file and opens a window to save the file
         * @param plugin
         * @returns {Promise}
         */
        function downloadPlugin(plugin) {
            return cloudifyClient.plugins.download(plugin.id)
                .then(function(response) {
                    $window.open(response.config.url, '_self');
                });
        }

        /**
         * Opens delete plugin dialog, if confirmed makes a rest api call to delete the plugin
         * @param plugin
         * @returns {Promise}
         */
        function deletePlugin(plugin) {
            ngDialog.closeAll();
            return ngDialog
                .openConfirm({
                    template: 'views/plugins/deleteDialog.html',
                    className: 'delete-dialog',
                    data: plugin
                })
                .then(function() {
                    return cloudifyClient.plugins.delete(plugin.id);
                });
        }

        /**
         * Opens Upload Plugin dialog which has it's own upload logic
         * @returns {Promise}
         */
        function uploadPlugin() {
            ngDialog.closeAll();
            return ngDialog.openConfirm({
                template: 'views/plugins/uploadPluginDialog.html',
                controller: 'UploadPluginDialogCtrl',
                className: 'upload-plugin-dialog'
            });
        }
    });
