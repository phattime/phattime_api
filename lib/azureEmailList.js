var azure = require('azure-storage');

module.exports = initDataStore();

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