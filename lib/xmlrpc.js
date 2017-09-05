var request = require('superagent');
var Serializer = require('./Serializer');

function Client(url) {
  this.url = url;
}

var proto = Client.prototype;
proto.call = function(method, params, cb) {
  var xml = Serializer.serializeMethodCall(method, params, 'utf8');

  request
    .post(this.url)
    .send(xml)
    .end(function(err, res) {
      if(err) return cb(err);
      cb(null, res.text);
    });
};

module.exports = Client;
