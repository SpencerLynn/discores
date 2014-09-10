var Q = require('q');

module.exports = {
  acquireLease: function(blobService, container, blobName) {
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
};
