angular.module('shwop.products', [])


.controller('ProductController', ['$scope', '$rootScope', '$translate', 'Products', 'Auth', '$window', 'Users', function ($scope, $rootScope, $translate, Products, Auth, $window, Users) {
  $scope.categories = Products.categories;
  $scope.data = {};
  $scope.product = {};
  $scope.product.category = null;
  $scope.product.searchText = null;
  var previousProductCategory = null;
  var previousSearchText = null;

  // lastCard toggle tells the DOM whether to show the Alert Card
  $scope.lastCard = false;
  $scope.searchSubmitted = false;

  $scope.product.searchForm;

  $scope.signout = function() {
    Auth.signout();
  };
  
  $scope.showModal = function(){
    $rootScope.Ui.turnOn('bidModal');
  }

  $scope.showSearchModal = function(){
    $rootScope.Ui.turnOn('searchModal');
  }

  var findingMessage = $translate.instant('findingMessage');
  $scope.data.location = findingMessage;


  // Calls factory method to get all products matching tag
  $scope.submitSearch = function () {
    $scope.searchSubmitted = true;

    // Allows for optional arguments if user would like to re-submit previous search
    var args = Array.prototype.slice.call(arguments);
    if(args.length > 0) {
      $scope.product.searchText = args[0];
      $scope.product.category = args[1];
    }


    // If the user selects a search for all products
    if(($scope.product.searchText === null || $scope.product.searchText === "")  && ($scope.product.category === "All Products" || $scope.product.category === null)) {
      Products.getAllProducts()
        .then(function (promise) {
          $scope.data.products = promise.data.products;
          Products.setCurrentProduct($scope.data.products[0]);
          // Insert dummy card at end of deck for Alert card - tells user that they are at end of stack
          $scope.data.products.push({alertCard: 'alertCard'});
          $scope.lastCard = false;

          // Only run this if we do not already have the bidder location information
          if(!$scope.bidderLat) {
            console.log("intializing bidder location")
            getProductLocation();
          }
          if($scope.searchSubmitted) {
            // Clear the form
            $scope.product.category = null;
            $scope.product.searchText = null;
          }
          
          $rootScope.Ui.turnOff('searchModal');
          //callback();
        })
        .catch(function (err) {
          if (err){
            console.log('/api/products GET failed.', err);
          }
        });
    } else {
        $scope.searchSubmitted = true;

        if($scope.product.searchText === "") {
          $scope.product.searchText = null;
        }

        var tagsString = $scope.product.searchText + "+" + $scope.product.category;

        Products.getProductsByTag(tagsString)
          .then(function (promise) {

            if(promise.data === '' || promise.data.products.length === 0) {
              $translate('noSearchResultsAlert1')
              .then(function (translatedValue) {
                alert(translatedValue);
              });
            } else if (promise.data.categoryOnly) { // If Category input returns results but Search Input DOES NOT return results

              $scope.lastCard = false;
              $scope.data.products = promise.data.products;
              Products.setCurrentProduct($scope.data.products[0]);

              // Insert dummy card at end of deck for Alert card - tells user that they are at end of stack
              $scope.data.products.push({alertCard: 'alertCard'});
              $rootScope.Ui.turnOff('searchModal');

              // Stores previous search in case user re-submits previous search
              previousSearchText = $scope.product.searchText;
              previousProductCategory = $scope.product.category;

              // Clear the form
              $scope.product.category = null;
              $scope.product.searchText = null;

              var noResultsAlert = '';
              $translate('noSearchResultsAlert2')
              .then(function (translatedValue) {
                noResultsAlert += translatedValue + '"' + previousSearchText + '". ';
                $translate('showingResultsMessage')
                .then(function (translatedValue) {
                  noResultsAlert += translatedValue + '"' + previousProductCategory + '". ';
                  $translate('happyShwoppingMessage')
                  .then(function (translatedValue) {
                    noResultsAlert += translatedValue;
                    alert(noResultsAlert);
                  });
                });
              });
              

              // alert("We were unable to find results matching: \"" + previousSearchText + '". ' + 
              //       "\". Showing results for: \"" + previousProductCategory + "\". Happy shwopping!");

            } else {
              $scope.lastCard = false;
              $scope.data.products = promise.data.products;
              Products.setCurrentProduct($scope.data.products[0]);
              // Insert dummy card at end of deck for Alert card - tells user that they are at end of stack
              $scope.data.products.push({alertCard: 'alertCard'});
              $rootScope.Ui.turnOff('searchModal');

              // Stores previous search in case user re-submits previous search
              previousSearchText = $scope.product.searchText;
              previousProductCategory = $scope.product.category;

              // Clear the form
              $scope.product.category = null;
              $scope.product.searchText = null;

            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
  };

  var getBidderLocation = function (callback) {

      var successCallback = function (position) {
           $scope.bidderLat = position.coords.latitude;
           $scope.bidderLong = position.coords.longitude;
           callback();
      }

      var errorCallback = function (error) {
        console.log(error);
      }
      var watchId = navigator.geolocation.getCurrentPosition(successCallback, 
                                                        errorCallback,
                                                        {enableHighAccuracy:true,timeout:60000,maximumAge:0});
  };

  // Gets the location from the bidder to the product
  var getProductLocation = function () {

    var currentProduct = $scope.data.products[0];
    console.log("Current user", currentProduct.UserId);
    var userId = currentProduct.UserId;

    // get the location of the user associated to the product
    Users.getUserLocation(userId)
    .then(function (user) {
      var productLat = user.data.userInfo.latitude;
      var productLong = user.data.userInfo.longitude;

      getBidderLocation(function () {
        // return $scope.getDistanceFrom();
        var distance = Products.getDistance($scope.bidderLat, $scope.bidderLong, productLat, productLong);
        var distanceDisplay = $translate.instant('distanceDisplay');
        var distanceUnits = $translate.instant('distanceUnits');
        $scope.data.location = distanceDisplay + Math.round(distance) + " " + distanceUnits;
      })

    })
    .catch(function (error) {
      console.log('/api/users/profile POST failed', error);
    })
  };

  $scope.refreshProductSet = function() {
    $scope.lastCard = false;
    $scope.submitSearch(previousSearchText, previousProductCategory);
  };



  $scope.submitSearch();

}])

// Angular directive to control drag functionality.
.directive('carousel', ['$document', '$translate', 'Users', function($document, $translate, Users){
  return {
    restrict: 'C',
    controller: function($scope, Products) {
      this.itemCount = 0;
      this.activeItem = null;

      function arrowHandler (event) {
        if (event.keyCode === 37) {
          if ($scope.data.products.length > 1){
            $scope.data.products.shift();

            if($scope.data.products.length === 1) {
              $scope.lastCard = true;
            }

            Products.setCurrentProduct($scope.data.products[0]);

            // This section gets the location for the next product in the stack
            var currentProduct = $scope.data.products[0];
            var userId = currentProduct.UserId;

            // get the location of the user associated to the product
            Users.getUserLocation(userId)
            .then(function (user) {
              var productLat = user.data.userInfo.latitude;
              var productLong = user.data.userInfo.longitude;

              var distance = Products.getDistance($scope.bidderLat, $scope.bidderLong, productLat, productLong);

             var distanceDisplay = $translate.instant('distanceDisplay');
             var distanceUnits = $translate.instant('distanceUnits');
             $scope.data.location = distanceDisplay + Math.round(distance) + " " + distanceUnits;
            })
          }
        } else if (event.keyCode === 39 && !$scope.lastCard) {
            $scope.showModal();
        }
        $scope.$apply();
      }

      $document.on('keydown', arrowHandler);

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.reject = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
        
        if ($scope.data.products.length > 1){
          $scope.data.products.shift();

          if($scope.data.products.length === 1) {
              $scope.lastCard = true;
          }

          Products.setCurrentProduct($scope.data.products[0]);
          console.log(Products.getCurrentProduct());


          // This section gets the location for the next product in the stack
          var currentProduct = $scope.data.products[0];
          var userId = currentProduct.UserId;

          // get the location of the user associated to the product
          Users.getUserLocation(userId)
          .then(function (user) {
            var productLat = user.data.userInfo.latitude;
            var productLong = user.data.userInfo.longitude;

            var distance = Products.getDistance($scope.bidderLat, $scope.bidderLong, productLat, productLong);

            var distanceDisplay = $translate.instant('distanceDisplay');
            var distanceUnits = $translate.instant('distanceUnits');
            $scope.data.location = distanceDisplay + Math.round(distance) + " " + distanceUnits;
          })
        } 
      };

      this.bid = function(){
        if(!$scope.lastCard) {
          $scope.showModal();
        }
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
}])

.directive('carouselItem',['$drag', function ($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();

      var zIndex = function(){
        var res = 0;
        if (id === carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(){
        elem[0].style.zIndex = zIndex();
      });
      
      $drag.bind(elem, {
        //
        // This is an example of custom transform function
        //
        transform: function(element, transform, touch) {
          // 
          // use translate both as basis for the new transform:
          // 
          var t = $drag.TRANSLATE_BOTH(element, transform, touch);
          
          //
          // Add rotation:
          //
          var Dx    = touch.distanceX, 
              t0    = touch.startTransform, 
              sign  = Dx < 0 ? -1 : 1,
              angle = sign * Math.min( ( Math.abs(Dx) / 700 ) * 30 , 30 );
          
          t.rotateZ = angle + (Math.round(t0.rotateZ));
          
          return t;
        },
        move: function(drag){
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            elem.addClass('dismiss');  
          } else {
            elem.removeClass('dismiss');  
          }
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(drag) {
          elem.removeClass('dismiss');
          if(Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            scope.$apply(function() {
              if(drag.distanceX < 0){
                console.log('dragged left');
                carousel.reject();
              } else {
                console.log('dragged right');
                carousel.bid();
              }
            });
          }
          drag.reset();
        }
      });
    }
  };
}])
.directive('dragMe', ['$drag', function ($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element, 
        {
          //
          // Here you can see how to limit movement 
          // to an element
          //
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function(drag) {
            // go back to initial position
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
