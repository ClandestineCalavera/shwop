var db = require('../config/db_config.js');
var Product = require('./productModel.js');
var Q = require('q');  // a library for promises
var util = require('../config/utils.js');


module.exports = {

  // retrieve all the products from the database
  allProducts: function (req, res, next) {
    var findAll = Q.nbind(Product.find, Product);

    findAll({})
      .then(function (products) {
        res.send({products: products});
      })
      .fail(function (error) {
        next(error);
      });
  },

  // adds a new product to the database
  newProduct: function (req, res, next) {

    var product = req.body;
    // var url = req.body.url;
    // var createLink = Q.nbind(Link.create, Link);
    // var findLink = Q.nbind(Link.findOne, Link);

    // findLink({url: url})
    //   .then(function (match) {
    //     if (match) {
    //       res.send(match);
    //     } else {
    //       return util.getUrlTitle(url);
    //     }
    //   })
    //   .then(function (title) {
    //     if (title) {
    //       var newLink = {
    //         url: url,
    //         visits: 0,
    //         base_url: req.headers.origin,
    //         title: title
    //       };
    //       return createLink(newLink);
    //     }
    //   })
    //   .then(function (createdLink) {
    //     if (createdLink) {
    //       res.json(createdLink);
    //     }
    //   })
    //   .fail(function (error) {
    //     next(error);
    //   });
  },

  updateProduct: function (req, res, next) {
    // update the product
  },

  deleteProduct: function (req, res, next) {
    // delete the product
  }

};


