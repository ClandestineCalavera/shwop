var db = require('../db/db_config.js');
var jwt  = require('jwt-simple');
var helpers = require('../db/helpers.js');

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
        res.status(400).send('We could not locate the user in the database.');
      } else {
        return user.comparePasswords(req.body.password)
        .then(function (foundUser) {
          if (foundUser) {
            var token = jwt.encode(user, 'secret');
            res.json({token: token});
          } else {
            res.status(400).send('We could not locate the user in the database.');
          }
        });
      }
    })
    .catch(function (error) {
      res.status(400).send('Error on sign in within the database: ' + error);
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
          password: req.body.password,
          address1: req.body.address1,
          address2: req.body.address2,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          country: req.body.country         
        });
      }
    })
    .then(function (user) {
      var token = jwt.encode(user, 'secret');
      res.json({token: token});
    })
    .then(function () {
      helpers.addLongAndLat(req.body);
    })
    .then(function (result) {
      console.log('Successfully added longitude and latitude');
    })
    .catch(function (error) {
      res.status(400).send('Error on sign in within the database: ' + error);
    });
  },

  // checking to see if the user is authenticated
  // grab the token in the header is any
  // then decode the token, which we end up being the user object
  // check to see if that user exists in the database
  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      res.status(401).send('get outta here ya bum you have no token');
    } else {
      var user = jwt.decode(token, 'secret');
      db.User.findOne({where: {email: user.email}})
      .then(function (foundUser) {
        if (foundUser) {
          next();
        } else {
          res.status(401).send('no matching user found');
        }
      })
      .catch(function (error) {
        res.status(500).send('get outta here');
      });
    }
  },

  userInfo: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'secret');
    db.User.findOne({
      where: { id: user.id }
    })
    .then( function (foundUser) {
      if (!foundUser) {
        next(new Error('User does not exist!'));
      } else {
        var userInfo = {};
        userInfo.firstName = foundUser.firstName;
        userInfo.lastName = foundUser.lastName;
        userInfo.phoneNumber = foundUser.phoneNumber;
        userInfo.email = foundUser.email;
        userInfo.address1 = foundUser.address1;
        userInfo.address2 = foundUser.address2;
        userInfo.city = foundUser.city;
        userInfo.state = foundUser.state;
        userInfo.zip = foundUser.zip;
        userInfo.latitude = foundUser.latitude;
        userInfo.longitude = foundUser.longitude;
        res.send({ userInfo: userInfo });
      }
    })
    .catch(function (error) {
      next(error);
    });
  },

  updateUser: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'secret');
    db.User.update({ 
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address1: req.body.address1,
      address2: req.body.address2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
    }, {
      where: {
        id: user.id
      }
    })
    .then(function () {
      res.send(200);
    })
    .then(function () {
      helpers.addLongAndLat(req.body);
    })
    .then(function (result) {
      console.log('Successfully added longitude and latitude');
    })
    .catch(function (error) {
      next(error);
    });
  },

  getUserLocation: function (req, res, next) {

    var UserId = req.params.userId;

    db.User.findOne({
      where: { id: UserId}
    })
    .then( function (foundUser) {
      if (!foundUser) {
        next(new Error('User does not exist!'));
      } else {
        var userInfo = {};
        userInfo.latitude = foundUser.latitude;
        userInfo.longitude = foundUser.longitude;
        res.send({ userInfo: userInfo });
      }
    })
    .catch(function (error) {
      next(error);
    });


  }

};