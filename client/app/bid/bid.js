angular.module('shwop.bid', [])

.controller('BidController', ['$http', '$scope', '$rootScope', '$location', '$window', 'Products', 'Auth', function ($http, $scope, $rootScope, $location, $window, Products, Auth) {
  $scope.product = Products.getCurrentProduct();
  $scope.bid = null;
  $scope.buttonText = 'Send Bid';

  $scope.sendBid = function () {
    $scope.buttonText = 'Sending bid, please wait!'

    Products.sendBid($window.localStorage.getItem('com.shwop'), $scope.product.id, $scope.bid)
      .then(function (results) {
        console.log("Results in bid.js: ", results);
        $rootScope.Ui.turnOff('bidModal');
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