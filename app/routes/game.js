var express = require('express');
var router = express.Router();
var azure = require('azure-storage');
var blobService = azure.createBlobService();
var gameManager = require('../../lib/gameManager.js')(blobService);

router.get('/:gameId', function(req, res) {
  try {
    gameManager.getGame(req.params.gameId).then(function(blob) {
      res.status(200).json(blob);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

router.post('/update', function(req, res) {
  try {
    gameManager.updateGame(req.body).then(function(blob) {
      res.status(200).json(blob);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

router.post('/', function(req, res) {
  try {
    gameManager.startGame(req.body).then(function(blob) {
      res.status(200).json(blob);
    }).done();
  } catch(e) {
    res.status(500).json(e);
  }
});

module.exports = router;
