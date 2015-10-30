var Sequelize = require('sequelize');
var bcrypt   = require('bcrypt-nodejs');
var Q        = require('q');
var SALT_WORK_FACTOR = 10;

if (process.env.DATABASE_URL) {
  var orm = new Sequelize(process.env.DATABASE_URL, {  // Username & password are part of URL so separate variables are not needed here.
    dialect: 'mysql',
    logging: true
  });
} else {
  // Arguments are: [Database name], [Username], [Password]
  var orm = new Sequelize('shwopDB', 'root', '', {
    dialect: 'mysql',
    logging: true
  });
}

////////////////////////////////////
////// Create table/model schemas
////////////////////////////////////

//define the user model
var User = orm.define('User', {
  firstName:   { type: Sequelize.STRING(25) },
  lastName:    { type: Sequelize.STRING(25) },
  phoneNumber: { type: Sequelize.STRING(20), allowNull: false },
  email:       { type: Sequelize.STRING(50), allowNull: false, unique: true },
  password:    { type: Sequelize.STRING(100), allowNull: false },
  address1:    { type: Sequelize.STRING(50) },
  address2:    { type: Sequelize.STRING(50) },
  city:        { type: Sequelize.STRING(25) },
  state:       { type: Sequelize.STRING(12) },
  zip:         { type: Sequelize.STRING(10) },
  country:     { type: Sequelize.STRING(20) },
  latitude:    { type: Sequelize.FLOAT(40) },
  longitude:   { type: Sequelize.FLOAT(40) }
},{
  instanceMethods: {
    //compare passwords when a user is signing in
    comparePasswords: function (candidatePassword) {
      var defer = Q.defer();
      bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
          defer.reject(err);
        } else {
          defer.resolve(isMatch);
        }
      });
      return defer.promise;
    }
  }
});

//before a user is created encrypt the password
User.beforeCreate(function (user, options, next) {
  return bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return options();
    }
    return bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return options(err);
      }
      user.password = hash;
      next();
    });
  });
});

//define the product model
var Product = orm.define('Product', {
  name:     { type: Sequelize.STRING(50), allowNull: false},
  photoURL: { type: Sequelize.STRING(150), allowNull: false},
  price:    { type: Sequelize.DECIMAL(10, 2), allowNull: false}
});

//create association between user model and product model
Product.belongsTo(User); // This will add UserId attribute to Product to hold the primary key value for User
User.hasMany(Product);

//define the tag model
var Tag = orm.define('Tag', {
  tagName: Sequelize.STRING(100)
});

//define the product_tag model
var Product_Tag = orm.define('Product_Tag', {
  // id: {
  //   type: Sequelize.INTEGER,
  //   primaryKey: true
  // }
});

// Join Table:
// Creates a new model called product_tag with the equivalent
// foreign keys ProductID and UserId. 
Tag.belongsToMany(Product, {through: 'Product_Tag'});
Product.belongsToMany(Tag, {through: 'Product_Tag'});


//define the bid model
var Bid = orm.define('Bid', {
  bidAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false}
});

Bid.belongsTo(User); // This will add UserId attribute to Bid to hold the primary key value for User 
Bid.belongsTo(Product); // This will add ProductId attribute to Bid to hold the primary key value for Product 






////////////////////////////////////
////// Sync models to the database
////////////////////////////////////

// REMOVED FROM CODE: {force: true} - adds a DROP TABLE IF EXISTS before
// trying to create the table
User.sync()  
  .then(function () {
    Product.sync();
  })
  .then(function () {
    Tag.sync();
  })
  .then(function() {
    Bid.sync();
  })
  .then(function () {
    Product_Tag.sync();
  })
  .catch(function (error) {
    console.log('Error in database sync:' + error);
  });
// orm.sync()
// .then(function () {
//   console.log('Database synced.');
// });

////////////////////////////////////
////// Export each model
////////////////////////////////////

exports.User = User;
exports.Product = Product;
exports.Tag = Tag;
exports.Bid = Bid;
// Not sure we'll need this, exporting for convenience in testing. 
exports.Product_Tag = Product_Tag;
exports.Orm = orm;
