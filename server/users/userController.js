var db = require('../db/db_config.js');
var jwt  = require('jwt-simple');

module.exports = {

  // signing in a user by doing the following:
  // first, checking to see if the user exists in the db
  // then, comparing the password provided against the 
  // password in the db
  // then, encoding the user and sending back the token
  signin: function (req, res, next) {
    db.User.findOne({
      where: {email: req.body.email}
    })
    .then( function (user) {
      if (!user) {
        next(new Error('User does not exist!'));
      } else {
        return user.comparePasswords(req.body.password)
        .then(function (foundUser) {
          if (foundUser) {
            var token = jwt.encode(user, 'secret');
            res.json({token: token});
          } else {
            return next(new Error('No user'));
          }
        });
      }
    })
    .catch(function (error) {
      next(error);
    });
  },

  // signing up a user by doing the following:
  // first, see if the user already exists in the db
  // then, create the user in the db
  // then, encode the user and return the token
  signup: function (req, res, next) {
    db.User.findOne({
      where: {email: req.body.email}
    })
    .then(function (user) {
      if (user) {
        next(new Error('User already exists!'));
      } else {
        return db.User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          password: req.body.password
        });
      }
    })
    .then(function (user) {
      var token = jwt.encode(user, 'secret');
      res.json({token: token});
    })
    .catch(function (error) {
      next(error);
    });
  },

  // checking to see if the user is authenticated
  // grab the token in the header is any
  // then decode the token, which we end up being the user object
  // check to see if that user exists in the database
  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      db.User.findOne({where: {email: user.email}})
      .then(function (foundUser) {
        console.log('foundUser is ', foundUser);
        if (foundUser) {
          res.send(200);
        } else {
          res.send(401);
        }
      })
      .catch(function (error) {
        next(error);
      });
    }
  }
};