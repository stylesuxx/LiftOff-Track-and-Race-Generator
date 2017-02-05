var reducer = require('../../src/reducers/canvas');

import {
  START_ADDING_POINT,
  STOP_ADDING_POINT,
  DELETE_POINT,
  TOGGLE_GRID_SNAP,
  RENDER_PREVIEW
} from '../../src/actions/const';

describe('canvas reducer', () => {

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

  describe('START_ADDING_POINT action', (done) => {
    const state = Object.freeze({
      nodeAdded: true
    });
    const newState = reducer(state, {type: START_ADDING_POINT});

    it('should call addNode of the canvas', (done) => {
      expect(newState.nodeAdded).to.be.false;

      done();
    });
  });

  describe('STOP_ADDING_POINT action', (done) => {
    const state = Object.freeze({
      nodeAdded: false
    });
    const newState = reducer(state, {type: STOP_ADDING_POINT});

    it('should call stopAdding of the canvas', (done) => {
      expect(newState.nodeAdded).to.be.true;

      done();
    });
  });

  describe('DELETE_POINT action', (done) => {
    const state = Object.freeze({ nodeDeleted: false });
    const newState = reducer(state, {type: DELETE_POINT});

    it('should call deleteNode of the canvas', (done) => {
      expect(newState.nodeDeleted).to.be.true;

      done();
    });
  });

  describe('TOGGLE_GRID_SNAP action', (done) => {
    const state = Object.freeze({ gridSnap: false });
    const newState = reducer(state, {type: TOGGLE_GRID_SNAP});

    it('should call toggleGridSnap of the canvas', (done) => {
      expect(newState.gridSnap).to.be.true;

      done();
    });
  });

  describe('RENDER_PREVIEW action', (done) => {
    const state = Object.freeze({ trackRendered: true });
    const newState = reducer(state, {type: RENDER_PREVIEW});

    it('should reset the trackRendered', (done) => {
      expect(newState.trackRendered).to.be.false;
      done();
    });
  });
});
