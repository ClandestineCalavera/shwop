var Sequelize = require('sequelize');
// Arguments are: [Database name], [Username], [Password]
var orm = new Sequelize('shwopDB', 'root', '', {
  dialect: 'mysql'
});


////////////////////////////////////
////// Create table/model schemas
////////////////////////////////////

var User = orm.define('User', {
  firstName: Sequelize.STRING(25),
  lastName: Sequelize.STRING(25),
  phoneNumber: Sequelize.STRING(20),
  email: Sequelize.STRING(20),
  latitude: Sequelize.FLOAT(40),
  longitude: Sequelize.FLOAT(40),
  hash: Sequelize.STRING(100),
  salt: Sequelize.STRING(100)
});

var Product = orm.define('Product', {
  photoURL: Sequelize.STRING,
  price: Sequelize.DECIMAL,
});

Product.belongsTo(User); // This will add UserId attribute to Product to hold the primary key value for User

var Tag = orm.define('Tag', {
  tagName: Sequelize.STRING(100)
});

// Join Table:
// Creates a new model called product_tag with the equivalent
// foreign keys ProductID and UserId. 
Tag.belongsToMany(Product, {through: 'Product_Tag'});
Product.belongsToMany(Tag, {through: 'Product_Tag'});

////////////////////////////////////
////// Sync models to the database
////////////////////////////////////

// {force: true} - adds a DROP TABLE IF EXISTS before
// trying to create the table
User.sync({force: true})  
  .then(function () {
    Product.sync({force: true})
  })
  .then(function () {
    Tag.sync({force: true})
  })
  .then(function () {
    Product_Tag.sync({force: true})
  })
  .catch(function(error) {
    console.log('Error in database sync:' + error);
  });

////////////////////////////////////
////// Export each model
////////////////////////////////////

module.exports = User;
module.exports = Product;
module.exports = Tag;