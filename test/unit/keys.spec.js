import * as keyboard from '../../src/keyboard.js'

// --------------------------------------------------
// keyboard
// --------------------------------------------------
describe('keyboard', () => {

  /**
   * Simulate a keyboard event.
   * @param {string} type - Type of keyboard event.
   * @param {object} [config] - Additional settings for the event.
   * @param {boolean} [config.ctrlKey=false]
   * @param {boolean} [config.shiftKey=false]
   * @param {boolean} [config.altKey=false]
   * @param {boolean} [config.metaKey=false]
   * @param {boolean} [config.keyCode=0]
   */
  function simulateEvent(type, config) {
    let evt;

    // PhantomJS <2.0.0 throws an error for the `new Event` call, so we need to supply an
    // alternative form of creating an event just for PhantomJS
    // @see https://github.com/ariya/phantomjs/issues/11289#issuecomment-38880333
    try {
      evt = new Event(type);
    } catch(e) {
      evt = document.createEvent('Event');
      evt.initEvent(type, true, false);
    }

    config = config || {};
    for (let prop in config) {
      evt[prop] = config[prop];
    }

    window.dispatchEvent(evt);
  }

  // reset pressed keys before each test
  beforeEach(() => {
    simulateEvent('blur');
  });

  it('should export api', () => {
    expect(keyboard.keyMap).to.be.an('object');
    expect(keyboard.initKeys).to.be.an('function');
    expect(keyboard.bindKeys).to.be.an('function');
    expect(keyboard.unbindKeys).to.be.an('function');
    expect(keyboard.keyPressed).to.be.an('function');
  });

  // --------------------------------------------------
  // initKeys
  // --------------------------------------------------
  describe('initKeys', () => {

    it('should add event listeners', () => {
      let spy = sinon.spy(window, 'addEventListener');

      keyboard.initKeys();

      expect(spy.called).to.be.true;

      spy.restore();
    });

  });





  // --------------------------------------------------
  // pressed
  // --------------------------------------------------
  describe('pressed', () => {

    it('should return false when a key is not pressed', () => {
      expect(keyboard.keyPressed('a')).to.be.not.ok;
      expect(keyboard.keyPressed('f1')).to.be.not.ok;
      expect(keyboard.keyPressed('numpad0')).to.be.not.ok;
    });

    it('should return true for a single key', () => {
      simulateEvent('keydown', {code: 'KeyA'});

      expect(keyboard.keyPressed('a')).to.be.true;
    });

    it('should return false if the key is no longer pressed', () => {
      simulateEvent('keydown', {code: 'KeyA'});
      simulateEvent('keyup', {code: 'KeyA'});

      expect(keyboard.keyPressed('a')).to.be.not.ok;
    });

  });





  // --------------------------------------------------
  // bind
  // --------------------------------------------------
  describe('bind', () => {

    it('should call the callback when a single key combination is pressed', (done) => {
      keyboard.bindKeys('a', evt => {
        done();
      });

      simulateEvent('keydown', {code: 'KeyA'});

      throw new Error('should not get here');
    });

    it('should accept an array of key combinations to bind', (done) => {
      keyboard.bindKeys(['a', 'b'], evt => {
        done();
      });

      simulateEvent('keydown', {code: 'KeyA'});

      throw new Error('should not get here');
    });

  });





  // --------------------------------------------------
  // unbind
  // --------------------------------------------------
  describe('unbind', () => {

    it('should not call the callback when the combination has been unbound', () => {
      keyboard.bindKeys('a', () => {
        // this should never be called since the key combination was unbound
        expect(false).to.be.true;
      });

      keyboard.unbindKeys('a');

      simulateEvent('keydown', {which: 65});
    });

    it('should accept an array of key combinations to unbind', () => {
      keyboard.bindKeys(['a', 'b'], () => {
        // this should never be called since the key combination was unbound
        expect(false).to.be.true;
      });

      keyboard.unbindKeys(['a', 'b']);

      simulateEvent('keydown', {which: 65});
      simulateEvent('keydown', {which: 66});
    });

  });

});