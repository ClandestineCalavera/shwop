var userController = require('./userController.js');
var userController = require('../users/userController.js');

module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.get('/signedin', userController.checkAuth);
  app.get('/profile', userController.checkAuth, userController.userInfo);
  app.post('/update', userController.checkAuth, userController.updateUser);
  app.get('/:userId', userController.checkAuth, userController.getUserLocation)
};
