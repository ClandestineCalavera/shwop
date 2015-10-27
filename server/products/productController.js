var db = require('../db/db_config.js');
var util = require('../config/utils.js');
var helpers = require('../db/helpers.js');
var jwt  = require('jwt-simple');

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
      res.status(400).send('Error retrieving all products from database: ', error);
    });
  },

  productsByTags: function (req, res, next) {
    //query to find products by tags
    var tags = req.params.tags.split('+');
    // Category tag will always be inserted at end of tags array
    var categoryTag = tags.pop();
    var categoryProducts;
    console.log(categoryTag);

    // Get all associated products by Category tag
    db.Tag.findOne({where: {tagName: categoryTag}})
    .then(function (tag) {
      if(tag === null) {
        res.status(400).send('We could not find a tag in the database.');
      }
      return tag.getProducts();
    })
    .then(function (associatedProducts) {
      if(associatedProducts === null) {
        // Not sure if this is the correct error. Leaving in for future testing purposes. 
        res.status(400).send('We could not find the associated tags in the database.');
      }
      categoryProducts = associatedProducts;
      res.send({products: associatedProducts});
    })
    .catch(function (error) {
      return next(error);
    });
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

  // update the product
  updateProduct: function (req, res, next) {
    var updates = {};
    if (req.body.name) { updates.name = req.body.name; }
    if (req.body.photoURL) { updates.photoURL = req.body.photoURL; }
    if (req.body.price) { updates.price = req.body.price; }

    db.Product.update(updates, {
      where: { id: req.body.id }
    })
    .then(function () {
      console.log('Successfully updated the product');
      res.send('Update successful');
    })
    .catch(function (error) {
      res.status(400).send('Error updating the product in database: ', error);
    });
  },

  // delete the product
  deleteProduct: function (req, res, next) {
    db.Product.findOne({ where: { id: req.body.id } })
    .then(function (product) {
      if(product === null) {
        res.status(400).send('We could not find the product in the database.');
      }
      product.destroy();
    })
    .then(function () {
      res.status(200).send('Successfully deleted the product');
    })
    .catch(function (error) {
      res.status(400).send('Error deleting the product in the database: ', error);
    }) 
  }

};


