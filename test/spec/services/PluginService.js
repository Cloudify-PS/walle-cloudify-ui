'use strict';

describe('Service: PluginService', function() {
    var _PluginService;
    var _cloudifyClient;
    var _$rootScope;
    var _ngDialog;
    var _window;
    var _$q;

    // load the service's module
    beforeEach(module('cosmoUiApp', 'backend-mock'));

    beforeEach(inject(function(PluginService, cloudifyClient, $rootScope, ngDialog, $window, $q) {
        _PluginService = PluginService;
        _cloudifyClient = cloudifyClient;
        _$rootScope = $rootScope;
        _ngDialog = ngDialog;
        _window = $window;
        _$q = $q;
    }));

    it('should exist and have its api', function() {
        expect(_PluginService).toBeDefined();
        expect(typeof _PluginService.downloadPlugin).toBe('function');
        expect(typeof _PluginService.uploadPlugin).toBe('function');
        expect(typeof _PluginService.actions.download.task).toBe('function');
        expect(typeof _PluginService.actions.delete.task).toBe('function');
    });

    describe('#downloadPlugin', function() {
        var plugin;

        beforeEach(function() {
            plugin = {id: 'plugin1'};
            spyOn(_cloudifyClient.plugins, 'download').and.returnValue(
                window.mockPromise({
                    config: {
                        url: 'url/to/plugin'}})
            );
            spyOn(_window, 'open').and.stub();
        });

        it('should download plugin', function() {
            _PluginService.downloadPlugin(plugin);

            expect(_cloudifyClient.plugins.download).toHaveBeenCalledWith('plugin1');
            expect(_window.open).toHaveBeenCalledWith('url/to/plugin', '_self');
        });
    });

    describe('#uploadPlugin', function() {
        beforeEach(function() {
            spyOn(_ngDialog, 'closeAll').and.stub();
            spyOn(_ngDialog, 'openConfirm').and.stub();
        });

        it('should not send request if plugin id is missing', function() {
            _PluginService.uploadPlugin();

            expect(_ngDialog.closeAll).toHaveBeenCalled();
            expect(_ngDialog.openConfirm).toHaveBeenCalledWith({
                template: 'views/plugins/uploadPluginDialog.html',
                controller: 'UploadPluginDialogCtrl',
                className: 'upload-plugin-dialog'
            });
        });
    });
});
