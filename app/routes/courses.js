var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var blobService = azure.createBlobService();
var courseManager = require('../../lib/courseManager.js')(blobService);

router.get('/', function(req, res) {
  try {
    courseManager.query().then(function(courses) {
      res.status(200).json(courses);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

router.post('/', function(req, res) {
  try {
    courseManager.save(req.body).then(function(blob) {
      res.status(200).json(blob);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

module.exports = router;
