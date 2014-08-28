var express = require('express');
var router = express.Router();
var courseManager = require('../../lib/courseManager.js');

router.get('/', function(req, res) {
  res.writeHead(200);
  res.end("It's alive!");
});

router.post('/', function(req, res) {
  var body = req.body;

  courseManager.save(body).then(function(blob) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.write(JSON.stringify(blob));
    res.end();
  });
});

module.exports = router;
