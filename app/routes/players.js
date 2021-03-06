var express = require('express');
var router = express.Router();
var _ = require('lodash');
var azure = require('azure-storage');
var blobService = azure.createBlobService();
var playerManager = require('../../lib/playerManager.js')(blobService);

router.get('/', function(req, res) {
  try {
    playerManager.getPlayers().then(function(players) {
      res.status(200).json(players);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

router.get('/:playerId/games', function(req, res) {
  try {
    playerManager.getPlayersGames(req.params.playerId).then(function(gameIds) {
      res.status(200).json(gameIds);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

router.get('/:playerId', function(req, res) {
  try {
    playerManager.getPlayers().then(function(players) {
      var player = _.find(players, function(p) {
        return p.id === req.params.playerId;
      });

      res.status(200).json(player);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

router.post('/', function(req, res) {
  try {
    playerManager.createPlayer(req.body).then(function(blob) {
      res.status(200).json(blob);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

module.exports = router;
