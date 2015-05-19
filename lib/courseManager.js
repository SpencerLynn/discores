var Q = require('q');
var _ = require('lodash');
var crypto = require('crypto');
var blobServiceHelper = require('./blobServiceHelper.js');

module.exports = function(blobService) {
  return {
    self: this,
    blobService: blobService,
    save: function(courseToSave) {
      var d = Q.defer();

      var md5 = crypto.createHash('md5');
      md5.update(courseToSave.name);
      var hashName = md5.digest('hex');

      try {
        blobServiceHelper.acquireLease(blobService, 'courses', 'index')
          .then(function(leaseId) {
            blobService.getBlobToText('courses', 'index', function(err, results) {
              try {
                var courses = JSON.parse(results);
                var contains = _.contains(courses, function(c) {
                  return c.name === courseToSave.name;
                });
                if (!contains) {
                  courses.push(courseToSave);
                  blobService.createBlockBlobFromText('courses', 'index', JSON.stringify(courses), function(err, result, response) {
                    if (err) {
                      throw err;
                    }
                  });
                }
              } catch(e) {
                throw e;
              } finally {
                blobService.releaseLease('courses', 'index', leaseId, function () {});
              }
            });
          });

        // Create course
        blobService.createBlockBlobFromText('courses', hashName, JSON.stringify(courseToSave), function(err, result, response) {
          if (err) {
            d.reject(err);
          } else {
            d.resolve(result);
          }
        });

      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    },

    query: function(opts) {
      var d = Q.defer();

      try {
        blobService.getBlobToText('courses', 'index', function(err, results) {
          if (err) {
            d.reject(err);
          } else {
            var courses = JSON.parse(results);
            if (opts) {

            }
            d.resolve(courses);
          }
        });
      } catch(e) {
        d.reject(e);
      }

      return d.promise;
    }
  };
};
