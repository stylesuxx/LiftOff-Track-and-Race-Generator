import Point from './Point';

class Line {
  constructor(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
  }

  getLength() {
    const length = Math.sqrt(
      ((this.p1.x - this.p0.x) ** 2) +
      ((this.p1.y - this.p0.y) ** 2)
    );

    return length;
  }

  getMidpoint() {
    const midpoint = new Point(
      (this.p0.x + this.p1.x) / 2,
      (this.p0.y + this.p1.y) / 2
    );

    return midpoint;
  }
}

module.exports = Line;
