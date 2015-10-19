var expect = require('chai').expect;

describe('Database', function () {
  var db = require('../../server/db/db_config.js');
  describe('Products table', function () {
    var JSONresponse;

    before(function () {

      JSONresponse = { products: 
        [{ name: 'book', photoURL: 'http://placehold.it/120x120&text=image1', price: 50.00 },
         { name: 'racecar', photoURL: 'http://placehold.it/120x120&text=image2', price: 15.25 },
         { name: 'wallet', photoURL: 'http://placehold.it/120x120&text=image3', price: 101.99 }]
      };
    });

    beforeEach(function (done) {
      console.log('Executing before protocol.');

    // Disable the check for foreign keys to enable TRUCATE. Otherwise, we cannot clear b/c of constraints
    db.Orm.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function(){
        return db.Orm.sync({ force: true });
    })
    .then(function(){

        return db.Orm.query('SET FOREIGN_KEY_CHECKS = 1')
    })
    .then(function(){
        console.log('Database synchronised.');
        done();
    })
    .catch(function(error) {
      console.log('Found an error: ', error);
      done();
    })
          

    });

    describe('Create one record', function () {
      it('should create one record and find within database', function (done) {
        
        db.Product.create({
          name: 'old couch',
          photoURL: 'http://placehold.it/120x120&text=image1',
          price: 50.52 
        })
        .then(function() {
          db.Product.findOne({
            where: {name: 'old couch'}
          })
          .then(function(product) {
            expect(product).to.exist;
            expect(product.dataValues.name).to.equal('old couch');
            done();
          });
        });

      });

    });

    describe('Create multiple records', function () {
      it('should create 3 records and find within database', function (done) {
        
        db.Product.bulkCreate(JSONresponse.products)
          .then(function () {
            console.log('products created');
          })
        .then(function () {
          db.Product.findAll()
          .then(function (products) {
            expect(products.length).to.equal(3);
            done();
          });
        });

      });
    });

    describe('Delete specific records', function () {
      it('should find one record and delete from database', function (done) {
        
        db.Product.bulkCreate(JSONresponse.products)
          .then(function () {
            console.log('products created');
          })
        .then(function () {
          return db.Product.findOne({where: {name: 'book'}})
        })
        .then(function (product) {
          return product.destroy()
        })
        .then(function() {
          console.log('Model destoryed.');
          return db.Product.findOne({where: {name: 'book'}})
        })
        .then(function(product) {
          console.log('Result of find operation: ', product);
          expect(product).to.equal(null);
          return db.Product.findOne({where: {name: 'racecar'}})
        })
        .then(function(product) {
          console.log('Result of find operation: ', product.dataValues.name);
          expect(product.dataValues.name).to.equal('racecar');
          done();
        })
        .catch(function(error) {
          Console.log("Found this error:  ", error);
        })
      });
    });


    // describe('Not find a record that doesn\'t exist', function () {
    //   it('should throw error when looking for non-existant record', function (done) {
        
    //     var findNonExistantProduct = function () {
    //       return db.Product.findOne({
    //         where: {name: 'wallet'}
    //       }).then(function (product) {
    //         console.log('found the product');
    //         return product;
    //         done();
    //       }).catch(function () {
    //         console.log('in the catch statement');
    //         throw err;
    //         done();
    //       });
    //     };

    // //     expect(findNonExistantProduct()).to.throw(Error);
    // //   });
    // // });

    describe('Updating a product record', function () {
      it('should create a product record and update its price', function (done) {
        var priceBefore = 24.24;
        var priceAfter = 99.99;

        db.Product.create({
          name: 'ken griffey jr bobblehead',
          photoURL: 'http://placehold.it/120x120&text=image1',
          price: priceBefore
        })
        .then(function () {
          return db.Product.findOne({
            where: {name: 'ken griffey jr bobblehead'}
          });
        })
        .then(function (product) {
          expect(product.get('price')).to.equal(priceBefore);
        })
        .then(function () {
          return db.Product.update({ price: priceAfter }, {
            where: { name:'ken griffey jr bobblehead' }
          });
        })
        .then(function () {
          return db.Product.findOne({
            where: {name: 'ken griffey jr bobblehead'}
          });
        })
        .then(function (product) {
          expect(product.get('price')).to.equal(priceAfter);
          done();
        });
      });
    });

  });
});

// Check if one item was inputted 



// Check data was added to the Products table in DB

// Get all query to DB, should return 3 products

