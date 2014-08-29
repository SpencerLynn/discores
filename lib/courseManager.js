var Q = require('q');
var crypto = require('crypto');

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
        // Aquire lease
        function acquireLease(container, blobName) {
          var leaseDeferred = Q.defer();

          blobService.acquireLease(container, blobName, { 'leaseDuration': 15 }, function(err, result) {
            if (err) {
              if (err.code === 'LeaseAlreadyPresent') {
                acquireLease(container, blobName);
              } else {
                throw err;
              }
            } else {
              leaseDeferred.resolve(result.id);
           }
          });

          return leaseDeferred.promise;
        }

        acquireLease('courses', 'index')
          .then(function(leaseId) {
            blobService.getBlobToText('courses', 'index', function(err, results) {
              try {
                var courses = JSON.parse(results);
                // Add to 'index'
                var index = courses.map(function(c) {
                  return c.name;
                }).indexOf(courseToSave.name);
                if (index === -1) {
                  // Add to courses
                  courses.push(courseToSave);

                  blobService.createBlockBlobFromText('courses', 'index', JSON.stringify(courses), function(err, result, response) {
                    if (err) {
                      throw err;
                    }
                  });
                }
              } catch(err) {
                throw err;
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
