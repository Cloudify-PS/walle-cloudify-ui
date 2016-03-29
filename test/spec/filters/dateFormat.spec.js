'use strict';

describe('Filter: dateFormat', function () {
    var dateFormat;
    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock'));

    beforeEach(inject(function ($filter) {
        dateFormat = $filter('dateFormat');
    }));

    //TODO: return this after browsers bug is fixed: https://cloudifysource.atlassian.net/browse/CFY-5124
    //describe('iso parse with offset', function () {
    //    it('has a dateFormat filter', function () {
    //        expect(dateFormat).not.toBeUndefined();
    //    });
    //
    //    it('should return the input by requested yyyy-MM-dd HH:mm:ss format', function () {
    //        var text = '2011-11-24T05:12:12.123+0000';
    //        var format = 'yyyy-MM-dd HH:mm:ss.sss';
    //        //Added timezone adjustment just for it to pass on travis / circle and locally
    //        expect(dateFormat(text, format)).toBe('2011-11-24 0'+(5+new Date().getTimezoneOffset()/-60)+':12:12.123');
    //    });
    //
    //    it('it should return undefined if text is undefined', function () {
    //        expect(dateFormat(undefined)).toBe(undefined);
    //    });
    //
    //    it('should accept only valid format', function () {
    //        var text = '20111124T090027';
    //        var timeFormat = 'HH:mm:ss';
    //
    //        expect(dateFormat(text, timeFormat)).toBe('Invalid date');
    //    });
    //});
    //
    //describe('iso date without offset', function () {
    //    beforeEach(function () {
    //        Date.forceIsoOffset = true;
    //    });
    //    it('should give same results ', function () {
    //        //Added timezone adjustment just for it to pass on travis / circle and locally
    //        expect(dateFormat('2011-11-24T05:12:12.123+0000', 'yyyy-MM-dd HH:mm:ss.sss')).toBe('2011-11-24 0'+(5+new Date().getTimezoneOffset()/-60)+':12:12.123');
    //        expect(dateFormat('2011-11-24T05:12:12.123+0000', 'yyyy-MM-dd HH:mm:ss')).toBe('2011-11-24 0'+(5+new Date().getTimezoneOffset()/-60)+':12:12');
    //    });
    //
    //    it('should have default date format', function () {
    //        expect(dateFormat('2011-11-24T05:00:00+0000')).toBe('2011-11-24 0'+(5+new Date().getTimezoneOffset()/-60)+':00:00');
    //    });
    //
    //    it('support timezones', function () {
    //        expect(dateFormat('2011-11-24T05:00:00+0300')).toBe('2011-11-24 0'+(2+new Date().getTimezoneOffset()/-60)+':00:00');
    //    });
    //});
    //
    //describe('rest of formats', function(){
    //    it('should add timezone to timestamps without', function(){
    //        expect(dateFormat('2011-11-24 05:59:17.362781', 'yyyy-MM-dd HH:mm:ss.sss')).toBe('2011-11-24 0'+(5+new Date().getTimezoneOffset()/-60)+':59:17.362');
    //    });
    //
    //    it('should use short date format', function () {
    //        expect(dateFormat('2011-11-24T05:00:00+0000','short')).toBe('2011-11-24 0'+(5+new Date().getTimezoneOffset()/-60)+':00:00');
    //    });
    //
    //    it('should use long date format', function () {
    //        expect(dateFormat('2011-11-24T05:00:00+0000','long')).toBe('2011-11-24 0'+(5+new Date().getTimezoneOffset()/-60)+':00:00.000');
    //    });
    //});
});
