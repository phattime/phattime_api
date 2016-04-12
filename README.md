# phattime_api
API for PhatTime services

## Development

### Get dependencies
    npm install
    
If you do nothing else, the api will work and you can post to it locally.  It will not write to the data store because it will detect you did not configure the data store environment.

### Set up environment variables

If you have an Azure Storage Account and Key plus the Table name you want to save at, put these env variables in a .env file in the root folder:
    
    AZURE_STORAGE_ACCOUNT=<storage account name>
    AZURE_STORAGE_ACCESS_KEY=<key here>
    AZURE_EMAIL_TABLE=<table to store email information in>
    
.env is in .gitignore.  Do not commit your secrets.
