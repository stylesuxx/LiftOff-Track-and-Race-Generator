var Track = (function() {
  class Canvas {
    constructor(canvas) {
      this.canvas = canvas;

      this.height = canvas.height;
      this.width = canvas.width;

      this.c = this.canvas.getContext('2d');
      this.c.lineCap = 'round';
      this.c.lineJoin = 'round';

      this.drag = null;
      this.dpoint = null;
      this.close = false;
      this.addingNode = false;

      this.m = Math2D;
      this.Bezier = this.m.Bezier;
      this.Point = this.m.Point;
      this.Line = this.m.Line;

      this.nodes = [];
      this.style = {
        path: {
          width: 6,
          stroke: 'hsla(216, 91%, 50%, 0.95)'
        },
        nodes: {
          width: 2,
          stroke: '#000',
          fill: 'hsla(100, 93%, 50%, 1)'
        },
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
        }
      };

      var dragStart = function(event) {
        event = mousePos(event);

        if(this.addingNode) {
          this.addingNode = false;
          return;
        }

        for(var p in this.nodes) {
          var dx = this.nodes[p].x - event.x;
          var dy = this.nodes[p].y - event.y;

          if((dx * dx) + (dy * dy) < this.style.point.radius * this.style.point.radius) {
            this.drag = p;
            this.dpoint = event;
            this.canvas.style.cursor = 'move';
            return;
          }
        }
      }.bind(this);

      var dragging = function (event) {
        if(this.drag) {
          event = mousePos(event);

          this.nodes[this.drag].x += event.x - this.dpoint.x;
          this.nodes[this.drag].y += event.y - this.dpoint.y;
          this.dpoint = event;

          this.draw();
        }

        if(this.addingNode) {
          event = mousePos(event);
          var newest = this.nodes[this.nodes.length - 1];
          var cp = this.nodes[this.nodes.length - 2];
          var last = this.nodes[this.nodes.length - 3];

          newest.x = event.x;
          newest.y = event.y;

          var line = new this.m.Line(last, newest);
          var midpoint = line.getMidpoint();

          cp.x = midpoint.x;
          cp.y = midpoint.y;

          this.draw();
        }
      }.bind(this);

      var dragStop = function(event) {
        this.drag = null;
        this.canvas.style.cursor = 'default';

        this.draw();
      }.bind(this);

      var mousePos = function(event) {
        var event = (event ) ? event : window.event;

        return {
          x: event.pageX - $(this.canvas).offset().left,
          y: event.pageY - $(this.canvas).offset().top
        }
      }.bind(this);

      this.canvas.onmousedown = dragStart;
      this.canvas.onmousemove = dragging;
      this.canvas.onmouseup = canvas.onmouseout = dragStop;
    }

    addNode(p={}) {
      this.addingNode = true;
      var x = p.x || this.width / 2;
      var y = p.y || this.height / 2;

      var last = this.nodes[this.nodes.length - 1];
      var next = new this.Point(x, y);
      var line = new this.Line(last, next);

      this.nodes.push(line.getMidpoint());
      this.nodes.push(next);
    }

    deleteLastNode() {
      if(!this.closed && this.nodes.length > 3) {
        this.nodes.pop();
        this.nodes.pop();
      }
    }

    closePath() {
      this.close = true;
      var last = this.nodes[this.nodes.length - 1];
      var first = this.nodes[0];
      var line = new this.Line(last, first);

      this.nodes.push(line.getMidpoint());
    }

    openPath() {
      this.nodes.pop();
      this.close = false;
    }

    clear() {
      this.c.clearRect(0, 0, this.width, this.height);
    }

    draw() {
      this.clear();
      this.drawGrid();

      this.c.strokeStyle = this.style.path.stroke;
      this.c.lineWidth = this.style.path.width;
      this.drawPath();

      this.c.strokeStyle = this.style.nodes.stroke;
      this.c.lineWidth = this.style.nodes.width;
      this.c.fillStyle = this.style.nodes.fill;
      this.drawNodes();
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

    drawGrid() {
      var stroke;
      for(var i = 20; i < this.height; i += 20) {
        stroke = (i % 100 == 0) ? this.style.grid.strokeThick : this.style.grid.strokeThin;

        this.drawLine(new this.Point(0, i), new this.Point(this.width, i), {
          width: this.style.grid.width,
          stroke: stroke,
          fill: null
        });
      }

      // Vertical lines
      for(var i = 20; i < this.width; i += 20) {
        stroke = (i % 100 == 0) ? this.style.grid.strokeThick : this.style.grid.strokeThin;

        this.drawLine(new this.Point(i, 0), new this.Point(i, this.height), {
          width: this.style.grid.width,
          stroke: stroke,
          fill: null
        });
      }
    }

    drawPath() {
      var first = this.nodes[0];
      var last = first;

      this.c.beginPath();
      this.c.moveTo(last.x, last.y);
      for(var i= 1; i < this.nodes.length; i++) {
        var current = this.nodes[i];

        if(i % 2 == 0) {
          this.c.quadraticCurveTo(last.x, last.y, current.x, current.y);
          this.c.stroke();
        }

        last = current;
      }

      if(this.close) {
        this.c.quadraticCurveTo(last.x, last.y, first.x, first.y);
        this.c.stroke();
      }
    }

    drawNodes() {
      for(var i in this.nodes) {
        var style = (i % 2 == 0) ? this.style.point : this.style.smallPoint;

        this.c.beginPath();
        this.c.arc(this.nodes[i].x, this.nodes[i].y,
                   style.radius, style.arc1, style.arc2, true);
        this.c.fill();
        this.c.stroke();
      }
    }

    drawCircle(p, style) {
        this.c.lineWidth = this.style.nodes.width;
        this.c.strokeStyle = this.style.nodes.color;
        this.c.fillStyle = this.style.nodes.fill;

        this.c.beginPath();
        this.c.arc(p.x, p.y, style.radius, style.arc1, style.arc2, true);
        this.c.fill();
        this.c.stroke();
    }

    getPathLength() {
      var nodes = this.nodes;
      var totalLength = 0;
      var pointAmount = nodes.length - 1;
      for(var i = 0; i < pointAmount - 1; i += 2) {
        var b = new this.Bezier(nodes[i], nodes[i + 1], nodes[i + 2])
        totalLength += b.getLength();
      }
      var b = new this.Bezier(nodes[pointAmount-1], nodes[pointAmount], nodes[0])
      totalLength += b.getLength();

      return totalLength;
    }

  }

  class Gate {
    constructor(line, center, rotation=0) {
      this.line = line;
      this.center = center
      this.rotation = rotation;
    }
  }

  class Track {
    constructor(canvas, xml) {
      this.canvas = canvas;
      this.xml = xml;

      this.canvas_ = new Canvas(canvas);

      this.id;
      this.raceId;

      this.singleLine = true;
      this.gatesEnabled = false;

      this.zOffset = 0;

      this.m = Math2D;
      this.Bezier = this.m.Bezier;
      this.Point = this.m.Point;
      this.Line = this.m.Line;

      this.markers = [];
      this.gates = [];

      this.drawMarkers = function() {
        for(var marker of this.markers) {
          this.canvas_.drawCircle(marker, {
            radius: 5,
            arc1: 0,
            arc2: 2 * Math.PI
          });
        }
      }.bind(this);

      this.drawGates = function() {
        for(var gate of this.gates) {
          this.canvas_.drawLine(gate.line.p0, gate.line.p1, {
            width: 2,
            stroke: '#000',
            fill: 'hsla(100, 93%, 50%, 1)'
          });
        }
      }.bind(this);

      this.placeMarkers = function(split, gateSplit, trackWidth) {
        this.markers = [];
        this.gates = [];

        var points = this.canvas_.nodes;
        var totalLength = this.canvas_.getPathLength();

        // Optimize the split, so that the markers are equally spaced on the total
        // available length.
        var markerCount = Math.floor(totalLength / split);
        var rest = totalLength % split;
        split = split + (rest / markerCount);
        var nextSplit = 0;

        var gateCount = Math.floor(totalLength / gateSplit);
        rest = totalLength % gateSplit;
        gateSplit = gateSplit + (rest / gateCount);
        var nextGateSplit = 0;

        for(var i = 0; i < points.length - 1; i += 2) {
          var p0 = points[i];
          var p1 = points[i + 1];
          var p2 = points[(i+2) % points.length];
          var b = new this.Bezier(p0, p1, p2);

          var length;
          var hadGateSplit = false;
          var hadMarkerSplit = false;
          for(var j = 0.0001; j <= 1; j += 0.0001) {
            hadGateSplit = false;
            hadMarkerSplit = false;
            length = b.getLength(j);

            if(length >= nextSplit) {
              hadMarkerSplit = true;
              nextSplit += split;
              var marker = b.getPoint(j);

              if(this.singleLine) {
                this.markers.push(marker);
              }
              else {
                var m1 = b.getOffsetPoint(j, trackWidth);
                var m2 = b.getOffsetPoint(j, trackWidth * -1);

                this.markers.push(m1);
                this.markers.push(m2);
              }
            }

            if(length >= nextGateSplit) {
              hadGateSplit = true;
              nextGateSplit += gateSplit;
              var marker = b.getPoint(j);
              var gate = this.getGate(b, j);

              this.gates.push(gate);
            }
          }

          if(!hadMarkerSplit) nextSplit -= length;
          if(!hadGateSplit) nextGateSplit -= length;
        }
      }.bind(this);

      this.getGate = function(b, t) {
        var l1 = b.getOffsetPoint(t, 18.5);
        var l2 = b.getOffsetPoint(t, -18.5);
        var p = b.getPoint(t);

        var p11 = new this.Point();
        p11.x = (1 - t) * b.p0.x + t * b.p1.x;
        p11.y = (1 - t) * b.p0.y + t * b.p1.y;

        var angle = Math.atan2(p11.y - p.y, p11.x - p.x);
        var line = new this.Line(l1, l2);
        var gate = new Gate(line, p, angle * 180 / Math.PI );

        return gate;
      }.bind(this);

      this.transfromCoords = function(p) {
        var p = new this.Point(p.x, p.y);
        p.x /= 10;
        p.y /= 10;

        if(p.y > (this.height / 10) / 2) {
          p.x -= 30;
          p.y -= 50;
          p.y *= -1;
        }
        else {
          p.x -= 30;
          p.y += 50;
          p.y *= -1;
          p.y += 100;
        }

        return p;
      }.bind(this);

      // Return a JSON representation of all Blueprint items
      this.getTrackBlueprint = function(markerType, gateType, z) {
        var markerType = markerType || 'DiscConeBlue01';
        var gateType = gateType || 'AirgateBigLiftoffDark01';
        var track = [];

        for(var i in this.markers) {
          var marker = this.markers[i];
          var p = this.transfromCoords(marker);

          track.push(this.getBlueprint(i, p, markerType, z));
        }

        if(this.gatesEnabled) {
          for(var i in this.gates) {
            var gate = this.gates[i];
            var idx = parseInt(i) + this.markers.length;
            var p = this.transfromCoords(gate.center);

            track.push(this.getBlueprint(idx, p, gateType, z, gate.rotation + 90));
          }

          // Add the spawn point
          var idx = this.markers.length + this.gates.length;
          var first = this.transfromCoords(this.gates[0].center);
          var spawn = this.getBlueprint(idx, first, 'SpawnPointSingle01', z, this.gates[0].rotation - 90);
          track.push(spawn);
        }

        return track;
      }.bind(this);

      this.getBlueprint = function(id, p, type, z, rotation=0) {
        var blueprint = {
          'itemID': type,
          'instanceID': id,
          'position': {
            'x': p.x,
            'y': z,
            'z': p.y
          },
          'rotation': {
            'x': 0,
            'y': rotation,
            'z': 0
          },
          'purpose': 'Functional'
        };

        return blueprint;
      }

      this.getCheckpoint = function(uuid, checkPointId, type, direction, next) {
        var checkpoint = {
          'uniqueId': uuid,
          'checkPointID': checkPointId,
          'passageType': type,
          'directionality': direction,
          'nextPassageIDs': {
            'string': next
          }
        };

        return checkpoint;
      }

      // Push the start point and add the first Segment
      var start = new this.Point(20, 20);
      var first = new this.Point(200, 300);

      this.canvas_.nodes.push(start);
      this.canvas_.addNode(first);
      this.canvas_.draw();
    }

    addSegment() {
      this.canvas_.addNode();
      this.canvas_.draw();
    }

    deleteLastSegment() {
      this.canvas_.deleteLastNode();
      this.canvas_.draw();
    }

    close() {
      this.canvas_.closePath();
      this.canvas_.draw();
    }

    open() {
      this.canvas_.openPath();
      this.canvas_.draw();
    }

    preview(markerSplit, gateSplit, trackWidth) {
      this.canvas_.clear();
      this.canvas_.drawGrid();

      this.placeMarkers(markerSplit, gateSplit, trackWidth);
      this.drawMarkers();

      if(this.gatesEnabled) {
        this.drawGates();
      }
    }

    // Return a XML representation of the track, ready to print
    getTrackXML(trackName, map, z, markerType, gateType) {
      var trackXML = '<?xml version="1.0" encoding="utf-16"?><Track xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><gameVersion>0.8.1</gameVersion><localID><str /><version>1</version><type>TRACK</type></localID><name /><description /><dependencies /><environment /><blueprints></blueprints><lastTrackItemID>0</lastTrackItemID></Track>';
      var blueprints = this.getTrackBlueprint(markerType, gateType, z);
      var track = this.xml.xml_str2json(trackXML);
      var lastId = blueprints.length - 1;

      track['Track']['localID']['str'] = this.id;
      track['Track']['name'] = trackName;
      track['Track']['environment'] =  map;
      track['Track']['lastTrackItemID'] = lastId;
      track['Track']['blueprints'] = { 'TrackBlueprint': [] };

      for(var blueprint of blueprints) {
        blueprint['_xsi:type'] = 'TrackBlueprintFlag';

        track['Track']['blueprints']['TrackBlueprint'].push(blueprint);
      }

      return this.xml.json2xml_str(track);
    }

    getRaceXML(raceName) {
      var raceXML = '<?xml version="1.0" encoding="utf-16"?><Race xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><gameVersion>0.8.2</gameVersion><localID><str /><version>1</version><type>RACE</type></localID><name /><description /><dependencies><dependency><str /><version>1</version><type>TRACK</type></dependency></dependencies><checkPointPassages /><requiredLaps>3</requiredLaps><spawnPointID>-1</spawnPointID><validity>Valid</validity></Race>';
      var race = this.xml.xml_str2json(raceXML);
      var indexOffset = this.markers.length;
      var spawnPointID = this.markers.length + this.gates.length;

      // check if we need race ID
      race['Race']['localID']['str'] = this.raceId;
      race['Race']['name'] = raceName;
      race['Race']['dependencies']['dependency']['str'] = this.id;
      race['Race']['spawnPointID'] = spawnPointID;
      race['Race']['checkPointPassages'] = { 'RaceCheckpointPassage': [] };

      // Append gates
      for(var i in this.gates) {
        var i = parseInt(i);
        var gate = this.gates[i];
        var index = i + indexOffset;
        var checkpoint = this.getCheckpoint(i, index, 'Pass', 'LeftToRight', i + 1);

        if(i == 0) {
          checkpoint = this.getCheckpoint(i, index, 'Pass', 'LeftToRight', 'Finish');
        }

        if(i == 1) {
          checkpoint = this.getCheckpoint('Start', index, 'Start', 'RightToLeft', i + 1);

          var finish = this.getCheckpoint('Finish', index, 'Finish', 'RightToLeft', i + 1);;
          delete race['Race']['nextPassageIDs'];

          race['Race']['checkPointPassages']['RaceCheckpointPassage'].push(finish);
        }

        if(i == this.gates.length - 1) {
          checkpoint = this.getCheckpoint(i, index, 'Pass', 'LeftToRight', 0);
        }

        race['Race']['checkPointPassages']['RaceCheckpointPassage'].push(checkpoint);
      }

      return this.xml.json2xml_str(race);
    }

  }

  return { Track: Track };
})();
