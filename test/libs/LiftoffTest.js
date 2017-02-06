import {
  Gate,
  Canvas
} from '../../src/libs/Liftoff';

import {
  Point,
  Line
} from '../../src/libs/Math2D';

describe('Liftoff', function () {

  describe('when creating a Gate', function () {
    const center = new Point();
    const p0 = new Point(0, 1);
    const p1 = new Point(0, -1);
    const line = new Line(p0, p1);

    const gate = new Gate(center, line);
    it('it should create a gate', function () {
      assert(gate);
    });
  });

  describe('when crating a Canvas', function() {
    let canvas;
    beforeEach(function () {
      canvas = new Canvas()
      const c = document.createElement('canvas');
      c.setAttribute('width', 600);
      c.setAttribute('height', 1000);
      canvas.setCanvas(c);
    });

    it('it should set the grid snap', function() {
      canvas.setGridSnap(true);

      expect(canvas.gridSnap).to.be.true;
    });

    it('it should draw the path', function() {
      canvas.draw();
    });

    it('it should be possible to drag a node', function() {
      canvas.startDragging({ clientX: 20, clientY: 20 });
      canvas.dragging({ clientX: 100, clientY: 200 });
      canvas.stopDragging();

      expect(canvas.nodes[0].x).to.eql(100);
      expect(canvas.nodes[0].y).to.eql(200);
    });

    it('it should be possible to drag empty space', function() {
      canvas.startDragging({ clientX: 0, clientY: 0 });
      canvas.dragging({ clientX: 100, clientY: 200 });
      canvas.stopDragging();

      expect(canvas.nodes[0].x).to.eql(20);
      expect(canvas.nodes[0].y).to.eql(20);
    });

    it('it should place a dragged node to the next gridsnap point', function() {
      canvas.setGridSnap(true);
      canvas.startDragging({ clientX: 20, clientY: 20 });
      canvas.dragging({ clientX: 103, clientY: 196 });
      canvas.stopDragging();

      expect(canvas.nodes[0].x).to.eql(100);
      expect(canvas.nodes[0].y).to.eql(200);
    });

    it('it should not be possible to drag a node outside the canvas', function() {
      canvas.startDragging({ clientX: 20, clientY: 20 });
      canvas.dragging({ clientX: 10000, clientY: 10000 });
      canvas.stopDragging();

      expect(canvas.nodes[0].x).to.eql(600);
      expect(canvas.nodes[0].y).to.eql(1000);

      canvas.startDragging({ clientX: 600, clientY: 1000 });
      canvas.dragging({ clientX: -1000, clientY: -1000 });
      canvas.stopDragging();

      expect(canvas.nodes[0].x).to.eql(0);
      expect(canvas.nodes[0].y).to.eql(0);
    });

    it('it should be possible to add a node', function() {
      canvas.addNode();
      canvas.adding({ clientX: 100, clientY: 200 });
      canvas.stopAdding();

      expect(canvas.nodes[4].x).to.eql(100);
      expect(canvas.nodes[4].y).to.eql(200);
    });

    it('it should not be possible to add a node when the path is closed', function() {
      canvas.setClosedState(true);
      canvas.addNode();

      expect(canvas.nodes.length).to.eql(4);
    });

    it('it should place an added node to the next gridsnap point', function() {
      canvas.setGridSnap(true);
      canvas.addNode();
      canvas.adding({ clientX: 103, clientY: 196 });
      canvas.stopAdding();

      expect(canvas.nodes[4].x).to.eql(100);
      expect(canvas.nodes[4].y).to.eql(200);
    });

    it('it should be possible to delete a node', function() {
      canvas.addNode();
      canvas.deleteNode()

      expect(canvas.nodes.length).to.eql(3);
    });

    it('it should not trigger adding when no node has been added', function() {
      canvas.adding({ clientX: 20, clientY: 20 });
    });

    it('it should be possible to set the closed state', function() {
      canvas.setClosedState(true);
      expect(canvas.closed).to.be.true;

      canvas.closePath();
      expect(canvas.closed).to.be.true;

      canvas.setClosedState(false);
      expect(canvas.closed).to.be.false;

      canvas.openPath();
      expect(canvas.closed).to.be.false;
    });
  });
});
