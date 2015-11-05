angular.module('shwop.sell', [])

.controller('SellController', ['$http', '$scope', '$location', '$translate', '$window', 'Products', 'Photos', 'Auth', function ($http, $scope, $location, $translate, $window, Products, Photos, Auth) {
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
      $('#uploadPhotoButton').attr("disabled", true);
    }.bind($scope));
  };

  // Calls factory method that adds a product to the database.
  $scope.addProduct = function () {
    if($scope.product.photoURL === ''){
      $translate('photoUploadAlert')
        .then(function(translatedValue) {
          alert(translatedValue);
        });
      return;
    }
    
    console.log($scope.product);

    // Temporary fix: Pushing the categories tag onto tags array
    // This may be utilized later, once we figure out search
    $scope.product.tags.push($scope.product.category);
     var request = {
      product: {
        name: $scope.product.name,
        photoURL: $scope.product.photoURL,
        price: $scope.product.price
      },
      tags: $scope.product.tags
    };


    Products.addProduct(request)
    .then(function () {
      $location.path('/mystore');
    })
    .catch(function (error) {
      console.log('Error in creating a bid:   ', error);
    });
  };

  $(document).ready(function() {
  var msg="";
  var elements = document.getElementsByTagName("input");

  for (var i = 0; i < elements.length; i++) {
     elements[i].oninvalid =function(e) {
        if (!e.target.validity.valid) {
          var emptyFieldError = $translate.instant("emptyFieldError");
          e.target.setCustomValidity(emptyFieldError);
       }
      };
     elements[i].oninput = function(e) {
          e.target.setCustomValidity(msg);
      };
  } 
  });
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
}])
.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});
