var expect = require('chai').expect;
var bidController = require('../../server/bids/bidController.js');
var productController = require('../../server/products/productController.js');
var userController = require('../../server/users/userController.js');
var request = require('supertest');
var app = require('../../server/server.js');

describe('the userController', function () {
  describe('the userController object', function () {

    it('should be an object', function () {
      expect(userController).to.be.a('object');
    });

    it('should have all the necessary methods', function () {
      expect(userController).to.have.property('signin');
      expect(userController).to.have.property('signup');
      expect(userController).to.have.property('checkAuth');
      expect(userController).to.have.property('userInfo');
      expect(userController).to.have.property('updateUser');
      expect(userController).to.have.property('getUserLocation');
    });

  });
});

describe('the userController methods', function () {
  var token;
  var testUser;

  var generateUserEmail = function () {
    var chars = '1234567890abcdefghijklmnopqrstuvwxyz';
    var email = '';
    for (var i = 0; i < 10; i++) {
      email += chars[Math.floor(Math.random() * chars.length)];
    }
    email+='@user.com';
    return email;
  };

  describe('Sign up a user', function () {


    var testEmail = generateUserEmail();

    testUser = {
      email      : testEmail,
      password   : 'test',
      firstName  : 'tester',
      lastName   : 'testerson',
      phoneNumber: '1231231234',
      zip        : 94112
    };

    it('should sign up a new user and return a token', function (done) {
      request(app)
        .post('/api/users/signup')
        .send(testUser)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.body.token).to.exist;
          token = res.body.token;
          done();
        });
    });

    it('should find new user on the database', function (done) {
      request(app)
        .get('/api/users/profile')
        .set('x-access-token', token)
        .end(function (err, res) {
          if (err) throw err;
          expect(res.body.userInfo).to.exist;
          done();
        });
    });

    it('should error when looking for user and token is not provided', function (done) {
      request(app)
        .get('/api/users/profile')
        .expect(500)
        .end(done);
    });

  });

  describe('Sign in a user', function () {
    it('should sign in the user and return a token', function (done) {
      request(app)
        .post('/api/users/signin')
        .send({email: testUser.email, password: testUser.password})
        .end(function (err, res) {
          expect(res.body.token).to.exist;
          done();
        });
    });

    it('should fail to sign in when wrong password is supplied', function (done) {
      request(app)
        .post('/api/users/signin')
        .send({email: testUser.email, password: 'wrongpassword'})
        .expect(400)
        .end(done);
    });

  });

  describe('Update a user', function () {

    var updatedUser = {
      firstName  : 'updater',
      lastName   : 'updaterson',
      email      : testUser.email,
      phoneNumber: '0980980987',
      address1: '123 45th st.',
      address2: 'Apt 67',
      city: 'San Francisco',
      state: 'CA',
      zip: 94112
    };

    it('should successfully update a user', function (done) {
      request(app)
        .post('/api/users/update')
        .set('x-access-token', token)
        .send(updatedUser)
        .expect(200)
        .end(done);
    });

    // it('should fail to sign in when wrong password is supplied', function (done) {
    //   request(app)
    //     .post('/api/users/signin')
    //     .send({email: testUser.email, password: 'wrongpassword'})
    //     .expect(400)
    //     .end(done);
    // });

  });
});

describe('the productController', function () {
  describe('the productController object', function () {

    it('should be an object', function () {
      expect(productController).to.be.a('object');
    });

    it('should have all the necessary methods', function () {
      expect(productController).to.have.property('allProducts');
      expect(productController).to.have.property('productsByTags');
      expect(productController).to.have.property('newProduct');
      expect(productController).to.have.property('updateProduct');
      expect(productController).to.have.property('addTags');
      expect(productController).to.have.property('removeTags');
      expect(productController).to.have.property('deleteProduct');
      expect(productController).to.have.property('userProducts');
      expect(productController).to.have.property('productTags');
    });

  });
});


describe('the productController methods', function () {
  describe('/', function () {

    it('should send 200 status on GET', function () {
      request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) throw err;
        });
    });

  });
});


describe('the bidController', function () {
  describe('the bidController object', function () {

    it('should be an object', function () {
      expect(bidController).to.be.a('object');
    });

    it('should have all the necessary methods', function () {
      expect(bidController).to.have.property('newBid');
      expect(bidController).to.have.property('oldMessageHandler');
      expect(bidController).to.have.property('allBids');
      expect(bidController).to.have.property('deleteBid');
      expect(bidController).to.have.property('messageHandler');
    });

  });
});
