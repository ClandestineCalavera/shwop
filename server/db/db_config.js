var Sequelize = require('sequelize');
var bcrypt   = require('bcrypt-nodejs');
var Q        = require('q');
var SALT_WORK_FACTOR = 10;

if (process.env.DATABASE_URL) {
  console.log("DATABASE_URL!");
  // Arguments are: [Database name], [Username], [Password]
  var orm = new Sequelize(process.env.DATABASE_URL, dbUserName, dbPassword, {
    dialect: 'mysql',
    logging: false
  });
} else {
  // Arguments are: [Database name], [Username], [Password]
  var orm = new Sequelize('shwopDB', 'root', '', {
    dialect: 'mysql',
    logging: false
  });
}


////////////////////////////////////
////// Create table/model schemas
////////////////////////////////////


var User = orm.define('User', {
  firstName: Sequelize.STRING(25),
  lastName: Sequelize.STRING(25),
  phoneNumber: { type: Sequelize.STRING(20), allowNull: false},
  email: { type: Sequelize.STRING(50), allowNull: false, unique: true},
  latitude: Sequelize.FLOAT(40),
  longitude: Sequelize.FLOAT(40),
  password: Sequelize.STRING(100),
  salt: Sequelize.STRING(100)
},{
  instanceMethods: {
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
      user.salt = salt;
      next();
    });
  });
});

var Product = orm.define('Product', {
  name:     { type: Sequelize.STRING(50), allowNull: false},
  photoURL: { type: Sequelize.STRING(150), allowNull: false},
  price:    { type: Sequelize.DECIMAL(10, 2), allowNull: false}
});

Product.belongsTo(User); // This will add UserId attribute to Product to hold the primary key value for User
User.hasMany(Product);

var Tag = orm.define('Tag', {
  tagName: Sequelize.STRING(100)
});

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
// Not sure we'll need this, exporting for convenience in testing. 
exports.Product_Tag = Product_Tag;
exports.Orm = orm;
