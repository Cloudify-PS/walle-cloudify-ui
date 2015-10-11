'use strict';

describe('Directive: bpTopologyNodes', function () {


    var element,
        isolatedScope,
        scope;
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'templates-main'));

    function compileDirective(opts) {
        return inject(function($compile, $rootScope) {
            if (!opts || !opts.scope) {
                scope = $rootScope.$new();
            } else {
                scope = opts.scope;
            }
            element = $compile(angular.element('<div bp-topology-nodes map="map"></div>'))(scope);
            scope.$digest();
            isolatedScope = element.isolateScope();
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

        describe('#shouldShowBadge', function(){
            beforeEach(compileDirective());

            it('should return true if in progress', function(){
                expect( isolatedScope.shouldShowBadge()).toBe(false);
                isolatedScope.inProgress = true;
                expect( isolatedScope.shouldShowBadge()).toBe(true);

            });

            it('should return true if there is an initialized node instance', function(){
                isolatedScope.nodeInstances = { 'foo' : [{ state: 'started' }] };
                expect(isolatedScope.shouldShowBadge({id:'foo'})).toBe(true);
                isolatedScope.nodeInstances = { 'foo' : [{ state: 'uninitialized' }] };
                expect(isolatedScope.shouldShowBadge({id:'foo'})).toBe(false);
            });
        });



        describe('icons on topology', function(){ //  todo : not sure what these tests actually check.. need to fine tune them.
            it('should have a cloudify-nodes-Root class', inject(function($rootScope) {
                var _scope = $rootScope.$new();
                _scope.map = [{ 'id' : '' , 'class' : 'cloudify-nodes-Root'}];
                compileDirective({scope: _scope});

                expect(element.find('i.gs-node-icon').hasClass('cloudify-nodes-Root')).toBe(true);
            }));

            it('should have a cloudify-nodes-Volume class on volume node', inject(function($rootScope) {
                var _scope = $rootScope.$new();
                _scope.map = [{ 'id' : '' , 'class' : 'cloudify-nodes-Root cloudify-nodes-Volume'}];
                compileDirective({scope: _scope});

                expect(element.find('i.gs-node-icon.topology-glyph.cloudify-nodes-Root.cloudify-nodes-Volume').length).toBe(1);
            }));

            it('should have a cloudify-nodes-FileSystem class on filesystem node', inject(function($rootScope) {
                var _scope = $rootScope.$new();
                _scope.map = [{ 'id' : '' , 'class' : 'cloudify-nodes-Root cloudify-nodes-FileSystem'}];
                compileDirective({scope: _scope});

                expect(element.find('i.gs-node-icon.topology-glyph.cloudify-nodes-Root.cloudify-nodes-FileSystem').length).toBe(1);
            }));
        });

    });
});
