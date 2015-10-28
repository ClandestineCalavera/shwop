angular.module('shwop.products', [])


.controller('ProductController', ['$scope', '$rootScope', 'Products', 'Auth', function ($scope, $rootScope, Products, Auth) {
  $scope.categories = Products.categories;

  $scope.signout = function() {
    Auth.signout();
  };
  
  // Determines what happens when a user swipes a product photo left or right.
  $scope.swiped = function(direction) {
    // If user swipes left, the topmost photo is removed from the array, revealing
    // the next product to the user.
    if (direction === 'LEFT') {
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

  $scope.showModal = function(){
    $rootScope.Ui.turnOn('bidModal');
  }

  // var arrowSwiper = function(e){
  //     if(e.keyCode === 37) {
  //       carousel.reject();
  //     } else if (e.keyCode === 39) {
  //       console.log("got here!");
  //       Products.bid();
  //     }      
  // };

  // var $doc = angular.element(document);

  // $doc.on('keydown', arrowSwiper);
  // $scope.$on('$destroy',function(){
  //   $doc.off('keydown', arrowSwiper);
  // });

  $scope.data = {};



  // Calls factory method that returns all product info from DB and renders it.
  $scope.getAllProducts = function () {
    console.log('getting all products');
    Products.getAllProducts()
    .then(function (promise) {
      $scope.data.products = promise.data.products;
      Products.setCurrentProduct($scope.data.products[0]);
      console.log(Products.getCurrentProduct());
    })
    .catch(function (err) {
      if (err){
        console.log('/api/products GET failed. Populating products with dummy data: ', err);
        $scope.data.products = [{url: '../../photos/chessboard.jpg', price: 60}, 
        {url: '../../photos/decoration.jpg', price: 100}, {url: '../../photos/drone.jpg', price: 300}, 
        {url: '../../photos/plane.jpg', price: 35000}];
        Products.setCurrentProduct($scope.data.products[0]);
      }
    });
  };

  // Calls factory method to get all products matching tag
  $scope.submitSearch = function () {
    var tag = $scope.data.tag;
    Products.getProductsByTag(tag)
      .then(function (promise) {
        $scope.data.products = promise.data.products;
        Products.setCurrentProduct($scope.data.products[0]);
      });
  };

  $scope.getAllProducts();
}])

// Angular directive to control drag functionality.
.directive('carousel', [function(){
  return {
    restrict: 'C',
    controller: function($scope, Products) {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.reject = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
        
        if ($scope.data.products.length > 1){
          console.log('popping first product');
          $scope.data.products.shift();
          Products.setCurrentProduct($scope.data.products[0]);
          console.log(Products.getCurrentProduct());
        } else {
          $scope.data.products.shift();
          $scope.getAllProducts();
        }
      };

      this.bid = function(){
        $scope.showModal();
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

// .directive('ngArrows', function () {
  // var arrowSwiper = function(e){
  //     if(e.keyCode === 37) {
  //       carousel.reject();
  //     } else if (e.keyCode === 39) {
  //       console.log("got here!");
  //       Products.bid();
  //     }      
  // };

  // var $doc = angular.element(document);

  // $doc.on('keydown', arrowSwiper);
  // $scope.$on('$destroy',function(){
  //   $doc.off('keydown', arrowSwiper);
  // });
// })

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
