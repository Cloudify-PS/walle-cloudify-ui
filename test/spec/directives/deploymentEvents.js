'use strict';

describe('Directive: deploymentEvents', function () {

    var element, scope;

    beforeEach(module('cosmoUiApp', 'ngMock','backend-mock', 'templates-main'));

    beforeEach(inject(function ($compile, $rootScope, cloudifyClient) {

        spyOn(cloudifyClient.events,'get').and.callFake(function(){
            return {then:function( success ){ success({ data: { hits : { hits : [{}] }}}); }};
        });

        scope = $rootScope.$new();
        element = $compile(angular.element('<div deployment-events="\'id\'"></div>'))(scope);

        $rootScope.$apply();

        scope = element.isolateScope();
    }));

    describe('deploymentEvents scope', function () {

        it('should create scope object', function () {
            expect(scope).toBeDefined();
        });

        it('should create an element with getEventIcon function', function () {
            expect(typeof scope.eventsMap.getEventIcon).toBe('function');
        });

        it('should create an element with getEventText function', function () {
            expect(typeof scope.eventsMap.getEventText).toBe('function');
        });


        it('should create an element with dragIt function', function () {
            expect(typeof(scope.dragIt)).toBe('function');
        });

        it('should define logsDeploymentsParam', function(){
            expect(scope.logsSearchParams).toEqual(
                {
                    deployment_Id: '{"matchAny":"[\\"id\\"]"}',
                    sortBy:'timestamp',
                    reverseOrder:true
                });
        });

        it('should have events-widget div', function () {
            expect(element.find('div.events-widget').length).toBe(1);
        });

        it('should have head div', function () {
            expect(element.find('div.head').length).toBe(1);
        });

        it('should have containList div', function () {
            expect(element.find('div.containList').length).toBe(1);
        });
    });

    describe('events view', function(){ // tests for the HTML
        it('should identify events by $index when painting CFY-3071', function(){

            scope.events = [{ event_type: 'install'}];
            scope.$digest();


            // use track by $index so angular will know not to repaint old events, only new ones.
            expect(element.find('[ng-repeat="event in events track by $index"]').length).toBe(1);
        });
    });
});
