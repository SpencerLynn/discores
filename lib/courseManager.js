var Q = require('q');
var crypto = require('crypto');

module.exports = function(blobService) {
  return {
    blobService: blobService,

    save: function(course) {
      var d = Q.defer();

      var md5 = crypto.createHash('md5');
      md5.update(course.name);
      var hashName = md5.digest('hex');

      try {
        blobService.createBlockBlobFromText('courses', hashName, JSON.stringify(course), function(err, result, response) {
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
