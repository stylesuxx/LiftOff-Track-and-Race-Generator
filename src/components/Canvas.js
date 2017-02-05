import React from 'react';
import cssmodules from 'react-css-modules';
import styles from './canvas.cssmodule.scss';

import {
  Canvas as C,
  Track
} from '../libs/Liftoff';

class Canvas extends React.Component {

  constructor(props) {
    super(props);

    this.c = new C();

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    this.c.setCanvas(this.canvasElement);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.canvas.nodeDeleted) {
      this.c.deleteNode();
      this.props.actions.deletePoint();
    }

    if (!nextProps.track.trackRendered) {
      const doubleLine = this.props.track.doubleLine;
      const markerSpacing = this.props.track.markerSpacing;
      const gateSpacing = this.props.track.gateSpacing;
      const gatesEnabled = this.props.track.gatesEnabled;
      const markerType = this.props.track.markerType;
      const track = new Track(this.c.nodes, gatesEnabled);
      const trackWidth = (doubleLine) ? this.props.track.trackWidth : 0;

      track.calculate(markerSpacing, gateSpacing, trackWidth);
      track.setMarkerType(markerType);

      const markers = track.getMarkers();

      this.c.clear();
      this.c.drawGrid();
      this.c.drawCircles(markers);

      if (this.props.track.gatesEnabled) {
        const gateLines = track.getGateLines();
        this.c.drawLines(gateLines);
      }

      track.getTrackXML(this.props.track.name, this.props.track.map,
        (value, id) => { this.props.actions.setTrackText({ id, value }); });

      track.getRaceXML('Race 01',
        (value, id) => { this.props.actions.setRaceText({ id, value }); });

      this.props.actions.renderPreview();
      this.props.actions.enableDownload();
    }

    if (!nextProps.canvas.nodeAdded) {
      this.c.addNode();
    }
  }

  onMouseMove(e) {
    if (this.props.track.addingNode) {
      this.c.adding(e);
    } else {
      this.c.dragging(e);
    }
  }

  onMouseUp() {
    this.c.stopDragging();
  }

  onMouseDown(e) {
    const adding = this.props.track.addingNode;

    if (adding) {
      this.c.stopAdding();
      this.props.actions.stopAddingPoint();
    } else {
      this.c.startDragging(e);
    }
  }

  render() {
    this.c.setClosedState(this.props.track.closed);
    this.c.setGridSnap(this.props.canvas.gridSnap);

    return (
      <canvas
        ref={(canvas) => { this.canvasElement = canvas; }}

        className="canvas-component"
        styleName="canvas-component"

        width={this.props.track.width}
        height={this.props.track.height}

        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      />
    );
  }
}

Canvas.displayName = 'Canvas';
Canvas.propTypes = {
  actions: React.PropTypes.shape({
    stopAddingPoint: React.PropTypes.func.isRequired,
    setTrackText: React.PropTypes.func.isRequired,
    setRaceText: React.PropTypes.func.isRequired,
    renderPreview: React.PropTypes.func.isRequired,
    deletePoint: React.PropTypes.func.isRequired,
    enableDownload: React.PropTypes.func.isRequired
  }),
  track: React.PropTypes.shape({
    markerSpacing: React.PropTypes.number.isRequired,
    gateSpacing: React.PropTypes.number.isRequired,
    markerType: React.PropTypes.string.isRequired,
    gatesEnabled: React.PropTypes.bool.isRequired,
    trackWidth: React.PropTypes.number.isRequired,
    doubleLine: React.PropTypes.bool.isRequired,
    addingNode: React.PropTypes.bool.isRequired,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    closed: React.PropTypes.bool.isRequired,
    name: React.PropTypes.string.isRequired,
    map: React.PropTypes.string.isRequired
  }),
  canvas: React.PropTypes.shape({
    nodeDeleted: React.PropTypes.bool.isRequired,
    nodeAdded: React.PropTypes.bool.isRequired,
    gridSnap: React.PropTypes.bool.isRequired
  })
};
/* istanbul ignore next */
Canvas.defaultProps = {
  actions: {
    stopAddingPoint: () => {},
    setTrackText: () => {},
    setRaceText: () => {},
    renderPreview: () => {},
    deletePoint: () => {},
    enableDownload: () => {}
  },
  track: {
    gatesEnabled: false,
    trackRendered: true,
    addingNode: false,
    markerSpacing: 20,
    doubleLine: false,
    gateSpacing: 100,
    height: 1000,
    width: 600,
    map: 'LiftoffArena',
    name: 'Trackname',
    markerType: 'DiscConeBlue01'
  },
  canvas: {
    nodeDeleted: true,
    nodeAdded: true,
    gridSnap: false
  }
};

export default cssmodules(Canvas, styles);
