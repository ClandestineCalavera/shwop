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
        alert('Error: User does not exist, please sign up!');
        console.error("Error in signing in:  ", error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.shwop', token);
        $location.path('/welcome');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signout = function () {
    Auth.signout();
  };
  
}]);
