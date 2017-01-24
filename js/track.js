var Track = (function() {
  class Gate {
    constructor(line, center, rotation=0) {
      this.line = line;
      this.center = center
      this.rotation = rotation;
    }
  }

  class Track {
    constructor(canvas) {
      var that = this;
      this.canvas = canvas;
      this.drag = null;
      this.dpoint;
      this.addingPoint = false;

      this.m = Math2D;
      this.Point = this.m.Point;
      this.Line = this.m.Line;
      this.Bezier = this.m.Bezier;

      this.$blueprintTemplate = $('<TrackBlueprint />', {
        'xsi:type': 'TrackBlueprintFlag'
      })
      .append($('<itemID />'))
      .append($('<instanceID />'))
      .append(
        $('<position />')
        .append($('<x />'))
        .append($('<y />'))
        .append($('<z />'))
      )
      .append(
        $('<rotation />')
        .append($('<x />', { text: 0.0 }))
        .append($('<y />', { text: 0.0 }))
        .append($('<z />', { text: 0.0 }))
      )
      .append($('<purpose />', {
        text: 'Functional'
      }));

      this.style = {
        thinCurve: {
          width: 1,
          color: 'rgba(0, 255, 0, 1)'
        },
        curve: {
          width: 6,
          color: 'hsla(216, 91%, 50%, 0.95)'
        },
        pline: {
          width: 2,
          color: ''
        },
        circles: {
          width: 2,
          color: '#000',
          fill: 'hsla(100, 93%, 50%, 1)'
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

      this.markers = [];
      this.gates = [];
      this.points = [];

      this.close = false;
      this.gatesEnabled = false;
      this.singleLine = true;

      this.c = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;

      // line style
      this.c.lineCap = 'round';
      this.c.lineJoin = 'round';

      // Mouse handlers
      function dragStart(event) {
        event = mousePos(event);

        if(that.addingPoint) {
          that.addingPoint = false;
          return;
        }

        for(var p in that.points) {
          var dx = that.points[p].x - event.x;
          var dy = that.points[p].y - event.y;

          if((dx * dx) + (dy * dy) < that.style.point.radius * that.style.point.radius) {
            that.drag = p;
            that.dpoint = event;
            that.canvas.style.cursor = 'move';
            return;
          }
        }
      }

      function dragging(event) {
        if(that.drag) {
          event = mousePos(event);

          that.points[that.drag].x += event.x - that.dpoint.x;
          that.points[that.drag].y += event.y - that.dpoint.y;
          that.dpoint = event;

          that.draw();
        }

        if(that.addingPoint) {
          event = mousePos(event);
          var newest = that.points[that.points.length - 1];
          var cp = that.points[that.points.length - 2];
          var last = that.points[that.points.length - 3];

          newest.x = event.x;
          newest.y = event.y;

          var line = new that.m.Line(last, newest);
          var midpoint = line.getMidpoint();

          cp.x = midpoint.x;
          cp.y = midpoint.y;

          that.draw();
        }
      }

      function dragStop(event) {
        that.drag = null;
        that.canvas.style.cursor = 'default';

        that.draw();
      }

      function mousePos(event) {
        var event = (event ) ? event : window.event;

        return {
          x: event.pageX - $(that.canvas).offset().left,
          y: event.pageY - $(that.canvas).offset().top
        }
      }

      this.canvas.onmousedown = dragStart;
      this.canvas.onmousemove = dragging;
      this.canvas.onmouseup = canvas.onmouseout = dragStop;

      // Push the start point and add the first Segment
      var start = new this.Point(20, 20);
      var first = new this.Point(200, 300);
      this.points.push(start);
      this.addSegment(first);
      this.draw();
    }

    /**
     * If no point is give a new point is added to the center of the canvas.
     * The control point is always placed between the new and the last point.
     */
    addSegment(p={}) {
      var x = p.x || this.width / 2;
      var y = p.y || this.height / 2;

      var last = this.points[this.points.length - 1];
      var p = new this.Point(x, y);
      var line = new this.Line(p, last);

      this.points.push(line.getMidpoint());
      this.points.push(p);
    }

    deleteLastSegment() {
      if(!this.closed && this.points.length > 3) {
        this.points.pop();
        this.points.pop();
      }
    }

    closePath() {
      var last = this.points[this.points.length - 1];
      var first = this.points[0];
      var line = new this.Line(last, first);

      this.points.push(line.getMidpoint());
    }

    openPath() {
      this.points.pop();
    }

    clear() {
      this.c.clearRect(0, 0, this.width, this.height);
    }

    draw() {
      this.clear();

      this.drawGrid();

      // Draw all the curve segments in one single path
      this.c.lineWidth = this.style.curve.width;
      this.c.strokeStyle = this.style.curve.color;
      this.drawPath();

      this.c.lineWidth = this.style.circles.width;
      this.c.strokeStyle = this.style.circles.color;
      this.c.fillStyle = this.style.circles.fill;
      this.drawCircles();
    }

    drawGrid() {
      this.c.lineWidth = 0.1;

      // Horizontal lines
      for(var i = 20; i < this.height; i += 20) {
        this.c.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        if(i % 100 == 0) {
          this.c.strokeStyle = 'rgba(0, 0, 0, 1)';
        }

        this.c.beginPath();
        this.c.moveTo(0, i);
        this.c.lineTo(this.width, i);
        this.c.stroke();
      }

      // Vertical lines
      for(var i = 20; i < this.width; i += 20) {
        this.c.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        if(i % 100 == 0) {
          this.c.strokeStyle = 'rgba(0, 0, 0, 1)';
        }

        this.c.beginPath();
        this.c.moveTo(i, 0);
        this.c.lineTo(i, this.height);
        this.c.stroke();
      }
    }

    drawPath() {
      var first = this.points[0];
      var last = first;

      this.c.beginPath();
      this.c.moveTo(last.x, last.y);
      for(var i= 1; i < this.points.length; i++) {
        var point = this.points[i];

        if(i % 2 == 0) {
          this.c.quadraticCurveTo(last.x, last.y, point.x, point.y);
          this.c.stroke();
        }

        last = point;
      }

      if(this.close) {
        this.c.quadraticCurveTo(last.x, last.y, first.x, first.y);
        this.c.stroke();
      }
    }

    drawCircles() {
      for(var i in this.points) {
        this.c.beginPath();
        if(i % 2 == 0) {
          this.c.arc(this.points[i].x, this.points[i].y, this.style.point.radius,
                     this.style.point.arc1, this.style.point.arc2, true );
        }
        else {
          this.c.arc(this.points[i].x, this.points[i].y,
                     this.style.smallPoint.radius, this.style.smallPoint.arc1,
                     this.style.point.arc2, true);
        }
        this.c.fill();
        this.c.stroke();
      }
    }

    drawMarkers() {
      this.c.lineWidth = this.style.circles.width;
      this.c.strokeStyle = this.style.circles.color;
      this.c.fillStyle = this.style.circles.fill;

      for(var marker of this.markers) {
        this.c.beginPath();
        this.c.arc(marker.x, marker.y,
                   this.style.smallPoint.radius, this.style.smallPoint.arc1,
                   this.style.point.arc2, true);
        this.c.fill();
        this.c.stroke();
      }
    }

    drawGates() {
      this.c.lineWidth = this.style.circles.width;
      this.c.strokeStyle = this.style.circles.color;
      this.c.fillStyle = this.style.circles.fill;

      for(var gate of this.gates) {
        var gate = gate.line;

        this.c.beginPath();
        this.c.moveTo(gate.p0.x, gate.p0.y);
        this.c.lineTo(gate.p1.x, gate.p1.y)
        this.c.stroke();
      }
    }

    placeMarkers(split, gateSplit, trackWidth) {
      this.markers = [];
      this.gates = [];

      // Get length of all curves
      var totalLength = 0;
      var pointAmount = this.points.length - 1;
      for(var i = 0; i < pointAmount - 1; i += 2) {
        var b = new this.Bezier(this.points[i], this.points[i + 1], this.points[i + 2])
        totalLength += b.getLength();
      }
      var b = new this.Bezier(this.points[pointAmount-1], this.points[pointAmount], this.points[0])
      totalLength += b.getLength();

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

      for(var i = 0; i < this.points.length - 1; i += 2) {
        var p0 = this.points[i];
        var p1 = this.points[i + 1];
        var p2 = this.points[(i+2) % this.points.length];
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
    }

    getGate(b, t) {
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
    }

    generate(id, trackName, itemName, cb) {
      var trackXML = $.parseXML('<?xml version="1.0" encoding="utf-16"?><Track xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><gameVersion>0.8.1</gameVersion><localID><str /><version>1</version><type>TRACK</type></localID><name /><description /><dependencies /><environment>LiftoffArena</environment><blueprints></blueprints><lastTrackItemID>0</lastTrackItemID></Track>').documentElement;
      var $trackXML = $(trackXML);
      var that = this;

      $trackXML.find('localID str').text(id);
      $trackXML.find('name').text(trackName);
      $trackXML.find('lastTrackItemID').text(this.markers.length - 1);

      $(this.markers).each(function(index, marker) {
        var p = that.transfromCoords(marker);
        var $blueprint = that.getBlueprint(index, p, itemName);
        $trackXML.find('blueprints').append($blueprint);
      })
      .promise()
      .done(function() {
        if(that.gatesEnabled) {
          $trackXML.find('lastTrackItemID').text(that.markers.length + that.gates.length - 1);
          $(that.gates).each(function(index, gate) {
            var p = that.transfromCoords(gate.center);
            var $blueprint = that.getBlueprint(index + that.markers.length, p, 'AirgateBigLiftoffDark01', gate.rotation + 90);
            $trackXML.find('blueprints').append($blueprint);
          })
          .promise()
          .done(function() {
            var first = that.transfromCoords(that.gates[0].center);
            var $blueprint = that.getBlueprint(that.markers.length + that.gates.length, first, 'SpawnPointSingle01', that.gates[0].rotation - 90);
            $trackXML.find('blueprints').append($blueprint);
            $trackXML.find('lastTrackItemID').text(that.markers.length + that.gates.length);

            if(cb) cb(trackXML);
          })
        }
        else {
          if(cb) cb(trackXML);
        }
      });
    }

    transfromCoords(p) {
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
    }

    getBlueprint(id, p0, type, rotation=0) {
      var $blueprint = this.$blueprintTemplate.clone();

      $blueprint.find('itemid').text(type);
      $blueprint.find('instanceid').text(id);
      $blueprint.find('position x').text(p0.x);
      $blueprint.find('position y').text(0.1);
      $blueprint.find('position z').text(p0.y);
      $blueprint.find('rotation y').text(rotation);

      return $blueprint;
    }

    generateRace(id, cb) {
      var that = this;
      var indexOffset = that.markers.length;
      var $checkpointTemplate = $('<RaceCheckpointPassage />')
      .append($('<uniqueId />'))
      .append($('<checkPointID />'))
      .append($('<passageType />'))
      .append($('<directionality />'))
      .append(
        $('<nextPassageIDs />')
        .append($('<string />'))
      );

      var raceId = Math.random().toString(36).substring(7);
      var raceXML = $.parseXML('<?xml version="1.0" encoding="utf-16"?><Race xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><gameVersion>0.8.2</gameVersion><localID><str /><version>1</version><type>RACE</type></localID><name /><description /><dependencies><dependency><str /><version>1</version><type>TRACK</type></dependency></dependencies><checkPointPassages /><requiredLaps>3</requiredLaps><spawnPointID>-1</spawnPointID><validity>Valid</validity></Race>').documentElement;
      var $raceXML = $(raceXML);
      var raceName = $('#race-name').val() || 'Edgy no name race';
      var spawnPointID = that.markers.length + that.gates.length;

      $raceXML.find('localID str').text(raceId);
      $raceXML.find('name').text(raceName);
      $raceXML.find('dependencies dependency str').text(id);
      $raceXML.find('spawnPointID').text(spawnPointID);

      $(this.gates).each(function(index, gate) {
        var idx = indexOffset + parseInt(index);
        var $checkpoint = $checkpointTemplate.clone();

        $checkpoint.find('checkPointID').text(idx);
        $checkpoint.find('uniqueId').text(index);
        $checkpoint.find('passageType').text('Pass');
        $checkpoint.find('directionality').text('LeftToRight');
        $checkpoint.find('nextPassageIDs string').text((index + 1));

        if(index == 0) {
          $checkpoint.find('nextPassageIDs string').text('Finish');
        }

        if(index == 1) {
          //First gate is start and end gate
          $checkpoint.find('uniqueId').text('Start');
          $checkpoint.find('passageType').text('Start');
          $checkpoint.find('directionality').text('RightToLeft');

          var $finish = $checkpoint.clone();
          $finish.find('uniqueId').text('Finish');
          $finish.find('passageType').text('Finish');
          $finish.find('nextPassageIDs string').remove();

          $raceXML.find('checkPointPassages').append($finish);
        }

        if(index == that.gates.length - 1) {
          $checkpoint.find('nextPassageIDs string').text(0);
        }

        $raceXML.find('checkPointPassages').append($checkpoint);
      })
      .promise()
      .done(function() {
        if(cb) cb(raceXML);
      });
    }
  }

  return {
    Track: Track
  };
})();
