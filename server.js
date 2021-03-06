var express = require('express');
var app = express();

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile('public/index.html', { root: __dirname });
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
