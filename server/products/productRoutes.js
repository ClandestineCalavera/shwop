var productController = require('./productController.js');
var userController = require('../users/userController.js');
if(!process) {
  var process = require('../../sneakyLocal.js')
};


module.exports = function (app) {
  // app === productRouter injected from middleware.js

  // app.param will hijack any request with a 'code' parameter on in
  // like line 16 below. That code will actually be the shortned url
  // so the real URL will be pre fetched from mongo and attached to
  // req.navLink before it reaches line 16.

  // app.param('tags', productController.productByTags);

  app.route('/')
    .get(userController.checkAuth, productController.allProducts)
    .post(userController.checkAuth, productController.newProduct)
    .put(userController.checkAuth, productController.updateProduct)
    .delete(userController.checkAuth, productController.deleteProduct);

  app.get('/keys', userController.checkAuth, function(req, res) {
      res.json({
        'X-Parse-Application-Id': process.env['ParseAppId'],
        'X-Parse-REST-API-Key': process.env['ParseRestKey']
      });
  });

  app.get('/:tags', userController.checkAuth, productController.productsByTags);
};
