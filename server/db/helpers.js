
var db = require('../../server/db/db_config.js');
var Promise = require('bluebird');
var request = require('request');
var _ = require('underscore');

// create a  user
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
var createProduct = function (userModel, product, tags, callback) {
  // FindOne with user.email
  // findOrCreate tags
  // Create product

  // Allows for 
  var productModel;

  var promiseModels = [];
  for(var i = 0; i < tags.length; i++) {
    promiseModels.push(db.Tag.findOrCreate({where: { tagName: tags[i] }}));
  }
  // promiseModels.push(db.User.findOne({where: {email: user.email}}));
  promiseModels.push(db.Product.create(product));

  Promise.all(promiseModels)
  .spread(function () {
    var args = Array.prototype.slice.call(arguments);
    productModel = args.pop();
    // userModel = args.pop();

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
    console.log('Success! Create a product with user and tags.');
    callback(null, result);
  })
  .catch(function (error) {
    console.log('Error in createProduct function: ', error);
    callback(error, null);
  });
};


//accepts location input from the user and makes a call to the google maps api
//to get the longitude and latitude
var addLongAndLat = function (user) {
  if (!process.env.GoogleKey) {
    var locally = require('../../sneakyLocal.js');
  }

  var inputs = [];
  var address = [];

  if (user.address1) { inputs.push(user.address1)      ;}
  if (user.address2) { inputs.push(user.address2)      ;}
  if (user.city)     { inputs.push(user.city)          ;}
  if (user.state)    { inputs.push(user.state)         ;}
  if (user.zip)      { inputs.push(user.zip.toString());}
  if (user.country)  { inputs.push(user.country)       ;}

  for (var i = 0; i < inputs.length; i++) {
    address.push(inputs[i].split(' ').join('+'));
  }

  address = address.join(',+');

  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + (process.env.GoogleKey || locally.GoogleKey);
  return request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var JSONbody = JSON.parse(body);
      var longitude = JSONbody.results[0].geometry.location.lng;
      var latitude = JSONbody.results[0].geometry.location.lat;
      return db.User.update({ 
        longitude: longitude,
        latitude: latitude,
      }, {
        where: {
          email: user.email
        }
      });
    }
  });
};

exports.createProduct = createProduct;
exports.addLongAndLat = addLongAndLat;



var storeBid = function (bidAmount, product, bidder, callback) {

    // find
    db.Bid.find({where: {
      ProductId: product.id,
      UserId: bidder.id
    }})
    .then(function (bid) {
      // if found - update
      if(bid) {
        bid.updateAttributes({
          bidAmount: bidAmount
        })
        .then(function (success) {
          console.log('We just updated a bid!')
          callback(null, success);
        })
        .catch(function (error) {
          console.log('We had an error in storeBid > helper.js - updating a bid.');
          callback(error, null);
        })

      } else if(bid === null) {
        db.Bid.create({
          bidAmount: bidAmount,
          UserId: bidder.id,
          ProductId: product.id
        })
        .then(function(success) {
          console.log('We just created a new bid!')
          callback(null, success);
        })
        .catch(function(error) {
          console.log('We had an error in storeBid > helper.js - creating a new bid.')
          callback(null, success);
        })
      }

    }) 
    .catch(function (error) {
      console.log('We had an error in storeBid > helper.js - finding the Bid.');
      callback(error, null);
    })
  }

exports.createProduct = createProduct;
exports.storeBid = storeBid;

var maxProductId = function (array) {
  // library object
  var library = {};
  // output array
  var outArray = [];
  // max count
  var maxCount = 1;
  _.each(array, function(object) {
    // if doesn't exist in library, insert into library
    if(!library.hasOwnProperty(object.dataValues.ProductId)) {
      library[object.dataValues.ProductId] = 1;
      if(maxCount === 1) {
        outArray.push(object.dataValues.ProductId);
      }
    } else { // if it does exist in library, then increment the count
      library[object.dataValues.ProductId]++;
      // If that count is greater than the max
      if(library[object.dataValues.ProductId] > maxCount) {
        // clear the outArray
        outArray = [];
        // increment max count, insert into output array
        maxCount++;
        outArray.push(object.dataValues.ProductId);
      } else if(library[object.dataValues.ProductId] === maxCount) {
        outArray.push(object.dataValues.ProductId);
      }
    }
    console.log("Library", library);
    console.log("outArray", outArray);
  });

  return outArray;
};

exports.maxProductId = maxProductId;

