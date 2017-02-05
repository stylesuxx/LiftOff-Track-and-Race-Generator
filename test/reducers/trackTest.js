var reducer = require('../../src/reducers/track');

import {
  TOGGLE_GATES,
  TOGGLE_DOUBLE_LINE,
  SET_MARKER_SPACING,
  SET_TRACK_WIDTH,
  SET_GATE_SPACING,
  SET_MAP,
  START_ADDING_POINT,
  STOP_ADDING_POINT,
  CLOSE_TRACK,
  OPEN_TRACK,
  RENDER_PREVIEW,
  SET_TRACK_TEXT,
  SET_RACE_TEXT,
  SET_NAME,
  ENABLE_DOWNLOAD,
  SET_MARKER_TYPE
} from '../../src/actions/const';

describe('track reducer', () => {

  it('should not change the passed state', (done) => {

    const state = Object.freeze({
      foo: 'bar'
    });
    const newState = reducer(state, {type: 'INVALID'});
    expect(newState.foo).to.eql('bar');

    done();
  });

  describe('reducer without action', (done) => {
    it('should thorow error', (done) => {
      expect(() => { reducer() }).to.throw("undefined is not an object (evaluating 'action.type')");

      done();
    });
  });

  describe('TOGGLE_GATES action', (done) => {
    const state = Object.freeze({ gatesEnabled: false });
    const newState = reducer(state, {type: TOGGLE_GATES});

    it('should update gatesEnabled prop', (done) => {
      expect(newState.gatesEnabled).to.be.true;
      done();
    });
  });

  describe('TOGGLE_DOUBLE_LINE action', (done) => {
    const state = Object.freeze({ doubelLine: false });
    const newState = reducer(state, {type: TOGGLE_DOUBLE_LINE});

    it('should update the doubleLine prop', (done) => {
      expect(newState.doubleLine).to.be.true;
      done();
    });
  });

  describe('SET_MARKER_SPACING action', (done) => {
    const state = Object.freeze({ markerSpacing: 100 });
    const newState = reducer(state, {type: SET_MARKER_SPACING, parameter: 200});

    it('should update the markerSpacing prop', (done) => {
      expect(newState.markerSpacing).to.eql(200);
      done();
    });
  });

  describe('SET_GATE_SPACING action', (done) => {
    const state = Object.freeze({ gateSpacing: 100 });
    const newState = reducer(state, {type: SET_GATE_SPACING, parameter: 200});

    it('should update the gateSpacing prop', (done) => {
      expect(newState.gateSpacing).to.eql(200);
      done();
    });
  });

  describe('SET_MAP action', (done) => {
    const state = Object.freeze({ map: 'SomeMap' });
    const newState = reducer(state, {type: SET_MAP, parameter: 'OtherMap'});

    it('should update the map prop', (done) => {
      expect(newState.map).to.eql('OtherMap');
      done();
    });
  });

  describe('START_ADDING_POINT action', (done) => {
    const state = Object.freeze({ addingNode: false });
    const newState = reducer(state, {type: START_ADDING_POINT});

    it('should set the addingNode prop', (done) => {
      expect(newState.addingNode).to.be.true;
      done();
    });
  });

  describe('STOP_ADDING_POINT action', (done) => {
    const state = Object.freeze({ addingNode: true });
    const newState = reducer(state, {type: STOP_ADDING_POINT});

    it('should reset the addingNode prop', (done) => {
      expect(newState.addingNode).to.be.false;
      done();
    });
  });

  describe('CLOSE_TRACK action', (done) => {
    const state = Object.freeze({ closed: false });
    const newState = reducer(state, {type: CLOSE_TRACK});

    it('should set the closed prop', (done) => {
      expect(newState.closed).to.be.true;
      done();
    });
  });

  describe('OPEN_TRACK action', (done) => {
    const state = Object.freeze({ closed: true });
    const newState = reducer(state, {type: OPEN_TRACK});

    it('should reset the closed prop', (done) => {
      expect(newState.closed).to.be.false;
      done();
    });
  });

  describe('RENDER_PREVIEW action', (done) => {
    const state = Object.freeze({ trackRendered: true });
    const newState = reducer(state, {type: RENDER_PREVIEW});

    it('should reset the closed prop', (done) => {
      expect(newState.trackRendered).to.be.false;
      done();
    });
  });

  describe('SET_TRACK_WIDTH action', (done) => {
    const state = Object.freeze({ trackWidth: 0 });
    const newState = reducer(state, {type: SET_TRACK_WIDTH, parameter: 20.1});

    it('should reset the closed prop', (done) => {
      expect(newState.trackWidth).to.eql(20.1);
      done();
    });
  });

  describe('SET_TRACK_TEXT action', (done) => {
    const state = Object.freeze({ trackText: 'old', trackId: 'foo' });
    const newState = reducer(state, {type: SET_TRACK_TEXT, parameter: {
      text: 'new',
      id: 'bar'
    }});

    it('should set the track text', (done) => {
      expect(newState.trackText).to.eql('new');
      expect(newState.trackId).to.eql('bar');
      done();
    });
  });

  describe('SET_RACE_TEXT action', (done) => {
    const state = Object.freeze({ raceText: 'old', raceId: 'foo' });
    const newState = reducer(state, {type: SET_RACE_TEXT, parameter: {
      text: 'new',
      id: 'bar'
    }});

    it('should set the race text', (done) => {
      expect(newState.raceText).to.eql('new');
      expect(newState.raceId).to.eql('bar');
      done();
    });
  });

  describe('SET_NAME action', (done) => {
    const state = Object.freeze({ name: 'old' });
    const newState = reducer(state, {type: SET_NAME, parameter: 'new'});

    it('should set the name', (done) => {
      expect(newState.name).to.eql('new');
      done();
    });
  });

  describe('ENABLE_DOWNLOAD action', (done) => {
    const state = Object.freeze({ download: false });
    const newState = reducer(state, { type: ENABLE_DOWNLOAD });

    it('should set the download prop', (done) => {
      expect(newState.download).to.be.true;
      done();
    });
  });

  describe('SET_MARKER_TYPE action', (done) => {
    const state = Object.freeze({ markerType: 'foo' });
    const newState = reducer(state, { type: SET_MARKER_TYPE, parameter: 'bar' });

    it('should set the marker type', (done) => {
      expect(newState.markerType).to.eql('bar');
      done();
    });
  });
});