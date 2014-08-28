var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var blobService = azure.createBlobService();
var courseManager = require('../../lib/courseManager.js')(blobService);

router.get('/', function(req, res) {
  try {
    courseManager.query().then(function(courses) {
      res.json(200, courses);
    }).done();
  } catch(e) {
    res.json(500, e);
  }
});

router.post('/', function(req, res) {
  try {
    courseManager.save(req.body).then(function(blob) {
      res.json(200, blob);
    }).done();
  } catch(e) {
    res.json(500, e);
  }
});

module.exports = router;
