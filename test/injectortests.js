var Injector = require('../injector');
var expect = require('chai').expect;

describe('Injector', function() {
  it('should bind service', function() {
    var injector = new Injector();
    injector.bind('type', function() {
      this.message = 'hi';
    });

    var obj = injector.get('type');

    expect(obj.message).to.equal('hi');
  });

  it('should bind value', function() {
    var injector = new Injector();
    injector.bind('message', 'hi');

    var obj = injector.get('message');

    expect(obj).to.equal('hi');
  });

  it('should bind dependencies', function() {
    var injector = new Injector();
    injector.bind('message', 'hi');
    injector.bind('object', ['message', function(message) {
      this.message = message;
    }]);

    var obj = injector.get('object');

    expect(obj.message).to.equal('hi');
  });

  it('should bind dependencies implicitly', function() {
    var injector = new Injector();
    injector.bind('message', 'hi');
    injector.bind('object', function(message) {
      this.message = message;
    });

    var obj = injector.get('object');

    expect(obj.message).to.equal('hi');
  });

  it('should bind factory', function() {
    var injector = new Injector();
    injector.bind('object', function() {
      return {
        message: 'hi'
      }
    });

    var obj = injector.get('object');

    expect(obj.message).to.equal('hi');
  });

  it('should create seperate instances for normal scope', function() {
    var injector = new Injector();
    injector.bind('object', function() {
      return {
        key: 'value'
      };
    });
    var obj1 = injector.get('object');
    var obj2 = injector.get('object');

    expect(obj1).to.not.equal(obj2);
    expect(obj1).to.eql(obj2);
    expect(obj1).to.eql({
      key: 'value'
    });
  });

  it('should create single instance for singleton scope', function() {
    var injector = new Injector();
    injector.bind('object', function() {
      return {
        key: 'value'
      };
    }, true);
    var obj1 = injector.get('object');
    var obj2 = injector.get('object');

    expect(obj1).to.equal(obj2);
    expect(obj1).to.eql({
      key: 'value'
    });
  });

  it('shouldnt create instances for value', function() {
    var injector = new Injector();
    var value = {
      message: 'hi'
    };
    injector.bind('object', value);
    var object = injector.get('object');
    expect(object).to.equal(value);
  });
});