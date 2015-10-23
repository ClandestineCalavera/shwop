// This auth controller is responsible for our client side authentication
// in our signup/signin forms using the injected Auth service
angular.module('shwop.auth', [])

.controller('AuthController', ['$scope', '$window', '$location', 'Auth', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.shwop', token);
        $location.path('/products');
      })
      .catch(function (error) {
        alert('user does not exist, please sign up!');
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.shwop', token);
        $location.path('/products');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
}]);
