import {
  Point,
  Line
} from '../Math2D';

class Canvas {
  constructor() {
    this.nodes = [new Point(20, 20), new Point(100, 100), new Point(200, 200)];
    this.canvas = null;

    this.c = null;

    this.height = 0;
    this.width = 0;

    this.closed = false;
    this.addingNode = false;
    this.gridSnap = false;

    this.drag = null;
    this.dpoint = null;

    this.style = {
      grid: {
        width: 0.1,
        strokeThick: 'rgba(0, 0, 0, 1)',
        strokeThin: 'rgba(0, 0, 0, 0.4)'
      },
      point: {
        radius: 12,
        arc1: 0,
        arc2: 2 * Math.PI
      },
      smallPoint: {
        radius: 5,
        arc1: 0,
        arc2: 2 * Math.PI
      },
      path: {
        width: 6,
        stroke: 'hsla(216, 91%, 50%, 0.95)'
      },
      nodes: {
        width: 2,
        stroke: '#000',
        fill: 'hsla(100, 93%, 50%, 1)'
      }
    };
  }

  setCanvas(canvas) {
    this.canvas = canvas;

    this.c = this.canvas.getContext('2d');

    this.height = canvas.height;
    this.width = canvas.width;

    this.draw();
  }

  setGridSnap(snap) {
    this.gridSnap = snap;
  }

  clear() {
    this.c.clearRect(0, 0, this.width, this.height);
  }

  drawLine(p0, p1, style) {
    this.c.lineWidth = style.width;
    this.c.strokeStyle = style.stroke;
    this.c.fillStyle = style.fill;

    this.c.beginPath();
    this.c.moveTo(p0.x, p0.y);
    this.c.lineTo(p1.x, p1.y);
    this.c.stroke();
  }

  drawLines(lines) {
    for (let i = 0; i < lines.length; i += 1) {
      this.drawLine(lines[i].p0, lines[i].p1, {
        width: 2,
        fill: '#000',
      });
    }
  }

  drawGrid() {
    let stroke;
    // Horizontal Lines
    for (let i = 20; i < this.height; i += 20) {
      stroke = (i % 100 === 0) ? this.style.grid.strokeThick : this.style.grid.strokeThin;

      this.drawLine(new Point(0, i), new Point(this.width, i), {
        width: this.style.grid.width,
        stroke,
        fill: null
      });
    }

    // Vertical lines
    for (let i = 20; i < this.width; i += 20) {
      stroke = (i % 100 === 0) ? this.style.grid.strokeThick : this.style.grid.strokeThin;

      this.drawLine(new Point(i, 0), new Point(i, this.height), {
        width: this.style.grid.width,
        stroke,
        fill: null
      });
    }
  }

  drawPath() {
    const first = this.nodes[0];
    let last = first;

    this.c.strokeStyle = this.style.path.stroke;
    this.c.lineWidth = this.style.path.width;
    this.c.beginPath();
    this.c.moveTo(last.x, last.y);

    for (let i = 1; i < this.nodes.length; i += 1) {
      const current = this.nodes[i];

      if (i % 2 === 0) {
        this.c.quadraticCurveTo(last.x, last.y, current.x, current.y);
        this.c.stroke();
      }

      last = current;
    }

    if (this.closed) {
      this.c.quadraticCurveTo(last.x, last.y, first.x, first.y);
      this.c.stroke();
    }
  }

  drawCircle(p) {
    const style = this.style.smallPoint;
    this.c.strokeStyle = this.style.nodes.stroke;
    this.c.lineWidth = this.style.nodes.width;
    this.c.fillStyle = this.style.nodes.fill;

    this.c.beginPath();
    this.c.arc(p.x, p.y, style.radius, style.arc1, style.arc2, true);
    this.c.fill();
    this.c.stroke();
  }

  drawCircles(points) {
    for (let i = 0; i < points.length; i += 1) {
      this.drawCircle(points[i]);
    }
  }

  drawNodes() {
    this.c.strokeStyle = this.style.nodes.stroke;
    this.c.lineWidth = this.style.nodes.width;
    this.c.fillStyle = this.style.nodes.fill;

    for (let i = 0; i < this.nodes.length; i += 1) {
      const style = (i % 2 === 0) ? this.style.point : this.style.smallPoint;

      this.c.beginPath();
      this.c.arc(this.nodes[i].x, this.nodes[i].y, style.radius, style.arc1, style.arc2, true);
      this.c.fill();
      this.c.stroke();
    }
  }

  draw() {
    this.clear();
    this.drawGrid();
    this.drawPath(this.nodes);
    this.drawNodes(this.nodes);
  }

  startDragging(e) {
    const event = this.mousePos(e);
    for (let p = 0; p < this.nodes.length; p += 1) {
      const dx = this.nodes[p].x - event.x;
      const dy = this.nodes[p].y - event.y;

      if ((dx * dx) + (dy * dy) < this.style.point.radius * this.style.point.radius) {
        this.drag = p;
        this.dpoint = event;
        this.canvas.style.cursor = 'move';
        this.draw();

        return;
      }
    }
  }

  stopDragging() {
    this.canvas.style.cursor = 'default';
    this.drag = null;
    this.dpoint = null;

    this.draw();
  }

  dragging(e) {
    if (this.drag >= 0 && this.dpoint) {
      const event = this.mousePos(e);
      const moveX = event.x - this.dpoint.x;
      const moveY = event.y - this.dpoint.y;

      this.nodes[this.drag].x += moveX;
      this.nodes[this.drag].y += moveY;

      if (this.gridSnap) {
        this.nodes[this.drag].x = Math.round(event.x / 20) * 20;
        this.nodes[this.drag].y = Math.round(event.y / 20) * 20;
      }

      this.dpoint = event;

      this.draw();
    }
  }

  adding(e) {
    if (this.addingNode) {
      const event = this.mousePos(e);
      const last = this.nodes[this.nodes.length - 3];
      const cp = this.nodes[this.nodes.length - 2];
      const newest = this.nodes[this.nodes.length - 1];
      newest.x = event.x;
      newest.y = event.y;

      if (this.gridSnap) {
        newest.x = Math.round(event.x / 20) * 20;
        newest.y = Math.round(event.y / 20) * 20;
      }

      const line = new Line(last, newest);
      const midpoint = line.getMidpoint();

      cp.x = midpoint.x;
      cp.y = midpoint.y;

      this.draw();
    }
  }

  mousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x = e.pageX - rect.left;
    let y = e.pageY - rect.top;

    x = (x > this.width) ? this.width : x;
    y = (y > this.height) ? this.height : y;

    x = (x < 0) ? 0 : x;
    y = (y < 0) ? 0 : y;

    return new Point(x, y);
  }

  addNode() {
    if (!this.closed) {
      this.addingNode = true;
      const x = (this.width / 2);
      const y = (this.height / 2);

      const last = this.nodes[this.nodes.length - 1];
      const next = new Point(x, y);
      const line = new Line(last, next);

      this.nodes.push(line.getMidpoint());
      this.nodes.push(next);

      this.draw();
    }
  }

  stopAdding() {
    this.addingNode = false;
    this.draw();
  }

  setClosedState(closed) {
    if (!this.closed && closed) {
      this.closePath();
    }

    if (this.closed && !closed) {
      this.openPath();
    }
  }

  closePath() {
    if (!this.closed) {
      this.closed = true;

      const first = this.nodes[0];
      const last = this.nodes[this.nodes.length - 1];
      const line = new Line(last, first);

      this.nodes.push(line.getMidpoint());
      this.draw();
    }
  }

  openPath() {
    if (this.closed) {
      this.closed = false;
      this.nodes.pop();
      this.draw();
    }
  }

  deleteNode() {
    if (!this.closed && this.nodes.length > 3) {
      this.nodes.pop();
      this.nodes.pop();
      this.draw();
    }
  }
}

module.exports = Canvas;
