var db = require('../db/db_config.js');
var util = require('../config/utils.js');
var jwt  = require('jwt-simple');
if(!process.env.TwilioSid) {
  var locally = require('../../sneakyLocal.js');
}
var client = require('twilio')(process.env.TwilioSid || locally.TwilioSid, process.env.TwilioAuthToken || locally.TwilioAuthToken);

module.exports = {

  // sends bid alert to seller
  newBid: function (req, res, next) {
    var product;
    var seller;
    var bidder = jwt.decode(req.body.token, 'secret');

    db.Product.findOne({ where: { id: req.body.productId } })
    .then(function (foundProduct) {
      product = foundProduct;
      return db.User.findOne({ where: { id: foundProduct.get('UserId') } });
    })
    .then(function(foundSeller){
      if(foundSeller === null) {
        res.status(400).send('Error creating new bid in database: We could not locate a seller for the product');
      }
      seller = foundSeller;
      return db.User.findOne({ where: { id: bidder.id } });
    })
    .then(function(foundBidder){
      bidder = foundBidder;

      client.sendMessage({

          to: seller.get('phoneNumber'), // Any number Twilio can deliver to
          from: '+18327695630', // A number you bought from Twilio and can use for outbound communication
          body: '' + bidder.get('firstName') + ' has bid ' + req.body.bidAmount + ' for your ' 
                + product.get('name') + ". Respond to them at " 
                + bidder.get('phoneNumber') + "."

      }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

          // "responseData" is a JavaScript object containing data received from Twilio.
          // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
          // http://www.twilio.com/docs/api/rest/sending-sms#example-1

          console.log('Response data:  ', responseData.from); // outputs "+18327695630"
          console.log('Response responseData.body: ', responseData.body); // outputs the actual message text
          res.status(400).send("Error creating twilio request: ", err);
        }
        res.status(200).send("Successfully sent message. Response data:", responseData);
      });
    })
      .catch(function(error) {
        res.status(400).send('Error creating new bid in database: ', error);
      })
  }
};
