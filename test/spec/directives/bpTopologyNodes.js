'use strict';

describe('Directive: bpTopologyNodes', function () {

    var _nodesTree = [];

    var element, scope;
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    function compileDirective(opts) {
        inject(function($compile, $rootScope) {
            if (!opts || !opts.scope) {
                scope = $rootScope.$new();
            } else {
                scope = opts.scope;
            }
            element = $compile(angular.element('<div bp-topology-nodes map="map"></div>'))(scope);

            scope.$digest();
        });
    }

    describe('Directive tests', function() {
        it('should create an element with getBadgeStatus function', function() {
            compileDirective();
            expect(typeof(element.isolateScope().getBadgeStatus)).toBe('function');
        });

        it('should return the badge status by its status id using the getBadgeStatus function', inject(function( NodeService ) {
            compileDirective();
            spyOn(NodeService.status,'getBadgeStatus');
            element.isolateScope().inProgress = 'bar';
            element.isolateScope().nodeInstances = { 'foo' : 'fooInstances' };
            element.isolateScope().getBadgeStatus({ 'id' : 'foo'});

            expect( NodeService.status.getBadgeStatus).toHaveBeenCalledWith( 'bar', 'fooInstances' );

        }));

        it('should return type class using the getTypeClass method', function() {
            compileDirective();
            expect(element.isolateScope().getTypeClass('MyType')).toBe('cloudify-nodes-MyType');
        });

        it('should not have cloudify-types-base class', function() {
            expect(element.find('i.gs-node-icon').hasClass('cloudify-types-base')).toBe(false);
        });

        xit('should have a cloudify-nodes-Root class', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.map = _nodesTree;
            compileDirective({scope: _scope});

            expect(element.find('i.gs-node-icon').hasClass('cloudify-nodes-Root')).toBe(true);
        }));

        xit('should have a cloudify-nodes-Volume class on volume node', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.map = _nodesTree;
            compileDirective({scope: _scope});

            expect(element.find('i.gs-node-icon.topology-glyph.cloudify-nodes-Root.cloudify-nodes-Volume').length).toBe(1);
        }));

        xit('should have a cloudify-nodes-FileSystem class on filesystem node', inject(function($rootScope) {
            var _scope = $rootScope.$new();
            _scope.map = _nodesTree;
            compileDirective({scope: _scope});

            expect(element.find('i.gs-node-icon.topology-glyph.cloudify-nodes-Root.cloudify-nodes-FileSystem').length).toBe(1);
        }));
    });
});
