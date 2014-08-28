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
      res.writeHead(200, { 'content-type': 'application/json' });
      res.write(JSON.stringify(blob));
      res.end();
    });
  } catch (e) {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.write(JSON.stringify(e));
    res.end();
  }
});

module.exports = router;
