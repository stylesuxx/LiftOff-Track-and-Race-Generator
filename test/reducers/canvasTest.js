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
      nodeAdded: true,
      addingNode: false,
    });

    it('should set addingNode prop', (done) => {
      const newState = reducer(state, {type: START_ADDING_POINT});

      expect(newState.addingNode).to.be.true;
      done();
    });
  });

  describe('STOP_ADDING_POINT action', (done) => {
    const state = Object.freeze({
      nodeAdded: false,
      addingNode: true,
    });


    it('should set nodeAdded of the canvas', (done) => {
      const newState = reducer(state, {type: STOP_ADDING_POINT});

      expect(newState.addingNode).to.be.false;
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
