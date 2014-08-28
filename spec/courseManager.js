var azure = require('azure-storage');
var blobService = azure.createBlobService('test', new Buffer('test').toString('base64'));
var courseManager = require('../lib/courseManager.js')(blobService);

describe('courseManager', function() {
  it('exists', function() {
    expect(courseManager).toBeDefined();
  });

  describe('createCourse', function() {
    beforeEach(function() {
      try{
      spyOn(blobService, 'createBlockBlobFromText')
        .and.callFake(function(c, n, o, cb) {
          cb(null, { done: true }, null);
        }); } catch (e) { console.log(e); }
    });

    it('should create a course', function(done) {
      var testCourse = { name: 'TestCourseName' };
      courseManager.save(testCourse).done(function() {
        var calls = blobService.createBlockBlobFromText.calls;
        expect(calls.count()).toEqual(1);
        expect(calls.argsFor(0)[0]).toEqual('courses');
        expect(calls.argsFor(0)[2]).toEqual(JSON.stringify(testCourse));
        done();
      });
    });
  });
});
