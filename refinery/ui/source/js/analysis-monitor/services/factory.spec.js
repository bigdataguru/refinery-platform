//UNIT TESTING
//Provide a global variable for factory.
var csrf_token;
describe("Analysis Monitor Factory", function(){
 // 'use strict';
  var factory,
      query,
      deferred,
      rootScope,
      valid_uuid = 'x508x83x-x9xx-4740-x9x7-x7x0x631280x',
      valid_token = 'xxxx1';

  beforeEach(module('refineryApp'));
  beforeEach(module('refineryAnalysisMonitor'));
  beforeEach(inject( function(_analysisMonitorFactory_){
    factory = _analysisMonitorFactory_;
    csrf_token = valid_token;
  }));

  it('factory and tools variables should exist', function(){
    expect(factory).toBeDefined();
    expect(factory.analysesList).toEqual([]);
    expect(factory.analysesRunningList).toEqual([]);
    expect(factory.analysesGlobalList).toEqual([]);
    expect(factory.analysesRunningGlobalList).toEqual([]);
    expect(factory.analysesDetail).toEqual({});
  });

  describe("getAnalysesList", function() {
    var analysisListObj;

    beforeEach(inject( function(analysisService, $q, $rootScope){
      analysisListObj = [{test1:1},{test2:2},{test3:3},{test4:4}];
      spyOn(analysisService, "query").and.callFake(function() {
        deferred = $q.defer();
        deferred.resolve(analysisListObj);
        return {$promise : deferred.promise};
      });
      rootScope = $rootScope;
    }));

    it('getAnalysesList is a method', function () {
      expect(angular.isFunction(factory.getAnalysesList)).toBe(true);
    });

    it('getAnalysesList returns a promise', function () {
      var successData;
      var response = factory.getAnalysesList({uuid: valid_uuid}).then(function (responseData) {
        successData = responseData;
      });
      rootScope.$apply();
      expect(typeof response.then).toEqual('function');
      expect(angular.isFunction(factory.getAnalysesList)).toBe(true);
      expect(successData).toEqual(analysisListObj);
    });
  });

  describe("getAnalysesDetail", function() {
    var response, analysesDetail;

    beforeEach(inject(function($q, $rootScope, analysisDetailService) {
      // Set up the mock http service responses
      analysesDetail = {
            "refineryImport": [{status: "PROGRESS", percent_done: 30}],
            "galaxyImport": [{status: "", percent_done: ""}],
            "galaxyAnalysis": [{status: "", percent_done:""}],
            "galaxyExport": [{status: "", percent_done: ""}],
            "overrall": "RUNNING"
          };

      spyOn(analysisDetailService, "query").and.callFake(function() {
        deferred = $q.defer();
        deferred.resolve(analysesDetail);
        return {$promise : deferred.promise};
      });
      rootScope = $rootScope;
    }));

    it('getAnalysesDetail is a method', function () {
      expect(angular.isFunction(factory.getAnalysesDetail)).toBe(true);
    });

    it('getAnalysesDetail makes success call', function () {
      var successData;
      var response = factory.getAnalysesDetail({uuid: valid_uuid}).then(function (responseData) {
        successData = responseData;
      });
      rootScope.$apply();
     // expect(typeof response.then).toEqual('function');
      expect(successData).toEqual(analysesDetail);
    });
  });

  describe("postCancelAnalysis", function() {
    var $httpBackend;

     beforeEach(inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
     }));

    it('postCancelAnalysis is a method', function () {
      expect(angular.isFunction(factory.postCancelAnalysis)).toBe(true);
    });

    it('postCancelAnalysis makes success call', function () {
      $httpBackend.expectPOST('/analysis_manager/analysis_cancel/',
          {'csrfmiddlewaretoken': valid_token, 'uuid': valid_uuid},
          {"X-Requested-With": 'XMLHttpRequest',
          "Accept":"application/json," +
          " text/plain, */*",
          "Content-Type":"application/json;" +
          "charset=utf-8"}
          ).respond(200, {},{});
      var response = factory.postCancelAnalysis(valid_uuid).then(function(){
        data = 'success';
      }, function(){
        data = 'error';
      });
      $httpBackend.flush();
      expect(typeof response.then).toEqual('function');
      expect(data).toEqual('success');
    });
  });
});
