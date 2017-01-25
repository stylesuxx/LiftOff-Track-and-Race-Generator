var Math2D = (function() {
  class Point {
    constructor(x=0, y=0) {
      this.x = x;
      this.y = y;
    }
  }

  class Line {
    constructor(p0, p1) {
      this.p0 = p0;
      this.p1 = p1;
    }

    getLength() {
      var p0 = this.p0;
      var p1 = this.p1;

      var length = Math.sqrt(
        Math.pow(p1.x - p0.x, 2) +
        Math.pow(p1.y - p0.y, 2)
      );

      return length;
    }

    getMidpoint() {
      var midpoint = new Point(
        (this.p0.x + this.p1.x) / 2,
        (this.p0.y + this.p1.y) / 2
      );

      return midpoint;
    }
  }

  class Bezier {
    /**
     * This class uses the notation as per Wikipedia article
     * https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Constructing_B.C3.A9zier_curves
     */
    constructor(p0, p1, p2) {
      this.p0 = p0;
      this.p1 = p1;
      this.p2 = p2;
    }

    // Return length at given time, or total length if not time was provided
    getLength(t=1) {
      var q0 = new Point();
      var q1 = new Point();

      q0.x = this.p0.x + this.p2.x - 2 * this.p1.x;
      q0.y = this.p0.y + this.p2.y - 2 * this.p1.y;

      q1.x = 2 * this.p1.x - 2 * this.p0.x;
      q1.y = 2 * this.p1.y - 2 * this.p0.y;

      // Special case when the curve is a line.
      if(q0.x == 0 && q0.y == 0) {
        q1 = new Point();
        q1.x = (1 - t) * this.p0.x + t * this.p2.x;
        q1.y = (1 - t) * this.p0.y + t * this.p2.y;
        var line = new Line(this.p0, q1)

        return line.getLength();
      }

      var A = 4 * (Math.pow(q0.x, 2) + Math.pow(q0.y, 2));
      var B = 4 * (q0.x * q1.x + q0.y * q1.y);
      var C = Math.pow(q1.x, 2) + Math.pow(q1.y, 2);

      var b = B / (2 * A);
      var c = C / A;
      var u = t + b;
      var k = c - Math.pow(b, 2);

      return (Math.sqrt(A) / 2) * ((u * Math.sqrt(Math.pow(u, 2) + k) - b * Math.sqrt(Math.pow(b, 2) + k) + k * Math.log(Math.abs( (u + Math.sqrt(Math.pow(u, 2) + k)) / (b + Math.sqrt(Math.pow(b, 2) + k)) )) ));
    }

    // Return a Point at the given time, with the given offset
    getOffsetPoint(t, offset) {
      var p = this.getPoint(t);
      var p11 = new Point();
      var pOff = new Point();
      var multiplier = (offset < 0) ? -1 : 1;
      var c = (offset < 0) ? offset * -1 : offset;

      p11.x = (1 - t) * this.p0.x + t * this.p1.x;
      p11.y = (1 - t) * this.p0.y + t * this.p1.y;

      var b = Math.sqrt(
        Math.pow((p.x - p11.x), 2) +
        Math.pow((p.y - p11.y), 2));
      var alpha = Math.acos((b / c) * Math.PI / 180);

      pOff.x = (p.x) + Math.tan(alpha) * multiplier * Math.PI / 180 * -1 * (p11.y - p.y);
      pOff.y = (p.y) + Math.tan(alpha) * multiplier * Math.PI / 180 * (p11.x - p.x);

      return pOff;
    }

    // Return the point on the curve at the specified time
    getPoint(t) {
      var p = new Point();
      p.x = Math.pow((1 - t), 2) * this.p0.x + 2 * (1 - t) * t * this.p1.x + Math.pow(t, 2) * this.p2.x;
      p.y = Math.pow((1 - t), 2) * this.p0.y + 2 * (1 - t) * t * this.p1.y + Math.pow(t, 2) * this.p2.y;

      return p;
    }
  }

  return {
    Point: Point,
    Line: Line,
    Bezier: Bezier
  };
})();
