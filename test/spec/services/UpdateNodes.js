'use strict';

describe('Service: NodeSearchService', function () {

    var UpdateNodes, _updateNodesInstance;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {

            // Load the app module
            module('cosmoUiApp', 'gsUiHelper');

            // Initialize a new instance of NodeSearchService
            inject(function (_UpdateNodes_, $helper) {
                $helper.addInjects([
                    {
                        url: '/backend/nodes',
                        respond: 200
                    },
                    {
                        url: '/backend/deployments/nodes',
                        respond: 200
                    }
                ]);
                UpdateNodes = _UpdateNodes_;
                _updateNodesInstance = UpdateNodes.newInstance()
            });

        });
    });

    describe('Unit tests', function() {

        it('should create a new UpdateNodes object', function() {
            expect(UpdateNodes).not.toBeUndefined();
        });

        it('should create a UpdateNodes instance', function() {
            expect(_updateNodesInstance).not.toBeUndefined();
        });

        it('should check if runUpdate exist', function() {
            expect(_updateNodesInstance.runUpdate).not.toBeUndefined();
        });

    });

});
