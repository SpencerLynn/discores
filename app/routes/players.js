var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var blobService = azure.createBlobService();
var playerManager = require('../../lib/playerManager.js')(blobService);

router.get('/', function(req, res) {
  try {
    playerManager.getPlayers().then(function(players) {
      res.json(200, players);
    }).done();
  } catch(e) {
    res.json(500, e);
  }
});

router.post('/', function(req, res) {
  try {
    playerManager.createPlayer(req.body).then(function(blob) {
      res.json(200, blob);
    }).done();
  } catch(e) {
    res.json(500, e);
  }
});

module.exports = router;
