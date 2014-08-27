var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.writeHead(200);
  res.end("It's alive!")
});

module.exports = router;

