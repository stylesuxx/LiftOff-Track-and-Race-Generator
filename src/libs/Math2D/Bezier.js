import Point from './Point';
import Line from './Line';

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
  getLength(t = 1) {
    const x0 = ((this.p0.x + this.p2.x) - (2 * this.p1.x));
    const y0 = ((this.p0.y + this.p2.y) - (2 * this.p1.y));
    const q0 = new Point(x0, y0);

    const x1 = ((2 * this.p1.x) - (2 * this.p0.x));
    const y1 = ((2 * this.p1.y) - (2 * this.p0.y));
    const q1 = new Point(x1, y1);

    // Special case when the curve is a line.
    if ((x0 === 0 && y0 === 0) ||
        (x0 === 0 && x1 === 0) ||
        (y0 === 0 && y1 === 0)) {
      const line = new Line(this.p0, this.p2);
      const length = line.getLength() * t;

      return length;
    }

    const A = 4 * ((q0.x ** 2) + (q0.y ** 2));
    const B = 4 * ((q0.x * q1.x) + (q0.y * q1.y));
    const C = (q1.x ** 2) + (q1.y ** 2);

    const b = B / (2 * A);
    const c = C / A;
    const u = t + b;
    const k = c - (b ** 2);

    return (
      (Math.sqrt(A) / 2) * ((
      ((u * Math.sqrt((u ** 2) + k)) - (b * Math.sqrt((b ** 2) + k))) +
      (k * Math.log(
        Math.abs((u + Math.sqrt((u ** 2) + k)) / (b + Math.sqrt((b ** 2) + k)))
      ))))
    );
  }

  // Return a Point at the given time, with the given offset
  getOffsetPoint(t, offset) {
    const p = this.getPoint(t);
    const multiplier = (offset < 0) ? -1 : 1;
    const c = (offset < 0) ? -offset : offset;

    const x = ((1 - t) * this.p0.x) + (t * this.p1.x);
    const y = ((1 - t) * this.p0.y) + (t * this.p1.y);
    const p11 = new Point(x, y);

    const b = Math.sqrt(
      ((p.x - p11.x) ** 2) +
      ((p.y - p11.y) ** 2)
    );

    const alpha = Math.acos((b / c) * (Math.PI / 180));

    const xOff = (p.x) + (
      Math.tan(alpha) * multiplier * (Math.PI / -180) * (p11.y - p.y)
    );

    const yOff = (p.y) + (
      Math.tan(alpha) * multiplier * (Math.PI / 180) * (p11.x - p.x)
    );

    return new Point(xOff, yOff);
  }

  // Return the point on the curve at the specified time
  getPoint(t) {
    const dxc = this.p1.x - this.p0.x;
    const dyc = this.p1.y - this.p0.y;
    const dxl = this.p2.x - this.p1.x;
    const dyl = this.p2.y - this.p1.y;
    const cross = (dxc * dyl) - (dyc * dxl);

    // Special case of a linear Bezier curve
    if (cross === 0) {
      const b1x = ((1 - t) * this.p0.x) + (this.p2.x * t);
      const b1y = ((1 - t) * this.p0.y) + (this.p2.y * t);
      return new Point(b1x, b1y);
    }

    const x = (((1 - t) ** 2) * this.p0.x) +
      (2 * (1 - t) * t * this.p1.x) +
      ((t ** 2) * this.p2.x);

    const y = (((1 - t) ** 2) * this.p0.y) +
      (2 * (1 - t) * t * this.p1.y) +
      ((t ** 2) * this.p2.y);

    const p = new Point(x, y);

    return p;
  }
}

module.exports = Bezier;
