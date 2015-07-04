'use strict';

describe('Directive: deploymentLayout', function () {

    var element, scope;


    function compileDirective(opts) {
        inject(function ($compile, $rootScope) {

            if (!opts || !opts.scope) {
                scope = $rootScope.$new();
            } else {
                scope = opts.scope;
            }
            element = $compile(angular.element('<div deployment-layout></div>'))(scope);

            scope.$digest();
        });
    }

    beforeEach(module('cosmoUiApp', 'ngMock', 'templates-main', 'backend-mock'));

    beforeEach(function () {
        compileDirective();
    });

    afterEach(function () {
        $('#deployment').remove();
    });

    xit('should create an element with isExecuteEnabled function', function () {
        expect(typeof(element.children().scope().isExecuteEnabled)).toBe('function');
    });

    xit('should define the url to blueprint topology in the breadcrumbs', inject(function (BreadcrumbsService, cloudifyClient) {

        spyOn(cloudifyClient.deployments, 'get').andReturn({
            then: function (success) {
                success({data: {}})
            }
        })
        spyOn(BreadcrumbsService, 'push').andReturn({});


        scope.$apply();

        waitsFor(function () {
            return element.children().scope().breadcrumb.length > 0;
        });
        runs(function () {
            expect(element.children().scope().breadcrumb[0].brackets.href).toBe('#/blueprint/blueprint1/topology');
        });
    }));

    xit('should not set a hover effect on the execute button', function () {
        var _playBtn = element.find('.deployment-play')[0];
        $('body').append('<div id="deployment">' +
        '<div id="deployment-header">' +
        '<div class="header-left">' +
        '<div class="actions"></div>' +
        '</div>' +
        '</div>' +
        '</div>');
        $('.actions').append(_playBtn);

        $('.deployment-play').trigger('mouseover');

        expect($('.deployment-play').css('background-image').indexOf('images/play_disabled.png')).not.toBe(-1);
    });

    xit('should not call getDeploymentExecutions autopull before getNodes', inject(function ($rootScope, $q, CloudifyService) {
        //_getNodesCalled = false;
        //_getDeploymentExecutionsCalled = false;
        //var _scope = $rootScope.$new();
        //spyOn(_cloudifyService.deployments, 'getDeploymentExecutions').andCallThrough();
        //
        //CloudifyService.deployments.getDeploymentExecutions = function () {
        //    var deferred = $q.defer();
        //    deferred.resolve(_executions);
        //    return deferred.promise;
        //};
        //
        //CloudifyService.getNodes = function () {
        //    var deferred = $q.defer();
        //    _getNodesCalled = true;
        //
        //    deferred.resolve(_nodes);
        //    return deferred.promise;
        //};
        //
        //compileDirective({scope: _scope});
        //scope.$apply();
        //
        //waitsFor(function () {
        //    return _getNodesCalled;
        //});
        //runs(function () {
        //    expect(_getDeploymentExecutionsCalled).toBe(false);
        //});
    }));

    xit('should redirect to deployments if deployment deleted from CLI (CFY-1745)', inject(function ($httpBackend, $rootScope, $compile, $q, $location, CloudifyService) {
        var _getNodesCalled = false;

        $location.path('/deployment/' + _deployment.id + '/topology');

        spyOn(CloudifyService, 'getNodes').andCallFake(function () {
            var deferred = $q.defer();
            _getNodesCalled = true;

            deferred.resolve(_nodes);
            return deferred.promise;
        });

        spyOn(CloudifyService.deployments, 'getDeploymentExecutions').andCallFake(function () {
            var deferred = $q.defer();
            deferred.reject({});
            return deferred.promise;
        });

        spyOn(CloudifyService.deployments, 'getDeploymentById').andCallFake(function () {
            var deferred = $q.defer();
            deferred.resolve(_deployment);
            return deferred.promise;
        });

        var scope = $rootScope.$new();
        var isolateScope;

        element = $compile(angular.element('<div deployment-layout></div>'))(scope);
        scope.$digest();

        waitsFor(function () {
            return _getNodesCalled;
        });
        runs(function () {
            isolateScope = element.isolateScope();
            expect(isolateScope.deploymentInProgress).toBe(false);
            expect($location.path()).toBe('/deployments');
        });

    }));

    xit('should check all node instances states (CFY-2368)', inject(function ($compile, $rootScope, $q, CloudifyService, TickerSrv) {
        var _scope = $rootScope.$new();
        var _nodeList;

        CloudifyService.deployments.getDeploymentExecutions = function () {
            var deferred = $q.defer();
            deferred.resolve(_executions);
            return deferred.promise;
        };

        CloudifyService.getNodes = function () {
            var deferred = $q.defer();
            deferred.resolve(_nodes);
            return deferred.promise;
        };

        CloudifyService.deployments.getDeploymentNodes = function () {
            var deferred = $q.defer();
            deferred.resolve(_deploymentNodes);
            return deferred.promise;
        };

        spyOn(TickerSrv, 'register').andCallFake(function (id, handler/*, interval, delay, isLinear*/) {
            handler();
        });

        $rootScope.$on('nodesList', function (event, data) {
            _nodeList = data;
        });

        compileDirective({scope: _scope});

        scope.$apply();

        waitsFor(function () {
            return _nodeList;
        });
        runs(function () {
            expect(_nodeList[1].state.completed).toEqual(5);
        });
    }));
});
