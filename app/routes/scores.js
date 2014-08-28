var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.writeHead(200);
  res.end("OMG! This is where scores would be!");
});

module.exports = router;
