require('dotenv').config({silent: true});

var express = require('express'),
  bodyParser = require('body-parser'),
  azure = require('azure-storage'),
  dataStore = initDataStore(),
  port = process.env.DEV_PORT || 80,
  app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/MailingList', function(req, res) {
  dataStore.addToEmailList(req.body);
  res.send('Thank you.');
});

app.listen(port, function() {
  console.log('Listening on port 3000.');
});

function initDataStore() {
  var azureTableName = process.env.AZURE_EMAIL_TABLE,
    azureTableService,
    dataStore = {
      addToEmailList: function() { console.log('[WARN] - Azure Data Store was not configured correctly. Fix and restart.'); }
    };

  function createTableStorageEntity(input) {
    var emailAddress = input.email;

    return {
      PartitionKey: { '_': 'phattimeEmails' },
      RowKey: { '_': emailAddress },
      email: { '_': emailAddress }
    }
  }

  function addToEmailList(info) {
    if (azureTableService) {
      azureTableService.createTableIfNotExists(azureTableName, function(error, result, response) {
        if (!error) {
          azureTableService.insertEntity(azureTableName, createTableStorageEntity(info), function(error, result, response) {
            if (!error) {
            }
          });
        }
      });
    }
  }

  if (azureTableName == undefined) {
    console.log('[WARN] - This isn\'t going to work without an AZURE_EMAIL_TABLE defined.');
    return dataStore;
  }

  try {
    azureTableService = azure.createTableService();
  }
  catch (error) {
    console.log('[WARN] - Could not create Azure Table Service connection, are AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY defined?');
    return dataStore;
  }

  dataStore.addToEmailList = addToEmailList;
  return dataStore;
}