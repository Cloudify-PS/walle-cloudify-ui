'use strict';

// todo : increase code coverage
describe('Directive: sectionNavMenu', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element, scope;
    var $compile, $rootScope;

    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        scope.items = [
            {href: '__url__', 'active': true, 'name': '__some_name__'},
            {href: 'foo', 'active': false, 'name': 'foo'},
            {href: 'bar', 'active': false, 'name': 'bar'}
        ];
    }));

    function setup(){
        element = angular.element('<div section-nav-menu="items" watch="watch"></div>');
        element = $compile(element)(scope);
        scope.$digest();
    }

    //<div class="buttons-group sections">
    //    <!-- ngRepeat: section in sections --><a data-ng-repeat="section in sections" href="__url__" data-ng-class="{ 'active' : section.active }" class="btn btn-default ng-binding ng-scope active">__some_name__</a><!-- end ngRepeat: section in sections --><a data-ng-repeat="section in sections" href="foo" data-ng-class="{ 'active' : section.active }" class="btn btn-default ng-binding ng-scope">bar</a><!-- end ngRepeat: section in sections -->
    //</div>

    it('should create link per section', inject(function () {
        setup();
        expect(element.find('[href=__url__]').length > 0).toBe(true);
        expect(element.find('[href=foo]').length > 0).toBe(true);
    }));

    it('should change active sections', function(){
        setup();
        element.isolateScope().setSectionActive(scope.items[2]);
        expect(scope.items[0].active).toBe(false);
        expect(scope.items[1].active).toBe(false);
        expect(scope.items[2].active).toBe(true);
        element.isolateScope().setSectionActive(scope.items[1]);
        expect(scope.items[0].active).toBe(false);
        expect(scope.items[1].active).toBe(true);
        expect(scope.items[2].active).toBe(false);
    });

    it('should watch state changes', function(){
        scope.watch = true;
        setup();

        $rootScope.$broadcast('$stateChangeSuccess', {url: 'bar'});
        expect(scope.items[0].active).toBe(false);
        expect(scope.items[1].active).toBe(false);
        expect(scope.items[2].active).toBe(true);

        scope.$destroy();

        $rootScope.$broadcast('$stateChangeSuccess', {url: 'foo'});
        expect(scope.items[0].active).toBe(false);
        expect(scope.items[1].active).toBe(false);
        expect(scope.items[2].active).toBe(true);
    });
});
