'use strict';

// todo : increase code coverage
describe('Directive: sectionNavMenu', function () {

    // load the directive's module
    beforeEach(module('cosmoUiApp', 'backend-mock', 'templates-main'));

    var element;
    var scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.items = [
            {href: '__url__', 'active': true, 'name': '__some_name__'},
            {href: 'foo', 'active': false, 'name': 'bar'}
        ];
        element = angular.element('<div section-nav-menu="items"></div>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    //<div class="buttons-group sections">
    //    <!-- ngRepeat: section in sections --><a data-ng-repeat="section in sections" href="__url__" data-ng-class="{ 'active' : section.active }" class="btn btn-default ng-binding ng-scope active">__some_name__</a><!-- end ngRepeat: section in sections --><a data-ng-repeat="section in sections" href="foo" data-ng-class="{ 'active' : section.active }" class="btn btn-default ng-binding ng-scope">bar</a><!-- end ngRepeat: section in sections -->
    //</div>

    it('should create link per section', inject(function () {
        expect(element.find('[href=__url__]').length > 0).toBe(true);
        expect(element.find('[href=foo]').length > 0).toBe(true);
    }));

});
