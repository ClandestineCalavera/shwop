angular.module('shwop.bid', [])

.controller('BidController', ['$http', '$scope', '$location', '$window', 'Products', 'Auth', function ($http, $scope, $location, $window, Products, Auth) {
  $scope.product = Products.getCurrentProduct();
  $scope.bid = null;
  $scope.sendBid = function () {

    Products.sendBid($window.localStorage.getItem('com.shwop'), $scope.product.id, $scope.bid)
      .then(function (results) {
        console.log("Results in bid.js: ", results);
        $location.path('/products');
      })
      .catch(function (error) {
        console.log("Error in creating a bid:  ", error);
      })
  };

  $scope.cancel = function () {
    Products.products();
  };

  $scope.signout = function () {
    Auth.signout();
  };

}]);