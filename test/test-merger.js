
/**
 * Module dependencies
 */

var fixtures = require('./fixtures/json')
  , Merger = require('../lib/merger').Merger;

module.exports = function() {
  describe('Merger', function() {
    describe('#constructor', function() {
      it('should set counter to 0', function() {
        var merger = new Merger();
        expect(merger.counter).to.equal(0);
      });
    });

    describe('#mergeTimeStamp', function() {
      it('should use old timestamp', function() {
        var merger = new Merger();
        var time = 1000;
        var res = merger.mergeTimeStamp({ 'test' : {}}, { 'test' : { timestamp : time }}, 'test');
        expect(res.test.timestamp).to.equal(time);
      });

      it('should use current timstamp as timestamp whenever old timestamp is undefined', function() {
        var merger = new Merger();
        var res = merger.mergeTimeStamp({ 'test' : {}}, { 'test' : {}}, 'test');
        expect(res.test.timestamp).to.be.a('number');
      });
    });

    describe('#mergeId', function() {
      it('should merge old translation `id`', function() {
        var merger = new Merger();
        var id = 'iuerhg';
        var res = merger.mergeId({ 'test' : {}}, { 'test' : { id : id }}, 'test');
        expect(res.test.id).to.equal(id);
      });

      it('should set a new translation id if there doesn\'t exist a old one', function() {
        var merger = new Merger();
        var res = merger.mergeId({ 'test' : {}}, { 'test' : { }}, 'test');
        expect(res.test.id).to.have.a('string');
      });

      it('should set property `_new` to false if `id` already exists', function() {
        var merger = new Merger();
        var id = 'iuerhg';
        var res = merger.mergeId({ 'test' : {}}, { 'test' : { id : id }}, 'test');
        expect(res.test._new).to.be.false;
      });

      it('should set property `_new` to true if `id` doesn\'t exists', function() {
        var merger = new Merger();
        var res = merger.mergeId({ 'test' : {}}, { 'test' : {}}, 'test');
        expect(res.test._new).to.be.true;
      });
    });

    describe('#mergeTranslations', function() {

    });
  });
};
