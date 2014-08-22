
var messageFormat = require('../libraries/MessageFormat');

describe('MessageFormat', function() {
  describe('#parse()', function() {
    describe('Sentences', function() {
      it('should parse a sentence', function() {
        messageFormat.parse('sentence');
        expect(messageFormat.messageAST[0].string).to.equal('sentence');
        expect(messageFormat.messageAST.length).to.equal(1);
      });

      it('should parse escaped sentences', function() {
        messageFormat.parse('sentence\\{');
        expect(messageFormat.messageAST[0].string).to.equal('sentence\\{');
        expect(messageFormat.messageAST.length).to.equal(1);
        messageFormat.parse('sentence\\}');
        expect(messageFormat.messageAST[0].string).to.equal('sentence\\}');
        expect(messageFormat.messageAST.length).to.equal(1);
        messageFormat.parse('\\{sentence\\{');
        expect(messageFormat.messageAST[0].string).to.equal('\\{sentence\\{');
        expect(messageFormat.messageAST.length).to.equal(1);
      });

      it('should throw an error if an unescaped reserved character is used', function() {
        function method() {
          messageFormat.parse('sentence {');
        }
        expect(method).to.throw(TypeError, 'Could not parse variable in sentence {')
      });
    });

    describe('Variables', function() {
      it('should parse a sentence with a single variable', function() {
        messageFormat.parse('sentence {variable1}');
        expect(messageFormat.messageAST[0].string).to.equal('sentence ');
        expect(messageFormat.messageAST[1].name).to.equal('variable1');
        expect(messageFormat.messageAST.length).to.equal(2);
      });

      it('should parse a message with multiple variables', function() {
        messageFormat.parse('{variable1} {variable2}');
        expect(messageFormat.messageAST[0].name).to.equal('variable1');
        expect(messageFormat.messageAST[1].string).to.equal(' ');
        expect(messageFormat.messageAST[2].name).to.equal('variable2');
        expect(messageFormat.messageAST.length).to.equal(3);
      });

      it('should parse a sentence with multiple subsequent variables', function() {
        messageFormat.parse('{variable1}{variable2}{variable3}');
        expect(messageFormat.messageAST[0].name).to.equal('variable1');
        expect(messageFormat.messageAST[1].name).to.equal('variable2');
        expect(messageFormat.messageAST[2].name).to.equal('variable3');
        expect(messageFormat.messageAST.length).to.equal(3);
      });

      it('should throw an error if a variable contains non alphanumeric characters', function() {
        var method = function() {
          messageFormat.parse('{!variable1}');
        }
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {!');
        var method = function() {
          messageFormat.parse('{varia!ble1}');
        }
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {varia!');
        var method = function() {
          messageFormat.parse('{variable1!}');
        }
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {variable1!');
        var method = function() {
          messageFormat.parse('{variable1}{varia!ble2}');
        }
        expect(method).to.throw(TypeError, 'Variable names must be alpha numeric, got a \'!\' in {variable1}{varia');
      });
    });

    describe('PluralForm', function() {
      it('should parse a plural form with a single case', function() {
        messageFormat.parse('{variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
      });

      it('should parse a plural form with multiple cases using keywords', function() {
        messageFormat.parse('{variable1,plural,zero{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,zero{message1}one{message2}other{message3}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message3' }]);
        messageFormat.parse('{variable1,plural,zero{message1}one{message2}two{message3}other{message4}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.two).to.eql([{ string: 'message3' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message4' }]);
        messageFormat.parse('{variable1,plural,zero{message1}one{message2}two{message3}few{message4}other{message5}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.two).to.eql([{ string: 'message3' }]);
        expect(messageFormat.messageAST[0].values.few).to.eql([{ string: 'message4' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message5' }]);
        messageFormat.parse('{variable1,plural,zero{message1}one{message2}two{message3}few{message4}many{message5}other{message6}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].offset).to.equal(0);
        expect(messageFormat.messageAST[0].values.zero).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.two).to.eql([{ string: 'message3' }]);
        expect(messageFormat.messageAST[0].values.few).to.eql([{ string: 'message4' }]);
        expect(messageFormat.messageAST[0].values.many).to.eql([{ string: 'message5' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message6' }]);
      });

      it('should be able to parse with exact cases', function() {
        messageFormat.parse('{variable1,plural,=1{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values['=1']).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,=1{message1}=2{message2} other{message3}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values['=1']).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values['=2']).to.eql([{ string: 'message2' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message3' }]);
      });

      describe('Values', function() {
        it('should be able to have a sentence', function() {
          messageFormat.parse('{variable1,plural,other{message1}}');
          expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
          expect(messageFormat.messageAST[0].values.other[0].string).to.eql('message1');
        });

        it('should be able to have a the same variable connected to the plural form', function() {
          messageFormat.parse('{variable1,plural,other{{variable1}}}');
          expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
          expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable1');
        });

        it('should be able to have a variable that is not connected to the plural form', function() {
          messageFormat.parse('{variable1,plural,other{{variable2}}}');
          expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
          expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
        });

        it('should be able to have multiple variable that is not connected to the plural form', function() {
          messageFormat.parse('{variable1,plural,other{{variable2}{variable3}}}');
          expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
          expect(messageFormat.messageAST[0].values.other[0].name).to.equal('variable2');
          expect(messageFormat.messageAST[0].values.other[1].name).to.equal('variable3');
        });

        it('should be able to have an another PluralForm', function() {
          messageFormat.parse('{variable1,plural,other{{variable2,plural, other{message1}}}}');
          expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
          expect(messageFormat.messageAST[0].values.other[0].variable.name).to.equal('variable2');
          expect(messageFormat.messageAST[0].values.other[0].values.other[0].string).to.equal('message1');
        });
      });

      it('should parse a plural form with spaces between keywords', function() {
        messageFormat.parse('{variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{ variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1 ,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1, plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural ,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural, other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,other {message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,other {message1} }');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,one{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural, one{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one {message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one{message1} other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one{message1}other {message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
      });

      it('should parse a plural form with tabs between keywords', function() {
        messageFormat.parse('{variable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{\tvariable1,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1\t,plural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,\tplural,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural\t,other{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,\tother{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,other\t{message1}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,other{message1}\t}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message1' }]);
        messageFormat.parse('{variable1,plural,one{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,\tone{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one\t{message1}other{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one{message1}\tother{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
        messageFormat.parse('{variable1,plural,one{message1}other\t{message2}}');
        expect(messageFormat.messageAST[0].variable.name).to.equal('variable1');
        expect(messageFormat.messageAST[0].values.one).to.eql([{ string: 'message1' }]);
        expect(messageFormat.messageAST[0].values.other).to.eql([{ string: 'message2' }]);
      });

      it('should throw an error if there is no other case', function() {
        var method = function() {
          messageFormat.parse('{variable1,plural,one{message1}}');
        }
        expect(method).to.throw(TypeError, 'Missing \'other\' case in {variable1,plural,one{message1}}');
      });

      it('should throw an error if one of the brackets are missing in the values', function() {
        var method = function() {
          messageFormat.parse('{variable1,plural,other message1}}');
        }
        expect(method).to.throw(TypeError, 'Expected bracket \'{\' in {variable1,plural,other m');
        var method = function() {
          messageFormat.parse('{variable1,plural,other {message1}');
        }
        expect(method).to.throw(TypeError, 'You must have a closing bracket in your plural format in {variable1,plural,other {message1}');
      });
    });
  });
});
