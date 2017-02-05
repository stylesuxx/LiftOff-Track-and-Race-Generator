import React from 'react';
import { shallow, mount } from 'enzyme';
import App from 'components/App';
import About from 'components/About';
import Textarea from 'components/textarea/Textarea.js';

describe('<App />', function () {

  let track;
  let canvas;
  let component;
  beforeEach(function () {
    track = {
      name: 'Trackname 01',
      map: 'LiftoffArena',
      gatesEnabled: false,
      markerSpacing: 20,
      doubleLine: false,
      markerType: 'foo',
      trackWidth: 17.5,
      gateSpacing: 20,
      closed: false,
      height: 1000,
      width: 600
    };

    canvas = {
      trackRendered: true,
      nodeDeleted: true,
      addingNode: false,
      gridSnap: false
    };

    actions = {
      startAddingPoint: sinon.spy(),
      setMarkerSpacing: sinon.spy(),
      toggleDoubleLine: sinon.spy(),
      stopAddingPoint: sinon.spy(),
      setGateSpacing: sinon.spy(),
      toggleGridSnap: sinon.spy(),
      enableDownload: sinon.spy(),
      renderPreview: sinon.spy(),
      setTrackWidth: sinon.spy(),
      setMarkerType: sinon.spy(),
      setTrackText: sinon.spy(),
      setRaceText: sinon.spy(),
      toggleGates: sinon.spy(),
      deletePoint: sinon.spy(),
      closeTrack: sinon.spy(),
      openTrack: sinon.spy(),
      setName: sinon.spy(),
      setMap: sinon.spy()
    };

    component = shallow(<App track={track} canvas={canvas} actions={actions} />);
  });

  describe('when rendering the component with open track', function () {

    it('should have a className of "index"', function () {
      expect(component.hasClass('index')).to.equal(true);
    });

    it('should display the About component', function () {
      expect(component.find(About)).to.have.length(1);
    });

    it('should not display the Textarea component', function () {
      expect(component.find(Textarea)).to.have.length(0);
    });
  });

  describe('when rendering the component with closed track', function () {

    it('should have a className of "index"', function () {
      track.closed = true;
      component = shallow(<App track={track} canvas={canvas} actions={actions} />);

      expect(component.hasClass('index')).to.equal(true);
    });

    it('should display the About component', function () {
      track.closed = true;
      component = shallow(<App track={track} canvas={canvas} actions={actions} />);

      expect(component.find(About)).to.have.length(0);
    });

    it('should not display the Textarea component', function () {
      track.closed = true;
      component = shallow(<App track={track} canvas={canvas} actions={actions} />);

      expect(component.find(Textarea)).to.have.length(1);
    });
  });
});
