import React from 'react';
import { shallow, mount } from 'enzyme';
import Canvas from 'components/Canvas.js';
import { Point } from '../../src/libs/Math2D';

describe('<Canvas />', function () {

  let component;
  let actions;
  let track;
  let canvas;
  beforeEach(function () {
    track = {
      trackRendered: true,
      gatesEnabled: false,
      markerSpacing: 20,
      addingNode: false,
      gateSpacing: 100,
      closed: false,
      height: 1000,
      width: 600,
      trackWidth: 17.5,
      doubleLine: false,
      map: 'LiftoffArena',
      name: 'Trackname',
      markerType: 'foo'
    };

    canvas = {
      nodeDeleted: true,
      nodeAdded: true,
      gridSnap: false
    };

    actions = {
      stopAddingPoint: sinon.spy(),
      renderPreview: sinon.spy(),
      setTrackText: sinon.spy(),
      setRaceText: sinon.spy(),
      deletePoint: sinon.spy(),
      enableDownload: sinon.spy()
    }

    component = mount(<Canvas track={track} actions={actions} canvas={canvas} />);
  });

  describe('when rendering the component', function () {

    it('should have a className of "canvas-component"', function () {
      component = mount(<Canvas track={track} actions={actions} canvas={canvas} />);
      track.trackRendered = false;
      component.update();
      expect(component.hasClass('canvas-component')).to.equal(true);
    });
  });

  describe('when rendering the component with double line enabled', function () {

    it('should have a className of "canvas-component"', function () {
      track.doubleLine = true;
      component = mount(<Canvas track={track} actions={actions} canvas={canvas} />);
      track.trackRendered = false;
      component.update();

      expect(component.hasClass('canvas-component')).to.equal(true);
    });
  });

  describe('when rendering the component with enabled gates', function () {

    it('should have a className of "canvas-component"', function () {
      track.gatesEnabled = true;
      track.trackRendered = false;

      component = mount(<Canvas track={track} actions={actions} canvas={canvas} />);

      component.update();

      expect(component.hasClass('canvas-component')).to.equal(true);
    });
  });
  describe('when adding a Node', function () {

    it('should trigger STOP_ADDING_POINT action', function() {
      const wrapper = component.find('canvas');

      canvas.nodeAdded = false;
      track.addingNode = true;

      component.update();

      wrapper.simulate('mouseMove', {pageX: 200, pageY: 200});
      wrapper.simulate('mouseDown');

      expect(actions.stopAddingPoint.called).to.be.true;
    });
  });

  describe('when dragging a Node', function () {

    it('should trigger STOP_ADDING_POINT action', function() {
      const wrapper = component.find('canvas');

      wrapper.simulate('mouseDown', {pageX: 20, pageY: 20});
      wrapper.simulate('mouseMove', {pageX: 200, pageY: 200});
      wrapper.simulate('mouseUp');
    });
  });

  describe('when deleting a Node', function () {

    it('should trigger DELETE_POINT action', function() {
      canvas.nodeDeleted = false;
      const wrapper = component.find('canvas');

      component.update();

      expect(actions.deletePoint.called).to.be.true;
    });
  });
});
