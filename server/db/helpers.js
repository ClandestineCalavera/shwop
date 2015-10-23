
var db = require('../../server/db/db_config.js');
var Promise = require('bluebird');


var associateUserToProduct = function (userEmail, productName) {
  var promiseArray = [];
  promiseArray.push(db.User.findOne({ where: {email: 'michael@jordan.com'}}));
  promiseArray.push(db.Product.findOne({ where: { name: 'air jordan VII shoes'}}));
  Promise.all(promiseArray)
  .then(function (results) {
    var user = results[0];
    var product = results[1];
    // console.log('user is ', user);
    // console.log('product is ', product);
    return product.setUser(user);
  });
};

var createUser = function (user) {
  db.User.create(user)
  .then(function (result) {
    return result;
  })
  .catch(function (error) {
    console.log('Error creating new user:', error);
  });
};

// User format is Object, Product format is Object, Tags format is Array
var createProduct = function (user, product, tags, callback) {
  // FindOne with user.email
  // findOrCreate tags
  // Create product

  // Allows for 
  var productModel;
  var userModel;

  var promiseModels = [];
  for(var i = 0; i < tags.length; i++) {
    promiseModels.push(db.Tag.findOrCreate({where: { tagName: tags[i] }}));
  }
  promiseModels.push(db.User.findOne({where: {email: user.email}}));
  promiseModels.push(db.Product.create(product));

  Promise.all(promiseModels)
  .spread(function () {
    var args = Array.prototype.slice.call(arguments);
    productModel = args.pop();
    userModel = args.pop();

    var results = [];
    for(var i = 0; i < args.length; i++) {
      results.push(args[i][0]);
    }
    // Save
    return productModel.setTags(results);
  })
  .then(function (results) {
    return productModel.setUser(userModel);
  })
  .then(function (result) {
    console.log('Success! Create a user with products and tags.')
    callback(result);
  })
  .catch(function (error) {
    console.log('Error in createProduct function: ', error);
    callback(error);
  })
};

// var createProductAndAssociateToUser = function(userEmail, productName) {
//   var promiseArray = [];
//   promiseArray.push(db.User.findOne({ where: {email: 'michael@jordan.com'}}));
//   promiseArray.push(db.Product.findOne({ where: { name: 'air jordan VII shoes'}}));
//   Promise.all(promiseArray)
//   .then(function (results) {
//     var user = results[0];
//     var product = results[1];
//     return product.setUser(user);
//   });
// };

exports.associateUserToProduct = associateUserToProduct;
exports.createProduct = createProduct;