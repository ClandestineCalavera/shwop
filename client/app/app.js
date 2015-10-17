angular.module('shwop', [
  'shwop.services',
  'shwop.products',
  'shwop.sell',
  'shwop.auth',
  'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/products', {
      templateUrl: 'app/products/products.html',
      controller: 'ProductController',
      css: '../styles/style.css'
    })
    .when('/sell', {
      templateUrl: 'app/sell/sell.html',
      controller: 'SellController',
      css: '../styles/style.css'
    });
    // .when('/products:items', {        // TODO: Syntax for filtered items
    //   templateUrl: 'app/products/products.html',
    //   controller: 'ProductController'
    // });

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // This is an $httpInterceptor.
  // Its job is to stop all outgoing requests,
  // then look in local storage and find the user's token,
  // and then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shwop');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // Here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready.
  // However, we want to make sure the user is authorized.
  // We listen for when angular is trying to change routes.
  // When it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired.
  // If it's not valid, we then redirect back to signin/signup.
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});