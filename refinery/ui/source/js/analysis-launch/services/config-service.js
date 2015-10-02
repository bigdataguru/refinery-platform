angular.module('refineryAnalysisLaunch')
    .service("analysisLaunchConfigService", [
    '$window',
    analysisLaunchConfigService
  ]
);

function analysisLaunchConfigService($window) {
  var vm = this;

  var analysisConfig = {
    studyUuid: $window.externalStudyUuid,
    workflowUuid: null,
    nodeSetUuid: null,
    nodeRelationshipUuid: null,
    name: null,
  };

  vm.setAnalysisConfig = function (paramObj) {
     vm.updateAnalysisConfig(paramObj);
  };

  vm.getAnalysisConfig = function(){
    return analysisConfig;
  };

  vm.updateAnalysisConfig = function(paramObj){
    for(var prop in paramObj){
      analysisConfig[prop] = paramObj[prop];
    }
  };
}