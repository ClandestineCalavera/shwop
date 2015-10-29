angular.module('shwop.services', [])


.factory('Products', ['$http', '$location', '$translate', function ($http, $location, $translate) {

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
    });
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

  var getUserProducts = function (token) {
    return $http({
          method: 'POST',
          url: '/api/products/mystore',
          data: {
            token: token
          }
    });
  };

  var getPhotoAPIKeys = function(){
    return $http.get('/api/products/keys')
      .then(function(resp) {
        return resp.data;
      });
  };

  var deleteProduct = function (productId) {
    getPhotoAPIKeys().then(function(keys) {
      $http.delete('https://api.parse.com/1/files/chessboard.jpg', {
        headers: {
          'X-Parse-Application-Id': keys['X-Parse-Application-Id'],
          'X-Parse-REST-API-Key': keys['X-Parse-REST-API-Key'],
          'Content-Type':'image/jpeg'
        }
      }).then(function() {
        return $http({
          method: 'DELETE',
          url: '/api/products/' + productId
        });
      })
      .catch(function(error) {
        res.status(400).send('Error deleting the product: ', error);
      });
    });
  };

  var categories = [
    {id: '1', name: 'Antiques', translation: $translate.instant('antiques')},
    {id: '2', name: 'Appliances', translation: $translate.instant('appliances')},
    {id: '3', name: 'Arts, Crafts & Sewing', translation: $translate.instant('artsCrafts')},
    {id: '4', name: 'Automotive', translation: $translate.instant('automotive')},
    {id: '5', name: 'Baby & Kids', translation: $translate.instant('babyKids')},
    {id: '6', name: 'Barter', translation: $translate.instant('barter')},
    {id: '7', name: 'Beauty', translation: $translate.instant('beauty')},
    {id: '8', name: 'Bikes', translation: $translate.instant('bikes')},
    {id: '9', name: 'Boats', translation: $translate.instant('boats')},
    {id: '10', name: 'Books', translation: $translate.instant('books')},
    {id: '11', name: 'Cell Phones & Accessories', translation: $translate.instant('cellPhones')},
    {id: '12', name: 'Clothing, Shoes & Jewelry - Women', translation: $translate.instant('clothingWomen')},
    {id: '13', name: 'Clothing, Shoes & Jewelry - Men', translation: $translate.instant('clothingMen')},
    {id: '14', name: 'Clothing, Shoes & Jewelry - Girls', translation: $translate.instant('clothingGirls')},
    {id: '15', name: 'Clothing, Shoes & Jewelry - Boys', translation: $translate.instant('clothingBoys')},
    {id: '16', name: 'Clothing, Shoes & Jewelry - Baby', translation: $translate.instant('clothingBaby')},
    {id: '17', name: 'Collectibles & Fine Art', translation: $translate.instant('collectibles')},
    {id: '18', name: 'Computers & Software', translation: $translate.instant('computers')},
    {id: '19', name: 'Electronics', translation: $translate.instant('electronics')},
    {id: '20', name: 'Free', translation: $translate.instant('free')},
    {id: '21', name: 'Furniture', translation: $translate.instant('furniture')},
    {id: '22', name: 'Games & Toys', translation: $translate.instant('gamesToys')},
    {id: '23', name: 'Garage Sale', translation: $translate.instant('garageSale')},
    {id: '24', name: 'General / Miscellaneous', translation: $translate.instant('generalMisc')},
    {id: '25', name: 'Grocery & Food', translation: $translate.instant('groceryFood')},
    {id: '26', name: 'Handmade', translation: $translate.instant('handmade')},
    {id: '27', name: 'Health & Personal Care', translation: $translate.instant('health')},
    {id: '28', name: 'Home & Kitchen', translation: $translate.instant('homeKitchen')},
    {id: '29', name: 'Industrial & Scientific', translation: $translate.instant('industrialScientific')},
    {id: '30', name: 'Luggage & Travel Gear', translation: $translate.instant('travel')},
    {id: '31', name: 'Movies & TV', translation: $translate.instant('moviesTV')},
    {id: '32', name: 'Music & Musical Instruments', translation: $translate.instant('music')},
    {id: '33', name: 'Office & Business', translation: $translate.instant('officeBusiness')},
    {id: '34', name: 'Patio, Lawn & Garden', translation: $translate.instant('patio')},
    {id: '35', name: 'Pet Supplies', translation: $translate.instant('pet')},
    {id: '36', name: 'Sports & Outdoors', translation: $translate.instant('sportsOutdoors')},
    {id: '37', name: 'Tickets', translation: $translate.instant('tickets')},
    {id: '38', name: 'Tools & Home Improvement', translation: $translate.instant('tools')},
    {id: '39', name: 'Video Games', translation: $translate.instant('videoGames')}
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
    getUserProducts: getUserProducts,
    deleteProduct: deleteProduct,
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

  var getUserInfo = function(token) {
    return $http({
      method: 'POST',
      url: '/api/users/profile',
      data: {token: token}
    });
  };

  var addUser = function(user) {
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    });
  };

  var updateUser = function(token, updatedUser) {
    return $http({
      method: 'POST',
      url: '/api/users/update',
      data: {token: token, updatedUser: updatedUser}
    });
  };

  return {
    getUsers: getUsers,
    getUserInfo: getUserInfo,
    addUser: addUser,
    updateUser: updateUser
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
    return $http.get('/api/products/keys')
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

      getPhotoAPIKeys().then(function(keys) {
        $http.post(serverUrl, fileBlob, {
          headers: {
            'X-Parse-Application-Id': keys['X-Parse-Application-Id'],
            'X-Parse-REST-API-Key': keys['X-Parse-REST-API-Key'],
            'Content-Type': file.type
          }
        }).then(function(resp) {
          callback(resp.data.url);
        });
      });
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
