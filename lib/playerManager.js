var Q = require('q');
var uuid = require('node-uuid');
var _ = require('underscore');
var blobServiceHelper = require('./blobServiceHelper.js');

module.exports = function(blobService) {
  return {
    blobService: blobService,
    getPlayers: function() {
      var d = Q.defer();

      try {
        blobService.getBlobToText('scores', 'playerIndex', function(err, results) {
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

    createPlayer: function(playerToSave) {
      var d = Q.defer();

      try {
        blobServiceHelper.acquireLease(blobService, 'scores', 'playerIndex')
          .then(function(leaseId) {
            blobService.getBlobToText('scores', 'playerIndex', function(err, results) {
              try {
                var players = JSON.parse(results);
                var contains = _.contains(players, function(p) {
                  return p.name === playerToSave.name;
                });

                if (!contains) {
                  // Give UUID and save
                  playerToSave.uuid = uuid.v4();
                  players.push(playerToSave);
                  blobService.createBlockBlobFromText('scores', 'playerIndex', JSON.stringify(players), function(e, result, response) {
                    if (e) {
                      throw e;
                    }
                  });
                }
              } catch(e) {
                throw e;
              } finally {
                blobService.releaseLease('scores', 'playerIndex', leaseId, function () {});
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
