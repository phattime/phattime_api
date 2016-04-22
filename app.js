require('dotenv').config({ silent: true });

var express = require('express'),
  bodyParser = require('body-parser'),
  emailService = require('./lib/azureEmailList.js'),
  port = process.env.port || 3000,
  app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/MailingList', function(req, res) {
  emailService.addToEmailList(req.body);
  res.send('Thank you.');
});

app.listen(port, function() {
  console.log('Listening on port 3000.');
});

