angular.module('shwop.profile', [])


.controller('ProfileController', ['$scope', '$window', '$translate', '$location', 'Users', 'Auth', function ($scope, $window, $translate, $location, Users, Auth) {

  $scope.data = {
    user: {}
  };

  $scope.updateMode = false;

  $scope.signout = function() {
    Auth.signout();
  };

// Calls factory mehtod that returns the user's information
  $scope.getUserInfo = function () {
    var token = $window.localStorage.getItem('com.shwop');
    Users.getUserInfo(token)
    .then(function (user) {
      $scope.data.user = user.data.userInfo;
    })
    .catch(function (err) {
        console.log('/api/users/profile POST failed', err);
    });
  };

  $scope.updateUser = function () {
    var token = $window.localStorage.getItem('com.shwop');
    Users.updateUser(token, $scope.data.user)
    .then(function() {
      return $translate('profileUpdateAlert');
    })
    .then(function (translatedValue) {
      $scope.data.user = {};
      alert(translatedValue);
      $("input.form-control").prop('disabled', true);
      $scope.updateMode = false;
      $scope.getUserInfo();
    })
    .catch(function (err) {
      console.log('/api/users/update POST failed', err);
    });
  };

  $scope.cancelChanges = function () {
    $("input.form-control").prop('disabled', true);
    $scope.updateMode = false;
    $scope.getUserInfo();
  };

  $scope.enableUpdateMode = function () {
    $("input.form-control").prop('disabled', false);
    $scope.updateMode = true;
  };

  $scope.backToShwopping = function () {
    $location.path( "/products" );
  };

  // $scope.getLocation = function () {

  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     console.log(position.coords.latitude, position.coords.longitude);
  // });

  // }

  $scope.getUserInfo();
}]);
