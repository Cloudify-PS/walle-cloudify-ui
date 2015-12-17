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
        scope.$apply();
    }));

    describe('deploymentEvents scope', function () {

        it('should create scope object', function () {
            expect(scope).not.toBeUndefined();
        });

        it('should create an element with getEventIcon function', function () {
            expect(typeof(scope.getEventIcon)).toBe('function');
        });

        it('should create an element with getEventText function', function () {
            expect(typeof(scope.getEventText)).toBe('function');
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

        it('should have opacity background div', function () {
            expect(element.find('div.bg').length).toBe(1);
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


    describe('drag head functionality', function () {
        it('should change the height', function(){
            element.css({ height: 250, width: 200});
            $('body').append(element);
            $('body').addClass('bpContainer');
            $('body').attr('id','main-content');
            var eventsList = element.find('.containList');
            var dragBtn = element.find('.dragBtn');
            dragBtn.simulate('drag', { dy:10}); // drag once to enforce maxHeight..
            var firstHeight = eventsList.height();
            dragBtn.simulate('drag', { dy:10}); // actual drag.
            var lastHeight =  eventsList.height();
            expect(firstHeight - lastHeight).toBe(10);
            $('body').removeClass('bpContainer');
            $('body').attr('id',null);
            element.remove();
        });

        it('should enable drag from the entire header', function(){ // lets test that the drag button and the header tag have the same gs-mousedown attr..
            expect(element.find('.head').attr('data-ng-mousedown')).toEqual(element.find('.dragBtn').attr('data-ng-mousedown'));
        });

    });

});
