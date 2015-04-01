var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var blobService = azure.createBlobService();

router.get('/', function(req, res) {
  
});

module.exports = router;
