import xml2js from 'xml2js';
import Gate from './Gate';
import { Bezier, Point, Line } from '../Math2D';

class Track {
  constructor(nodes, gates, width = 600, height = 1000) {
    this.nodes = nodes;
    this.width = width;
    this.height = height;
    this.gatesEnabled = gates;

    this.gates = [];
    this.markers = [];

    this.markerType = 'DiscConeBlue01';

    const generateUUID = () => {
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // We need the bit wise operations here
        /* eslint-disable */
        const r = Math.random() * 16 | 0;
        const v = (c === 'x') ? r : ((r & 0x3) | 0x8);
        /* eslint-enable */
        return v.toString(16);
      });

      return uuid;
    };

    this.trackId = generateUUID();
    this.raceId = generateUUID();

    this.maps = {
      LiftoffArena: {
        z: 0.1
      },
      TheDrawingBoard: {
        z: 0
      }
    };
  }

  calculate(markerSpacing, gateSpacing, trackWidth = 0) {
    const totalLength = this.getTrackLength();

    const markerCount = Math.floor(totalLength / markerSpacing);
    const markerSplit = markerSpacing + ((totalLength % markerSpacing) / markerCount);
    let nextMarkerSplit = 0;

    const gateCount = Math.floor(totalLength / gateSpacing);
    const gateSplit = gateSpacing + ((totalLength % gateSpacing) / gateCount);
    let nextGateSplit = 0;

    const buildGate = (b, t) => {
      const l1 = b.getOffsetPoint(t, 17.5);
      const l2 = b.getOffsetPoint(t, -17.5);
      const line = new Line(l1, l2);

      const p = b.getPoint(t);

      const p11 = new Point();
      p11.x = ((1 - t) * b.p0.x) + (t * b.p1.x);
      p11.y = ((1 - t) * b.p0.y) + (t * b.p1.y);

      const angle = Math.atan2(p11.y - p.y, p11.x - p.x);
      const gate = new Gate(line, p, (angle * (180 / Math.PI)));

      return gate;
    };

    for (let i = 0; i < this.nodes.length - 1; i += 2) {
      const p0 = this.nodes[i];
      const p1 = this.nodes[i + 1];
      const p2 = this.nodes[(i + 2) % this.nodes.length];
      const b = new Bezier(p0, p1, p2);

      let gateLength = 0;
      let markerLength = 0;
      for (let j = 0.0001; j <= 1; j += 0.0001) {
        const length = b.getLength(j);
        markerLength = length;
        gateLength = length;

        if (length >= nextMarkerSplit) {
          nextMarkerSplit += markerSplit;
          const marker = b.getPoint(j);

          if (trackWidth === 0) {
            this.markers.push(marker);
          } else {
            const m1 = b.getOffsetPoint(j, trackWidth);
            const m2 = b.getOffsetPoint(j, -trackWidth);

            this.markers.push(m1);
            this.markers.push(m2);
          }

          markerLength = 0;
        }

        if (length >= nextGateSplit) {
          nextGateSplit += gateSplit;
          const gate = buildGate(b, j);

          this.gates.push(gate);
          gateLength = 0;
        }
      }

      nextMarkerSplit -= markerLength;
      nextGateSplit -= gateLength;
    }
  }

  setMarkerType(marker) {
    this.markerType = marker;
  }

  getTrackLength() {
    const last = this.nodes.length - 1;
    let length = 0;
    // Length from first to last node
    for (let i = 0; i < last - 1; i += 2) {
      const b = new Bezier(this.nodes[i],
                           this.nodes[i + 1],
                           this.nodes[i + 2]);
      length += b.getLength();
    }
    // Length from last to first node
    const b = new Bezier(this.nodes[last - 1],
                         this.nodes[last],
                         this.nodes[0]);
    length += b.getLength();

    return length;
  }

  getMarkers() {
    return this.markers;
  }

  getGateLines() {
    const lines = [];
    for (let i = 0; i < this.gates.length; i += 1) {
      lines.push(this.gates[i].line);
    }

    return lines;
  }

  getGates() {
    return this.gates;
  }

  transfromCoords(original) {
    const p = new Point(original.x, original.y);
    p.x /= 10;
    p.y /= 10;

    if (p.y > (this.height / 10) / 2) {
      p.x -= 30;
      p.y -= 50;
      p.y *= -1;
    } else {
      p.x -= 30;
      p.y += 50;
      p.y *= -1;
      p.y += 100;
    }

    return p;
  }

  getTrackBlueprint(marker, gate, zOffset) {
    const markerType = marker || 'DiscConeBlue01';
    const gateType = gate || 'AirgateBigLiftoffDark01';
    const track = [];

    const getBlueprint = (id, p, type, z, rotation = 0) => {
      const blueprint = {
        $: {},
        itemID: type,
        instanceID: id,
        position: {
          x: p.x,
          y: z,
          z: p.y
        },
        rotation: {
          x: 0,
          y: rotation,
          z: 0
        },
        purpose: 'Functional'
      };

      return blueprint;
    };

    for (let i = 0; i < this.markers.length; i += 1) {
      const p = this.transfromCoords(this.markers[i]);

      track.push(getBlueprint(i, p, markerType, zOffset));
    }

    if (this.gatesEnabled) {
      for (let i = 0; i < this.gates.length; i += 1) {
        const idx = i + this.markers.length;
        const p = this.transfromCoords(this.gates[i].center);

        track.push(getBlueprint(idx, p, gateType, zOffset, this.gates[i].rotation + 90));
      }

      // Add the spawn point
      const idx = this.markers.length + this.gates.length;
      const first = this.transfromCoords(this.gates[0].center);
      const spawn = getBlueprint(idx, first, 'SpawnPointSingle01', zOffset, this.gates[0].rotation - 90);
      track.push(spawn);
    }

    return track;
  }

  getTrackXML(trackName, map, cb) {
    const trackXML = '<?xml version="1.0" encoding="utf-16"?><Track xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><gameVersion>0.8.1</gameVersion><localID><str /><version>1</version><type>TRACK</type></localID><name /><description /><dependencies /><environment /><blueprints></blueprints><lastTrackItemID>0</lastTrackItemID></Track>';
    const that = this;
    const markerType = this.markerType;
    const gateType = null;
    const z = this.maps[map].z;
    const id = this.trackId;

    xml2js.parseString(trackXML, (err, track) => {
      const t = track;
      const blueprints = that.getTrackBlueprint(markerType, gateType, z);
      const lastId = blueprints.length - 1;

      t.Track.localID[0].str = id;
      t.Track.name = trackName;
      t.Track.description = 'Generated with the [url=https://stylesuxx.github.io/LiftOff-Track-and-Race-Generator/]LiftOff Track and Race generator[/url].';
      t.Track.environment = map;
      t.Track.lastTrackItemID = lastId;
      t.Track.blueprints = { TrackBlueprint: [] };

      for (let i = 0; i < blueprints.length; i += 1) {
        const blueprint = blueprints[i];

        blueprint.$['xsi:type'] = 'TrackBlueprintFlag';
        t.Track.blueprints.TrackBlueprint.push(blueprint);
      }

      const builder = new xml2js.Builder();
      const xml = builder.buildObject(t);

      cb(xml, id);
    });
  }

  getRaceXML(raceName, cb) {
    const raceXML = '<?xml version="1.0" encoding="utf-16"?><Race xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><gameVersion>0.8.2</gameVersion><localID><str /><version>1</version><type>RACE</type></localID><name /><description /><dependencies><dependency><str /><version>1</version><type>TRACK</type></dependency></dependencies><checkPointPassages /><requiredLaps>3</requiredLaps><spawnPointID>-1</spawnPointID><validity>Valid</validity></Race>';
    const trackId = this.trackId;
    const raceId = this.raceId;
    const indexOffset = this.markers.length;
    const spawnPointID = this.markers.length + this.gates.length;

    const getCheckpoint = (uuid, checkPointId, type, direction, next) => {
      const checkpoint = {
        uniqueId: uuid,
        checkPointID: checkPointId,
        passageType: type,
        directionality: direction,
        nextPassageIDs: {
          string: next
        }
      };

      return checkpoint;
    };

    xml2js.parseString(raceXML, (err, race) => {
      const r = race;

      r.Race.localID[0].str = raceId;
      r.Race.name = raceName;
      r.Race.dependencies[0].dependency[0].str = trackId;
      r.Race.spawnPointID = spawnPointID;
      r.Race.checkPointPassages = { RaceCheckpointPassage: [] };

      for (let i = 0; i < this.gates.length; i += 1) {
        const index = i + indexOffset;
        let checkpoint = getCheckpoint(i, index, 'Pass', 'LeftToRight', i + 1);

        if (i === 0) {
          checkpoint = getCheckpoint(i, index, 'Pass', 'LeftToRight', 'Finish');
        }

        if (i === 1) {
          checkpoint = getCheckpoint('Start', index, 'Start', 'RightToLeft', i + 1);

          const finish = getCheckpoint('Finish', index, 'Finish', 'RightToLeft', i + 1);
          r.Race.checkPointPassages.RaceCheckpointPassage.push(finish);
        }

        if (i === this.gates.length - 1) {
          checkpoint = getCheckpoint(i, index, 'Pass', 'LeftToRight', 0);
        }

        r.Race.checkPointPassages.RaceCheckpointPassage.push(checkpoint);
      }

      const builder = new xml2js.Builder();
      const xml = builder.buildObject(r);

      cb(xml, raceId);
    });
  }
}

module.exports = Track;
