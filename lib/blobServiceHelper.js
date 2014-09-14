var Q = require('q');

module.exports = {
  acquireLease: function(blobService, container, blobName, deferred) {
    if (!deferred)
      deferred = Q.defer();

    blobService.acquireLease(container, blobName, { 'leaseDuration': 15 }, function(err, result) {
      if (err) {
        if (err.code === 'LeaseAlreadyPresent') {
          acquireLease(blobService, container, blobName, deferred);
        } else {
          throw err;
        }
      } else {
        deferred.resolve(result.id);
     }
    });

    return deferred.promise;
  }
};
