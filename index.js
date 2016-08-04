var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static('client'));

app.get('/', function (req, res) {
  res.sendFile('client/index.html', {root: __dirname })
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 5000!');
});