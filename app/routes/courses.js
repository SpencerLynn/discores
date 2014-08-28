var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var courseManagerCreator = require('../../lib/courseManager.js');

router.get('/', function(req, res) {
  res.writeHead(200);
  res.end("It's alive!");
});

router.post('/', function(req, res) {
  try {
    var body = req.body;

    var blobService = azure.createBlobService();
    var courseManager = courseManagerCreator(blobService);

    courseManager.save(body).then(function(blob) {
      res.json(200, blob);
    });
  } catch (e) {
    res.json(500, e);
  }
});

module.exports = router;
