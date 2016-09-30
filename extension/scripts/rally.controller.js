'use strict';
rallyController.$inject = ['$scope', 'rallyService'];

function rallyController($scope, rallyService) {
  var vm = this;
  vm.defect = {};

  vm.takeScreenshot = function () {
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
      $scope.$apply(function () {
        vm.defect.screenshot = image;
      });

    });
  };

  vm.submit = function () {
    vm.isLoading = true;
    rallyService.create(vm.defect).then(function(){
      vm.isLoading = false;
    });
  };
}
