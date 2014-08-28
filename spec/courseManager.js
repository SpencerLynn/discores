var azure = require('azure-storage');
var blobService = azure.createBlobService('test', new Buffer('test').toString('base64'));
var courseManager = require('../lib/courseManager.js')(blobService);

describe('courseManager', function() {
  it('exists', function() {
    expect(courseManager).toBeDefined();
  });

  describe('saving a course', function() {
    beforeEach(function() {
      spyOn(blobService, 'createBlockBlobFromText')
        .and.callFake(function(container, name, course, cb) {
          cb(null, { done: true });
        });
    });

    it('should save a course', function(done) {
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

  describe('getting courses', function() {
    beforeEach(function() {
      spyOn(blobService, 'getBlobToText')
        .and.callFake(function(container, blob, cb) {
          cb(null, '[{ "name": "test" }]');
        });
    });

    it('should get course list', function(done) {
      courseManager.query().then(function(courses) {
        var calls = blobService.getBlobToText.calls;
        expect(calls.count()).toEqual(1);
        expect(calls.argsFor(0)[0]).toEqual('courses');
        expect(calls.argsFor(0)[1]).toEqual('index');
        expect(courses.length).toEqual(1);
        expect(courses[0].name).toEqual('test');
        done();
      });
    });
  });
});
