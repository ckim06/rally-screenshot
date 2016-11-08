'use strict';
rallyController.$inject = ['$scope', 'rallyService'];

function rallyController($scope, rallyService) {
  var vm = this;
  vm.showLogin = true;
  vm.showDefect = false;
  vm.defect = {};

  vm.takeScreenshot = function () {
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
      $scope.$apply(function () {
        vm.defect.screenshot = image;
      });

    });
  };

  if(localStorage.rallyLogin && localStorage.rallyPass){
    vm.isLoading = true;
    vm.showLogin = false;
    vm.showDefect = false;
    rallyService.login(localStorage.rallyLogin, localStorage.rallyPass).then(loginSuccess, loginFailure);
  }

  vm.loginUser = function(){
    vm.isLoading = true;
    localStorage.rallyLogin = vm.login;
    localStorage.rallyPass = vm.password;
    rallyService.login(vm.login, vm.password).then(loginSuccess, loginFailure);
  }

  function loginSuccess(){
    vm.showLogin = false;
    vm.isLoading = false;
    vm.showDefect = true;
  }

  function loginFailure(err) {
    vm.isLoading = false;
    vm.showLogin = true;
    vm.error = err;
  }

  vm.submit = function () {
    vm.isLoading = true;
    rallyService.create(vm.defect).then(function(){
      vm.isLoading = false;
    });
  };
}
