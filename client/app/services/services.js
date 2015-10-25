angular.module('shwop.services', [])


.factory('Products', ['$http', '$location', function ($http, $location) {

  var currentProduct = null;

  var getAllProducts = function () {
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
    })
    .then(function(thing) {
      console.log('this thing', thing);
    })
  };

  var bid = function() {
    $location.path('/bid');
  };

  var products = function () {
    $location.path('/products');
  };

  var setCurrentProduct = function(newProduct) {
    currentProduct = newProduct;
  };

  var getCurrentProduct = function() {
    return currentProduct;
  };

  var sendBid = function(token, productId, bidAmount) {
    return $http({
      method: 'POST',
      url: '/api/bids',
      data: {
        token: token,
        productId: productId,
        bidAmount: bidAmount
      }
    });
  };

  var getProductsByTag = function (tags) {
    return $http({
          method: 'GET',
          url: '/api/products/' + tags
    });
  };

  var categories = [
    {id: '1', name: 'Antiques'},
    {id: '2', name: 'Appliances'},
    {id: '3', name: 'Arts, Crafts & Sewing'},
    {id: '4', name: 'Automotive'},
    {id: '5', name: 'Baby & Kids'},
    {id: '6', name: 'Barter'},
    {id: '7', name: 'Beauty'},
    {id: '8', name: 'Bikes'},
    {id: '9', name: 'Boats'},
    {id: '10', name: 'Books'},
    {id: '11', name: 'Cell Phones & Accessories'},
    {id: '12', name: 'Clothing, Shoes & Jewelry - Women'},
    {id: '13', name: 'Clothing, Shoes & Jewelry - Men'},
    {id: '14', name: 'Clothing, Shoes & Jewelry - Girls'},
    {id: '15', name: 'Clothing, Shoes & Jewelry - Boys'},
    {id: '16', name: 'Clothing, Shoes & Jewelry - Baby'},
    {id: '17', name: 'Collectibles & Fine Art'},
    {id: '18', name: 'Computers & Software'},
    {id: '19', name: 'Electronics'},
    {id: '20', name: 'Free'},
    {id: '21', name: 'Furniture'},
    {id: '22', name: 'Games & Toys'},
    {id: '23', name: 'Garage Sale'},
    {id: '24', name: 'General / Miscellaneous'},
    {id: '25', name: 'Grocery & Food'},
    {id: '26', name: 'Handmade'},
    {id: '27', name: 'Health & Personal Care'},
    {id: '28', name: 'Home & Kitchen'},
    {id: '29', name: 'Industrial & Scientific'},
    {id: '30', name: 'Luggage & Travel Gear'},
    {id: '31', name: 'Movies & TV'},
    {id: '32', name: 'Music & Musical Instruments'},
    {id: '33', name: 'Office & Business'},
    {id: '34', name: 'Patio, Lawn & Garden'},
    {id: '35', name: 'Pet Supplies'},
    {id: '36', name: 'Sports & Outdoors'},
    {id: '37', name: 'Tickets'},
    {id: '38', name: 'Tools & Home Improvement'},
    {id: '39', name: 'Video Games'}
  ];

  return {
    getAllProducts: getAllProducts,
    addProduct: addProduct,
    setCurrentProduct: setCurrentProduct,
    getCurrentProduct: getCurrentProduct,
    bid: bid,
    sendBid: sendBid,
    products: products,
    getProductsByTag: getProductsByTag,
    categories: categories
  };

}])
.factory('Users', ['$http', function ($http) {
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
}])
.factory('Photos', function($http) {
  var resizeImage = function (file, height, callback) {
    // Takes an uploaded file, resizes it based on height, and calls the callback, sending it a Blob.
    var img = new Image();
    var reader = new FileReader();

    img.onload = function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      
      canvas.height = height;
      canvas.width = canvas.height * (img.width / img.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      console.log(ctx.canvas);
      ctx.canvas.toBlob(callback);
    };

    reader.onload = function (e) {
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  // Retrieves keys needed to post photos to parse.com
  var getPhotoAPIKeys = function(){
    return $http.get('/api/keys')
      .then(function(resp) {
        return resp.data;
      });
  };

  var uploadPhoto = function(file, callback) {
    // takes a File after upload, resizes it and uploads it to Parse.
    // Sends Url of upload to callback function
    var resizedFileHeight = 300;

    // Calls resizeImage, which converts a photo to blob, then posts that
    // data to parse.com, receives the photo url in parse's response, and
    // passes the url into uploadPhoto's callback function.
    resizeImage(file, resizedFileHeight, function(fileBlob) {
      var serverUrl = 'https://api.parse.com/1/files/' + file.name;

      $http.post(serverUrl, fileBlob, {
        headers: {
          'X-Parse-Application-Id':  '',
          'X-Parse-REST-API-Key':  '',
          'Content-Type': file.type
        }
      }).then(function(resp) {
        callback(resp.data.url);
      });

      // getPhotoAPIKeys().then(function(keys) {
      //   $http.post(serverUrl, fileBlob, {
      //     headers: {
      //       'X-Parse-Application-Id': keys['X-Parse-Application-Id'],
      //       'X-Parse-REST-API-Key': keys['X-Parse-REST-API-Key'],
      //       'Content-Type': file.type
      //     }
      //   }).then(function(resp) {
      //     callback(resp.data.url);
      //   });
      // });
    });
  };

  return {
    uploadPhoto: uploadPhoto
  };

})
.factory('Auth', ['$http', '$location', '$window', function ($http, $location, $window) {
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
}]);
