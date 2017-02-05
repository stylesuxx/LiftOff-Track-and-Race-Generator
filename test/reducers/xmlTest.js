import {
  SET_TRACK_TEXT,
  SET_RACE_TEXT
} from '../../src/actions/const';
var reducer = require('../../src/reducers/xml');

describe('xml', () => {

  it('should not change the passed state', (done) => {

    const state = Object.freeze({});
    reducer(state, {type: 'INVALID'});

    done();
  });

  describe('reducer without action', (done) => {
    it('should thorow error', (done) => {
      expect(() => { reducer() }).to.throw("undefined is not an object (evaluating 'action.type')");

      done();
    });
  });

  describe('SET_TRACK_TEXT action', (done) => {
    const state = Object.freeze({
      track: {
        id: 'old',
        value: 'old'
      }
    });
    const newState = reducer(state, {type: SET_TRACK_TEXT, parameter: {
      id: 'new',
      value: 'bar'
    }});

    it('should set the track id', (done) => {
      expect(newState.track.id).to.eql('new');
      done();
    });

    it('should set the track value', (done) => {
      expect(newState.track.value).to.eql('bar');
      done();
    });
  });

  describe('SET_RACE_TEXT action', (done) => {
    const state = Object.freeze({
      race: {
        id: 'old',
        value: 'old'
      }
    });
    const newState = reducer(state, {type: SET_RACE_TEXT, parameter: {
      id: 'new',
      value: 'bar'
    }});

    it('should set the race id', (done) => {
      expect(newState.race.id).to.eql('new');
      done();
    });

    it('should set the race value', (done) => {
      expect(newState.race.value).to.eql('bar');
      done();
    });
  });
});
