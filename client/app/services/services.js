angular.module('shwop.services', [])


.factory('Products', function ($http) {
  var getProducts = function () {
    return $http({
      method: 'GET',
      url: '/api/products'
    });
  };

  var addProduct = function(product) {
    return $http({
      method: 'POST',
      url: '/api/products',
      data: product
    });
  };

  return {
    getProducts: getProducts,
    addProduct: addProduct
  };

})
.factory('Users', function ($http) {
  var getUsers = function () {
    return $http({
      method: 'GET',
      url: '/api/users'
    });
  };

  var addUser = function(user) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    });
  };

  return {
    getUsers: getUsers,
    addUser: addUser
  };
})
.factory('Auth', function ($http, $location, $window) {
  // This auth service is responsible for authenticating the user
  // by exchanging the user's username and password
  // for a JWT from the server.
  // That JWT is then stored in localStorage as 'com.shwop'.
  // After you signin/signup, open devtools, click resources and
  // then localStorage, and you'll see your token from the server.
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.shwop');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.shwop');
    $location.path('/signin');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});