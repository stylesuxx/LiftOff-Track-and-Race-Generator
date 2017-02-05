import {
  Point,
  Line,
  Bezier
} from '../../src/libs/Math2D';

describe('Math2D', function () {

  describe('when creating a Point with emtpy constructor', function () {

    it('it should be set to (0, 0)', function () {
      const p = new Point();

      expect(p.x).to.equal(0);
      expect(p.y).to.equal(0);
    });
  });

  describe('when creating a Point with (3, 4)', function () {

    it('it should be set to (3, 4)', function () {
      const p = new Point(3, 4);

      expect(p.x).to.equal(3);
      expect(p.y).to.equal(4);
    });
  });

  describe('when creating a Point with (3.5, 4.6)', function () {

    it('it should be set to (3.5, 4.6)', function () {
      const p = new Point(3.5, 4.6);

      expect(p.x).to.equal(3.5);
      expect(p.y).to.equal(4.6);
    });
  });

  describe('when creating a Line', function () {

    it('it should calculate the length', function() {
      const p0 = new Point();
      const p1 = new Point(0, 2);
      const line = new Line(p0, p1);

      expect(line.getLength()).to.eql(2.0);
    });

    it('it should calculate the midpoint', function() {
      const p0 = new Point();
      const p1 = new Point(0, 2);
      const line = new Line(p0, p1);
      const midPoint = line.getMidpoint();

      expect(midPoint.x).to.eql(0);
      expect(midPoint.y).to.eql(1);
    });
  });

  describe('when creating a Bezier', function() {
    const p0 = new Point(0, 0);
    const p1 = new Point(1, 1);
    const p2 = new Point(0, 2);

    it('it should calculate the total length', function() {
      const bezier = new Bezier(p0, p1, p2);

      expect(bezier.getLength()).to.not.be.NaN;
    });

    it('it should calculate a point in time', function() {
      const bezier = new Bezier(p0, p1, p2);
      const point = bezier.getPoint(0.5);

      expect(point.x).to.eql(0.5);
      expect(point.y).to.eql(1);
    });
  });

  describe('when creating A Bezier (line edge case)', function() {
    const p0 = new Point(0, 0);
    const p1 = new Point(0, 1);
    const p2 = new Point(0, 2);

    it('it should calculate the total length', function() {
      const bezier = new Bezier(p0, p1, p2);

      expect(bezier.getLength()).to.eql(2.0);
    });

    it('it should calculate 0 as length when all points are the same', function() {
      const bezier = new Bezier({x: 0, y: 0}, {x: 0, y: 0}, {x:0, y:0});

      expect(bezier.getLength()).to.eql(0);
    });

    it('it should calculate a point in time', function() {
      const bezier = new Bezier(new Point(0, 0), new Point(1, 0), new Point(2, 0));
      const point = bezier.getPoint(0.5);

      expect(point.x).to.eql(1);
      expect(point.y).to.eql(0);
    });

    it('it should calculate the length of a line with p1 not in center', function() {
      const bezier = new Bezier(new Point(0, 0), new Point(0, 50), new Point(0, 200));
      const length = bezier.getLength();

      expect(length).to.eql(200);
    });

    it('it should calculate a positive OffsetPoint', function() {
      const bezier = new Bezier(p0, p1, p2);
      const point = bezier.getOffsetPoint(0.5, 1);

      expect(Math.round(point.x)).to.eql(1);
      expect(point.y).to.eql(1);
    });

    it('it should calculate a negative OffsetPoint', function() {
      const bezier = new Bezier(p0, p1, p2);
      const point = bezier.getOffsetPoint(0.5, -1);

      expect(Math.round(point.x)).to.eql(-1);
      expect(point.y).to.eql(1);
    });
  })
});
