angular.module('shwop', [
  'shwop.services',
  'shwop.products',
  'shwop.sell',
  'shwop.bid',
  'shwop.auth',
  'shwop.mystore',
  'shwop.mybids',
  'shwop.profile',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures',
  'pascalprecht.translate',
  'ngRoute',
  'ngFitText'
])
.controller('SidebarController', ['$scope', '$translate', function ($scope, $translate) {
  $scope.toggleLanguage = function (lang) {
    $translate.use(lang);
  };
}])
.config(['$routeProvider', '$httpProvider', '$translateProvider', function ($routeProvider, $httpProvider, $translateProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
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
      css: '../styles/style.css',
      authenticate: true
    })
    .when('/sell', {
      templateUrl: 'app/sell/sell.html',
      controller: 'SellController',
      css: '../styles/style.css',
      authenticate: true
    })
    .when('/welcome', {
      templateUrl: 'app/auth/welcome.html',
      controller: 'AuthController',
      css: '../styles/style.css'
    })
    .when('/bid', {
      templateUrl: 'app/bid/bid.html',
      controller: 'BidController',
      css: '../styles/style.css',
      authenticate: true
    })
    .when('/mystore', {
      templateUrl: 'app/mystore/mystore.html',
      controller: 'MyStoreController',
      css: '../styles/style.css',
      authenticate: true
    })
    .when('/mybids', {
      templateUrl: 'app/mybids/mybids.html',
      controller: 'MyBidsController',
      css: '../styles/style.css',
      authenticate: true
    })
    .when('/profile', {
      templateUrl: 'app/profile/profile.html',
      controller: 'ProfileController',
      css: '../styles/style.css',
      authenticate: true
    });


    $translateProvider.translations('en', enUS);
    $translateProvider.translations('es', esES);
    $translateProvider.preferredLanguage('en');

    // .when('/products:items', {        // TODO: Syntax for filtered items
    //   templateUrl: 'app/products/products.html',
    //   controller: 'ProductController'
    // });

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
}])
.factory('AttachTokens', ['$window', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shwop');
      
      if (!/(http(s?))\:\/\//gi.test(object.url)){

        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
      }
      return object;
    }
  };
  return attach;
}])
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
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
  $rootScope.$on('$routeChangeSuccess', function(event, current) {
    if (current.$$route.authenticate || Auth.isAuth()) {
      $rootScope.showSideBar = true;
    } else {
      $rootScope.showSideBar = false;
    }
  });
}]);
