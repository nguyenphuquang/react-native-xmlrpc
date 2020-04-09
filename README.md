# react-native-xmlrpc
xmlrpc client for react-native
---

* Based on node-xmlrpc: https://github.com/baalexander/node-xmlrpc
* Remove server-side
* Replace http & https with superagent
* Replace sax with htmlparser2

## The What

The xmlrpc module is a pure JavaScript XML-RPC server and client for node.js.

Pure JavaScript means that the [XML parsing](https://github.com/isaacs/sax-js)
and [XML building](https://github.com/robrighter/node-xml) use pure JavaScript
libraries, so no extra C dependencies or build requirements. The xmlrpc module
can be used as an XML-RPC server, receiving method calls and responding with
method responses, or as an XML-RPC client, making method calls and receiving
method responses, or as both.

### To Install

```bash
npm install https://github.com/nguyenphuquang/react-native-xmlrpc
```

### To Use

A brief example:

```javascript
var xmlrpc = require('react-native-xmlrpc')

// Waits briefly to give the XML-RPC server time to start up and start
// listening
setTimeout(function () {
  // Creates an XML-RPC client. Passes the host information on where to
  // make the XML-RPC calls.
  var client = xmlrpc.createClient({ host: 'localhost', port: 9090, path: '/'})

  // Sends a method call to the XML-RPC server
  client.methodCall('anAction', ['aParam'], function (error, value) {
    // Results of the method response
    console.log('Method response for \'anAction\': ' + value)
  })

}, 1000)
```

Output from the example:

```
XML-RPC server listening on port 9090
Method call params for 'anAction': aParam
Method response for 'anAction': aResult
```

### Date/Time Formatting

XML-RPC dates are formatted according to ISO 8601. There are a number of
formatting options within the boundaries of the standard. The decoder detects
those formats and parses them automatically, but for encoding dates to ISO
8601 some options can be specified to match your specific implementation.


The formatting options can be set through
```xmlrpc.dateFormatter.setOpts(options);```, where the ```options```
parameter is an object, with the following (optional) boolean members:

* ```colons``` - enables/disables formatting the time portion with a colon as
separator (default: ```true```)
* ```hyphens``` - enables/disables formatting the date portion with a hyphen
as separator (default: ```false```)
* ```local``` - encode as local time instead of UTC (```true``` = local,
```false``` = utc, default: ```true```)
* ```ms``` - enables/disables output of milliseconds (default: ```false```)
* ```offset``` - enables/disables output of UTC offset in case of local time
(default: ```false```)


Default format: 20140101T11:20:00


UTC Example:
```javascript
xmlrpc.dateFormatter.setOpts({
  colons: true
, hyphens: true
, local: false
, ms: true
}) // encoding output: '2014-01-01T16:20:00.000Z'
```

Local date + offset example:
```javascript
xmlrpc.dateFormatter.setOpts({
  colons: true
, hyphens: true
, local: true
, ms: false
, offset: true
}) // encoding output: '2014-01-01T11:20:00-05:00'
```

### Cookies support

It is possible to turn on cookies support for XML-RPC client by special options
flag. If turned on then all the cookies received from server will be bounced
back with subsequent calls to the server. You also may manipulate cookies
manually by the setCookie/getCookie call.

```javascript
var client = xmlrpc.createClient({
  host: 'localhost',
  port: 9090,
  cookies: true
});

client.setCookie('login', 'bilbo');

//This call will send provided cookie to the server
client.methodCall('someAction', [], function(error, value) {
  //Here we may get cookie received from server if we know its name
  console.log(client.getCookie('session'));
});

```

### Custom Types
If you need to parse to a specific format or need to handle custom data types
that are not supported by default, it is possible to extend the serializer
with a user-defined type for your specific needs.

A custom type can be defined as follows:
```javascript
var xmlrpc = require('xmlrpc');
var util = require('util');

// create your custom class
var YourType = function (raw) {
  xmlrpc.CustomType.call(this, raw);
};

// inherit everything
util.inherits(YourType, xmlrpc.CustomType);

// set a custom tagName (defaults to 'customType')
YourType.prototype.tagName = 'yourType';

// optionally, override the serializer
YourType.prototype.serialize = function (xml) {
  var value = somefunction(this.raw);
  return xml.ele(this.tagName).txt(value);
}
```

and then make your method calls, wrapping your variables inside your new type
definition:

```javascript
var client = xmlrpc.createClient('YOUR_ENDPOINT');
client.methodCall('YOUR_METHOD', [new YourType(yourVariable)], yourCallback);
```

