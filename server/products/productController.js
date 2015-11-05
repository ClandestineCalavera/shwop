var db = require('../db/db_config.js');
var util = require('../config/utils.js');
var helpers = require('../db/helpers.js');
var jwt  = require('jwt-simple');
var Promise = require('bluebird');
var _ = require('underscore');

module.exports = {

  // retrieve all the products from the database
  allProducts: function (req, res, next) {
    db.Product.findAll()
    .then(function (products) {
      if(products === null) {
        res.status(400).send('We could not find products in the database.');
      }
      res.send({products: products});
    })
    .catch(function (error) {
      res.status(400).send('Error retrieving all products from database: ' + error);
    });
  },

   productsByTags: function (req, res, next) {
    // Splits the received tags into two array elements: Element 1 = Input Tag, Element 2 = Category Tag
    var tags = req.params.tags.split('+');
    var inputTags = [];
    // Saving these tags variables to alert user if we only found a category tag and not their 
    // Input tags in the database as well
    var categoryTag = tags[1];
    var inputTag = tags[0];
    var foundOnlyCategoryResults = false;

    // Splits the Input Tag into separate words. This allows for search by each word entered into the search query. 
    // E.g., "Search: Brown cow" -> ["Brown", "cow"]
    if(tags[0] !== "null") {
      var inputTags = tags[0].split(" ");
    }

    // Add the Category Tag to the array of tags to be searched/compared
    if(tags[1] !== 'null' && tags[1] !== "All Products") {
      inputTags.push(tags[1]);
    }

    // Search tags db by each Input Tag word in inputTags
    var tagPromises = _.map(inputTags, function(inputTag) {
      return db.Tag.findAll({where: {'tagName': inputTag}});
    });

    Promise.all(tagPromises)
    .then(function (tags) {
      // Flattens the returned array of arrays into one array of objects
      tags = _.flatten(tags);
      
      if(tags.length === 0) {
        res.status(200).send(null);
      } 

      // This works because if we ever find a tag that matches the Search Input 
      // that tag will be a lower index than the categoryTag
      if(tags[0].dataValues.tagName === categoryTag && inputTag !== 'null') {
        console.log("TOGGLING found category results")
        foundOnlyCategoryResults = true;
      }


      // Create an array of tagIds from the tags result
      var tagIds = _.map(tags, function(tags) {
        return tags.dataValues.id;
      });

      // Get all productIds from Product_Tags table that match tagId
      var tagIdPromises = _.map(tagIds, function(tagId) {
        return db.Product_Tag.findAll({where: {'TagId': tagId}});
      });

      Promise.all(tagIdPromises)
      .then(function (productTags) {

        // Flattens the returned array of arrays into one array of objects
        productTags = _.flatten(productTags);

        var productIdArray = helpers.maxProductId(productTags);   

        var productPromises = _.map(productIdArray, function (productId) {
          return db.Product.findAll({where: {id: productId}});
        })

        Promise.all(productPromises)
        .then(function (products) {
          products = _.flatten(products);
          res.status(200).send({
            products: products,
            categoryOnly: foundOnlyCategoryResults
          });
        })
        .catch(function (error) {
          console.log(error);
        });

        
      })
      .catch(function (error) {
        return next(error);
      })

    })
    .catch(function (error) {
      return next(error);
    })
  },


  // adds a new product to the database
  newProduct: function (req, res, next) {

    var token = req.body.token;
    if (!token) {
      res.status(401).send('We could not locate the required token.');
      // Keeping this error syntax for future reference. 
      // next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      db.User.findOne({where: {email: user.email}})
      .then(function (foundUser) {
        if (foundUser) {
          var product = req.body.product;
          var tags = req.body.tags;

          helpers.createProduct(foundUser, product, tags, function (error, result) {
            if (error) {
              next(error);
            }
            res.send(200);
          });
        } else {
          res.status(401).send('Error creating new product in database: We could not locate the product in the database.');
        }
      })
      .catch(function (error) {
        next(error);
      });
    }
  },


  updateProduct: function (req, res, next) {
    console.log('updating product');
    var updates = {};
    if (req.body.product.name)     { updates.name     = req.body.product.name     ;}
    if (req.body.product.photoURL) { updates.photoURL = req.body.product.photoURL ;}
    if (req.body.product.price)    { updates.price    = req.body.product.price    ;}

    db.Product.update(updates, { 
      where: { 
        id: req.body.product.id
      }
    })
    .then( function () {
      next();
    })
    .catch( function (err) {
      next(err);
    });
  },

  addTags: function (req, res, next) {
    console.log('adding tags:', req.body.addedTags);

    if (req.body.addedTags.length > 0) {
      var promiseModels = [];
      for(var i = 0; i < req.body.addedTags.length; i++) {
        promiseModels.push(db.Tag.findOrCreate({where: { tagName: req.body.addedTags[i] }}));
      }
      promiseModels.push(db.Product.findOne({where: {id: req.body.product.id }}));

      Promise.all(promiseModels)
      .spread(function () {
        var args = Array.prototype.slice.call(arguments);
        var productModel = args.pop();
        var promises = [];
        for(var i = 0; i < args.length; i++) {
          promises.push(
            db.Product_Tag.create({
              ProductId: productModel.id,
              TagId: args[i][0].get('id')
            })
          );
        }
        return Promise.all(promises);
      })
      .then(function () {
        next();
      })
      .catch(function (err) {
        next(err);
      });
    } else {
      next();
    }
  },

  removeTags: function (req, res, next) {
    console.log('removing tags:', req.body.removedTags);

    if (req.body.removedTags.length > 0) {
      var promiseModels = [];
      for(var i = 0; i < req.body.removedTags.length; i++) {
        promiseModels.push(db.Tag.find({where: { tagName: req.body.removedTags[i] }}));
      }
      promiseModels.push(db.Product.findOne({where: {id: req.body.product.id }}));

      Promise.all(promiseModels)
      .spread(function () {
        var args = Array.prototype.slice.call(arguments);
        var productModel = args.pop();
        var promises = [];
        for(var i = 0; i < args.length; i++) {
          console.log('args[i].get(\'id\') is', args[i].get('id'));
          promises.push(
            db.Product_Tag.destroy({
              where: {
                ProductId: productModel.id,
                TagId: args[i].get('id')
              }
            })
          );
        }
        return Promise.all(promises);
      })
      .then(function () {
        res.status(200).send('Item updated succcessfully');
      })
      .catch(function (err) {
        next(err);
      });
    } else {
      res.status(200).send('Item updated successfully');
    }
  },

  // delete the product
  deleteProduct: function (req, res, next) {
    var productId = req.params.productId;
    db.Product_Tag.destroy({
      where: {
        ProductId: productId
      }
    })
    .then(function () {
      db.Product.destroy({
        where: {
          id: productId
        }
      });
    })
    //need to delete tags in the tags 
    .then(function () {
        res.status(200).send('Product successfully deleted.');
    })
    .catch(function (error) {
      res.status(400).send('Error deleting the product in the database: ' + error);
    });
  },

  // get all products the user is selling
  userProducts: function (req, res, next) {
    var token = req.body.token;
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      db.User.findOne({where: {email: user.email}})
      .then(function (foundUser) {
        if (foundUser) {
          db.Product.findAll({where: { UserId: foundUser.id }})
          .then(function (foundProducts) {
            var productsArray = [];
            for (var i = 0; i < foundProducts.length; i++) {
              productsArray.push(foundProducts[i].dataValues);
            }
            res.send({products: productsArray});
          })
          .catch(function (err) {
            res.send(401, 'Error finding products');
          });
        } else {
          res.send(401,'corrupted token');
        }
      })
      .catch(function (error) {
        next(error);
      });
    }
  },

  //get all tags for a certain product
  productTags: function (req, res, next) {
    var id = req.params.productId;
    console.log('id is ', id);
    db.Product_Tag.findAll({
      where: { ProductId: id}
    })
    .then(function (product_tags) {
      var tagsPromises = [];
      for (var i = 0; i < product_tags.length; i++) {
        var tagId = product_tags[i].get('TagId');
        tagsPromises.push(db.Tag.findOne({
          where: { id: tagId}
        }));
      }
      return Promise.all(tagsPromises);
    })
    .then(function (tags) {
      var tagNames = [];
      for (var i = 0; i < tags.length; i++) {
        tagNames.push(tags[i].get('tagName'));
      }
      console.log('tagNames is ', tagNames);
      res.send({tags: tagNames});
    });
  }

};


