var db = require('../../server/db/db_config.js');
var Promise = require('bluebird');
var helpers = require('../../server/db/helpers.js');

//dummy user data
var users = [
 { firstName: 'Michael',
   lastName: 'Jordan',
   phoneNumber: '(232)323-1995',
   email: 'michael@jordan.com',
   password: 'michael'
 },
 { firstName: 'Bill',
   lastName: 'Gates',
   phoneNumber: '(101)111-1001',
   email: 'bill@microsoft.com',
   password: 'bill'
 },
 { firstName: 'Donkey',
   lastName: 'Kong',
   phoneNumber: '(808)888-8181',
   email: 'donkey@nintendo.com',
   password: 'donkey'
 },
 { firstName: 'Ray',
   lastName: 'Ban',
   phoneNumber: '(777)777-7777',
   email: 'me@rayban.com',
   password: 'ray'
 }
];

// //dummy product data
var products = [
  { name: 'Nintendo 64 - grey',
    photoURL: 'http://i.imgur.com/ITxLVsn.jpg',
    price: 64.00,
    tags: ['nintendo', '64', 'grey', 'videogames', 'electronics'],
    // UserId: '3'
  },
  { name: 'ray ban sunglasses',
    photoURL: 'http://i.imgur.com/5ESVFt2.jpg',
    price: 100.00,
    tags: ['sunglasses', 'rayban', 'ray', 'bans', 'black', 'accessories'],
    // UserId: '4'
  },
  { name: 'xbox 360 with 1 working controller',
    photoURL: 'http://i.imgur.com/1AyzZOH.jpg',
    price: 360.00,
    tags: ['xbox', 'xbox 360', 'videogames', 'microsoft', 'controller', 'black'],
    // UserId: '2'
  },
  { name: 'donkey kong (Special Edition) for Supernintendo',
    photoURL: 'http://i.imgur.com/4nJFSwP.jpg',
    price: 1000.45,
    tags: ['donkey kong', 'donkey', 'kong', 'nintendo', 'videogames', 'electronics', 'games', 'supernintendo'],
    // UserId: '3'
  },
  { name: 'air jordan VII shoes',
    photoURL: 'http://i.imgur.com/Xz4kxFI.jpg',
    price: 7000.00,
    tags: ['jordan', 'nike', 'basketball', 'shoes', 'mens', 'apparel', 'black'],
    // UserId: '1'
  },
  { name: 'donkey kong retro womens tank top',
    photoURL: 'http://i.imgur.com/Rj13NmR.jpg',
    price: 12.99,
    tags: ['donkey kong', 'donkey', 'kong', 'retro', 'tank', 'top', 'shirt', 'apparel', 'womens'],
    // UserId: '3'
  },
];

var tags = [
  {tagName: 'nintendo'},
  {tagName: 'xbox'},
  {tagName: 'jordan'},
  {tagName: 'nike'},
  {tagName: 'retro'},
  {tagName: 'tank'},
  {tagName: 'videogames'},
  {tagName: 'ray'},
  {tagName: 'bans'},
  {tagName: 'grey'},
];

var promises = [];
promises.push(db.User.bulkCreate(users));
promises.push(db.Product.bulkCreate(products));
promises.push(db.Tag.bulkCreate(tags));

Promise.all(promises)
.then(function (results) {
  // console.log('results is', results.length);
  return console.log('Dummy data created!\nWe are not sure why this takes so long to complete...');
});


///////////////////////////////////////////////
//// Adds associated datat to the database
///////////////////////////////////////////////

var newUser = { 
      firstName: 'Michael',
      lastName: 'Jordan',
      phoneNumber: '(232)323-1995',
      email: 'michael@jordan.com',
      password: 'bulls4ever'
    };

var product;
var user;
var tagsArr = [];
var names = ['Bobblehead', 'Baseball', 'Ken Griffey Jr', 'Sports & Outdoors', 'Seattle'];
for(var i = 0; i < names.length; i++) {
  tagsArr.push(db.Tag.findOrCreate({where: { tagName: names[i] }}));
}
tagsArr.push(db.User.create(newUser));
tagsArr.push(db.Product.create({
              name: 'ken griffey jr bobblehead',
              photoURL: 'http://ecx.images-amazon.com/images/I/71Wu19At9QL._SY355_.jpg',
              price: 55.55
              })
);

var tagsArr2 = [];
var names2 = ['Bat', 'Baseball', 'Mike Trout', 'Los Angeles', 'Angels', 'Sports & Outdoors'];
for(var i = 0; i < names2.length; i++) {
  tagsArr2.push(db.Tag.findOrCreate({where: { tagName: names2[i] }}));
}
tagsArr2.push(db.Product.create({
              name: 'mike trout baseball bat',
              photoURL: 'http://battingleadoff.com/wp-content/uploads/2014/04/mag_miller_trout01jr_576.jpg',
              price: 20.99
              })
);


Promise.all(tagsArr)
.spread(function () {
  var args = Array.prototype.slice.call(arguments);
  product = args.pop();
  user = args.pop();

  var results = [];
  for(var i = 0; i < args.length; i++) {
    results.push(args[i][0]);
  }
  // Save
  return product.setTags(results);
})
.then(function(results) {
  // saved!
  return product.setUser(user);
  console.log('saved1! ');
})
.then(function () {
  return Promise.all(tagsArr2);
})
.spread(function () {
  var args = Array.prototype.slice.call(arguments);
  var product = args.pop();

  var results = [];
  for(var i = 0; i < args.length; i++) {
    results.push(args[i][0]);
  }
  // Save
  return product.setTags(results);
})
.then(function(results) {
  // saved!
  console.log('Associated tag entries are saved!');
});
