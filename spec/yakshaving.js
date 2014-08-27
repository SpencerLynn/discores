var yaks = require('../lib/yaks.js');

describe('yaks', function(){
  it('has a shave function', function(){
    expect(yaks.shave).toBeDefined();
  });
});
