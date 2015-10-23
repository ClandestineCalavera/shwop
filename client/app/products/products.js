angular.module('shwop.products', [])

.controller('ProductController', ['$scope', 'Products', 'Auth', function ($scope, Products, Auth) {
  $scope.categories = Products.categories

  $scope.signout = function() {
    Auth.signout();
  };
  
  // Determines what happens when a user swipes a product photo left or right.
  $scope.swiped = function(direction) {
    // If user swipes left, the topmost photo is removed from the array, revealing
    // the next product to the user.
    if (direction === "LEFT") {
      $scope.data.products.shift();
      if ($scope.data.products.length === 0){
        $scope.getAllProducts();
      }
      Products.setCurrentProduct($scope.data.products[0]);
    } else {
      // If user swipes right, the bid() factory method is called.
      Products.bid();
    }
  };

  $scope.data = {};

  // Calls factory method that returns all product info from DB and renders it.
  $scope.getAllProducts = function () {
    Products.getAllProducts()
    .then(function (promise) {
      $scope.data.products = promise.data.products;
      Products.setCurrentProduct($scope.data.products[0]);
    })
    .catch(function (err) {
      if (err){
        console.log("/api/products GET failed. Populating products with dummy data.");
        $scope.data.products = [{url: '../../photos/chessboard.jpg', price: 60}, 
        {url: '../../photos/decoration.jpg', price: 100}, {url: '../../photos/drone.jpg', price: 300}, 
        {url: '../../photos/plane.jpg', price: 35000}];
        Products.setCurrentProduct($scope.data.products[0]);
      }
    });
  };

  // Calls factory method to get all products matching tag
  $scope.submitSearch = function () {
    var tag = $scope.data.tag
    Products.getProductsByTag(tag)
      .then(function (promise) {
        $scope.data.products = promise.data.products;
        Products.setCurrentProduct($scope.data.products[0]);
      })
  }

  $scope.getAllProducts();
}])

// Angular directive to control drag functionality.
.directive('dragMe', ['$drag', function($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element, 
        {
          // limit movement of element to its parent
          transform: $drag.TRANSLATE_INSIDE($element.parent()),

          // go back to initial position
          end: function(drag) {
            drag.reset();
          }
        },
        { // release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);
