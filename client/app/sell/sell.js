angular.module('shwop.sell', [])

.controller('SellController', ['$http', '$scope', '$location', '$window', 'Products', 'Photos', 'Auth', function ($http, $scope, $location, $window, Products, Photos, Auth) {
  $scope.product = {};
  $scope.product.tags = [];
  $scope.product.photoURL = '';
  $scope.product.category = null;

  $scope.categories = Products.categories;

  $scope.signout = function() {
    Auth.signout();
  }

  // Helper function that adds an item to an array if the item is not already
  // in the array and the item is not blank. 
  var addToArray = function(item, array) {
    if(array.indexOf(item) === -1 && !isBlank(item)){
      array.push(item);
    }
  };

  // Helper function that ensures a string is not blank.
  var isBlank = function(string) {
    return string.trim() === '';
  };

  // Adds tag to array of tags associated with a product.
  $scope.addTag = function() {
    addToArray($scope.data.tag, $scope.product.tags);
    $scope.data.tag = '';
  };

  // Calls factory method that adds photo to parse.com and returns photo url.
  $scope.addPhoto = function() {
    $scope.filePath = '';
    Photos.uploadPhoto($scope.productPhoto, function(url){
      $scope.product.photoURL = url;
    }.bind($scope));
  };

  // Calls factory method that adds a product to the database.
  $scope.addProduct = function () {
    if ($scope.product.photoURL === '') {
      alert("You must add a photo!");
      return;
    }
    
    console.log($scope.product);

    // Temporary fix: Pushing the categories tag onto tags array
    // This may be utilized later, once we figure out search
    $scope.product.tags.push($scope.product.category);
     var request = {
      "token": $window.localStorage.getItem('com.shwop'),
      "product": {
                  "name": $scope.product.name,
                  "photoURL": $scope.product.photoURL,
                  "price": $scope.product.price
      },
      "tags": $scope.product.tags
    }


    Products.addProduct(request)
    .then(function () {
      $location.path('/products');
    })
    .catch(function (err) {
      console.log(err);
    });
  };
}])

// The 'fileread' directive ensures that the photo uploaded in the browser
// is available for manipulation within the controller.
.directive('fileread', [function () {
  return {
      scope: {
          fileread: '='
      },
      link: function (scope, element, attributes) {
          element.bind('change', function (changeEvent) {
              scope.$apply(function () {
                  scope.fileread = changeEvent.target.files[0];
              });
          });
      }
  };
}]);
