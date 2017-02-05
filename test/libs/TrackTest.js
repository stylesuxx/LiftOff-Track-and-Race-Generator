import {
  Track
} from '../../src/libs/Liftoff';

import {
  Point
} from '../../src/libs/Math2D';

describe('Track lib', function () {

  let track;
  beforeEach(function () {
    const points = []
    track = new Track([new Point(0, 0), new Point(0, 5), new Point(0, 10),
                       new Point(0, 5)]);
  });

  it('it should calculate the track length', function() {
    expect(track.getTrackLength()).to.eql(20);
  });

  it('it should calculate gate positions', function() {
    track.calculate(2, 1);
    const gateLines = track.getGateLines();
    const gates = track.getGates();

    expect(gateLines.length).to.eql(20);
    expect(gates.length).to.eql(20);
  });

  it('it should calculate marker positions (single line)', function() {
    track.calculate(2, 100);
    const markers = track.getMarkers();

    expect(markers.length).to.eql(10);
  });

  it('it should calculate marker positions that are longer than single elements', function() {
    track.calculate(21, 21);
    const markers = track.getMarkers();

    expect(markers.length).to.eql(1);
  });

  it('it should calculate marker positions (double line)', function() {
    track.calculate(2, 100, 17.5);
    const markers = track.getMarkers();

    expect(markers.length).to.eql(20);
  });

  it('it should generate track XML', function() {
    track.calculate(2, 100, 17.5);
    track.getTrackXML('Trackname', 'LiftoffArena', (xml) => {
      expect(xml.length > 0).to.be.true;
    });
  });

  it('it should generate track XML with gates', function() {
    track = new Track([new Point(0, 600), new Point(0, 300), new Point(0, 1000),
                       new Point(0, 5)], true);

    track.setMarkerType(null);
    track.calculate(2, 100, 17.5);
    track.getTrackXML('Trackname', 'LiftoffArena', (xml) => {
      expect(xml.length > 0).to.be.true;
    });
  });

  it('it should generate race XML', function() {
    track = new Track([new Point(0, 600), new Point(0, 300), new Point(0, 1000),
                       new Point(0, 5)], true);

    track.setMarkerType('foo');
    track.calculate(2, 100, 17.5);
    track.getRaceXML('Trackname', (xml) => {
      expect(xml.length > 0).to.be.true;
    });
  });
});
