var Q = require('q');
var uuid = require('node-uuid');
var _ = require('underscore');
var blobServiceHelper = require('./blobServiceHelper.js');
var gameManager = require('./gameManager.js');

module.exports = function(blobService) {
  return {
    blobService: blobService,
    getPlayers: function() {
      var d = Q.defer();

      try {
        blobService.getBlobToText('players', 'playerIndex', function(err, results) {
          if (err) {
            d.reject(err);
          } else {
            d.resolve(JSON.parse(results));
          }
        });
      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    },

    getPlayersGames: function(playerId) {
      var d = Q.defer();

      try {
        blobService.getBlobToText('players', playerId, function(err, results) {
          var gameIds = JSON.parse(results);
          var gManager = gameManager(blobService);

          var gamePromises = gameIds.map(function(id) {
            return gManager.getGame(id);
          });

          Q.all(gamePromises).then(function(games) {
            d.resolve(games);
          }, function(error) {
            throw error;
          });

        });
      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    },

    createPlayer: function(playerToSave) {
      var d = Q.defer();

      try {
        blobServiceHelper.acquireLease(blobService, 'players', 'playerIndex')
          .then(function(leaseId) {
            blobService.getBlobToText('players', 'playerIndex', function(err, results) {
              try {
                var players = JSON.parse(results);

                // For now do not allow duplicate names...
                var contains = _.contains(players, function(p) {
                  return p.name === playerToSave.name;
                });

                if (!contains) {
                  // Give UUID and save
                  playerToSave.id = uuid.v4();
                  players.push(playerToSave);

                  // Creat the player in the 'index'
                  blobService.createBlockBlobFromText('players', 'playerIndex', JSON.stringify(players), function(e, result, response) {
                    if (e) {
                      throw e;
                    }
                  });

                  // Create that players game list
                  blobService.createBlockBlobFromText('players', playerToSave.id, JSON.stringify([]), function(e, result, response) {
                    if (e) {
                      throw e;
                    }
                  });
                }
              } catch(e) {
                throw e;
              } finally {
                blobService.releaseLease('players', 'playerIndex', leaseId, function () {});
              }
            });
          });

          d.resolve(playerToSave);
      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    }
  };
};
