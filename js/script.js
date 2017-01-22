(function() {
  var track;
  var id;

  var markerTypes = [
    {
      display: 'Blue Disc',
      name: 'DiscConeBlue01'
    },
    {
      display: 'Orange Disc',
      name: 'DiscConeOrange01'
    },
    {
      display: 'Red Disc',
      name: 'DiscConeRed01'
    },
    {
      display: 'Yellow Disc',
      name: 'DiscConeYellow01'
    },
    {
      display: 'Magenta Disc',
      name: 'DiscConeMagenta01'
    },
    {
      display: 'Greend Disc',
      name: 'DiscConeGreen01'
    },
    {
      display: 'Traffic Cone',
      name: 'TrafficCone01'
    },
    {
      display: 'Danger Pyramid',
      name: 'DangerPyramid01'
    },
    {
      display: 'Air Polygon LuGus Studios',
      name: 'AirPylonLuGusStudios01'
    }
  ];

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
  }

  class Gate {
    constructor(line, center, rotation=0) {
      this.line = line;
      this.center = center
      this.rotation = rotation;
    }
  }

  class Bezier {
    getLength(p0, p1, p2) {
      var a = new Point();
      var b = new Point();

      a.x = p0.x + p2.x - 2 * p1.x;
      a.y = p0.y + p2.y - 2 * p1.y;

      b.x = 2 * p1.x - 2 * p0.x;
      b.y = 2 * p1.y - 2 * p0.y;

      var A = 4 * (Math.pow(a.x, 2) + Math.pow(a.y, 2));
      var B = 4 * (a.x * b.x + a.y * b.y);
      var C = Math.pow(b.x, 2) + Math.pow(b.y, 2);

      var Sabc = 2 * Math.sqrt(A + B + C);
      var A_2 = Math.sqrt(A);
      var A_32 = 2 * A * A_2;
      var C_2 = 2 * Math.sqrt(C);
      var BA = B / A_2;

      return (A_32 * Sabc + A_2 * B * (Sabc - C_2) + (4 * C * A - B * B) * Math.log((2 * A_2 + BA + Sabc) / (BA + C_2))) / (4 * A_32);
    }

    getLengthAtTime(p0, p1, p2, t) {
      var t = t;
      var a = new Point();
      var b = new Point();

      a.x = p0.x + p2.x - 2 * p1.x;
      a.y = p0.y + p2.y - 2 * p1.y;

      b.x = 2 * p1.x - 2 * p0.x;
      b.y = 2 * p1.y - 2 * p0.y;

      var A = 4 * (Math.pow(a.x, 2) + Math.pow(a.y, 2));
      var B = 4 * (a.x * b.x + a.y * b.y);
      var C = Math.pow(b.x, 2) + Math.pow(b.y, 2);

      b = B / (2 * A);
      var c = C / A;
      var u = t + b;
      var k = c - Math.pow(b, 2);

      return (Math.sqrt(A) / 2) * ((u * Math.sqrt(Math.pow(u, 2) + k) - b * Math.sqrt(Math.pow(b, 2) + k) + k * Math.log(Math.abs( (u + Math.sqrt(Math.pow(u, 2) + k)) / (b + Math.sqrt(Math.pow(b, 2) + k)) )) ));
    }

    getOffsetPoint(p0, p1, p, t, offset) {
      var p11 = new Point();
      var pOff = new Point();
      var multiplier = (offset < 0) ? -1 : 1;
      var c = (offset < 0) ? offset * -1 : offset;

      p11.x = (1 - t) * p0.x + t * p1.x;
      p11.y = (1 - t) * p0.y + t * p1.y;

      var b = Math.sqrt(Math.pow((p.x - p11.x), 2) + Math.pow((p.y - p11.y), 2));
      var alpha = Math.acos((b / c) * Math.PI / 180);

      pOff.x = (p.x) + Math.tan(alpha) * multiplier * Math.PI / 180 * -1 * (p11.y - p.y);
      pOff.y = (p.y) + Math.tan(alpha) * multiplier * Math.PI / 180 * (p11.x - p.x);

      return pOff;
    }

    getPointAtTime(p0, p1, p2, t) {
      var x = Math.pow((1 - t), 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
      var y = Math.pow((1 - t), 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;

      return new Point(x, y);
    }
  }

  class Track {
    constructor(canvas) {
      var that = this;
      this.canvas = canvas;
      this.drag = null;
      this.dpoint;

      this.bezier = new Bezier();

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
      var start = new Point(20, 20);
      this.points.push(start);
      this.addSegment();
    }

    addSegment() {
      var x = this.width - 20;
      var y = this.height - 20;

      var last = this.points[this.points.length - 1];
      var cp = new Point(x, last.y);
      var p = new Point(x, y);

      this.points.push(cp);
      this.points.push(p);

      this.draw();
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
      this.drawCurve();

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

    drawCurve() {
      this.c.beginPath();
      var last = null;
      for(var i in this.points) {
        var point = this.points[i];

        if(i % 2 == 0) {
          if(!last) {
            // Controll Point
            this.c.moveTo(point.x, point.y );
          }
          else {
            // Draw curve segment
            this.c.quadraticCurveTo(last.x, last.y, point.x, point.y );
            this.c.stroke();
          }
        }

        last = point;
      }

      if(this.close) {
        this.c.quadraticCurveTo(last.x, last.y, this.points[0].x, this.points[0].y );
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

      for(var i in this.markers) {
        this.c.beginPath();
        this.c.arc(this.markers[i].x, this.markers[i].y,
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

    placeMarkers(spacing, spacingGates, trackWidth) {
      var split = spacing;
      var gateSplit = spacingGates;
      var trackWidth = trackWidth;

      this.markers = [];
      this.gates = [];

      // Get length of all curves
      var totalLength = 0;
      var pointAmount = this.points.length - 1;
      for(var i = 0; i < pointAmount - 1; i+=2) {
        totalLength += this.bezier.getLength(this.points[i], this.points[i + 1], this.points[i + 2]);
      }
      totalLength += this.bezier.getLength(this.points[pointAmount-1], this.points[pointAmount], this.points[0]);

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

        var length;
        for(var j = 0.0001; j < 1; j += 0.0001) {
          length = this.bezier.getLengthAtTime(p0, p1, p2, j);

          if(length >= nextSplit) {
            nextSplit += split;
            var marker = this.bezier.getPointAtTime(p0, p1, p2, j);

            if(this.singleLine) {
              this.markers.push(marker);
            }
            else {
              var m1 = this.bezier.getOffsetPoint(p0, p1, marker, j, trackWidth);
              var m2 = this.bezier.getOffsetPoint(p0, p1, marker, j, trackWidth * -1);

              this.markers.push(m1);
              this.markers.push(m2);
            }
          }

          if(length >= nextGateSplit) {
            nextGateSplit += gateSplit;
            var marker = this.bezier.getPointAtTime(p0, p1, p2, j);
            var gate = this.getGate(p0, p1, p2, marker, j);

            this.gates.push(gate);
          }
        }

        nextSplit -= length;
        nextGateSplit -= length;
      }
    }

    getGate(p0, p1, p2, p, t) {
      var l1 = this.bezier.getOffsetPoint(p0, p1, p, t, 16);
      var l2 = this.bezier.getOffsetPoint(p0, p1, p, t, -16);

      var p11 = new Point();
      p11.x = (1 - t) * p0.x + t * p1.x;
      p11.y = (1 - t) * p0.y + t * p1.y;

      var angle = Math.atan2(p11.y - p.y, p11.x - p.x);

      var line = new Line(l1, l2);
      var gate = new Gate(line, p, angle * 180 / Math.PI );

      return gate;
    }

    generate(id, trackName, itemName, cb) {
      var trackXML = $.parseXML('<?xml version="1.0" encoding="utf-16"?><Track xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><gameVersion>0.8.1</gameVersion><localID><str /><version>1</version><type>TRACK</type></localID><name /><description /><dependencies /><environment>LiftoffArena</environment><blueprints></blueprints><lastTrackItemID>0</lastTrackItemID></Track>').documentElement;
      var $trackXML = $(trackXML);
      var that = this;

      $trackXML.find('localID str').text(id);
      $trackXML.find('name').text(trackName);
      $trackXML.find('lastTrackItemID').text(that.markers.length - 1);

      setTimeout(function() {
        $(that.markers).each(function(index, marker) {
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

              cb(that.sanitizeXML(trackXML));
            })
          }
          else {
            cb(that.sanitizeXML(trackXML));
          }
        });
      }, 100);
    }

    transfromCoords(p) {
      var p = new Point(p.x, p.y);
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

    sanitizeXML(xml) {
      // Sanitize the XML, so the game does not comlain
      var xmlString = (new XMLSerializer()).serializeToString(xml);
      xmlString = xmlString.replace(/ xmlns="http:\/\/www.w3.org\/1999\/xhtml\"/g, '');
      xmlString = xmlString.replace(/trackblueprint/g, 'TrackBlueprint');
      xmlString = xmlString.replace(/trackblueprint/g, 'TrackBlueprint');
      xmlString = xmlString.replace(/itemid/g, 'itemID');
      xmlString = xmlString.replace(/instanceid/g, 'instanceID');
      xmlString = xmlString.replace(/uniqueid/g, 'uniqueId');
      xmlString = xmlString.replace(/checkpointid/g, 'checkPointID');
      xmlString = xmlString.replace(/passagetype/g, 'passageType');
      xmlString = xmlString.replace(/nextpassageids/g, 'nextPassageIDs');
      xmlString = xmlString.replace(/racecheckpointpassage/g, 'RaceCheckpointPassage');

      return xmlString;
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

    generateRace(cb) {
      var that = this;
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

      var indexOffset = that.markers.length;
      setTimeout(function() {

        $(that.gates).each(function(index, gate) {
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
          cb(that.sanitizeXML(raceXML));
        });
      }, 100);
    }
  }

  // Register all click handlers
  $(document).ready(function() {
    function attachXML(xml) {
      $('.rendered-track').remove();
      $('.content > div').append($('<div />', {
        class: 'rendered-track'
      })
        .append($('<textarea />', {
          text: xml,
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          spellcheck: 'false'
        }).format({method: 'xml'}))
      );
    }

    /**
     * New point may be added until the track has been closed
     */
    $('#add-point').on('click', function() {
      if(!track.close) {
        track.addSegment();
      }
    });

    /**
     * Connect last and first point when close button is clicked.
     * Attach options for marker selection.
     */
    $('#close').on('click', function() {
      if(!track.close) {
        track.close = true;
        $('.step-1').hide();
        $('#step-2').show();

        for(var marker of markerTypes) {
          var $option = $('<option />', {
            text: marker.display,
            value: marker.name
          });

          $('#marker-type').append($option);
        }

        var last = track.points[track.points.length - 1];
        var first = track.points[0];

        track.points.push(new Point(last.x, first.y));
        track.draw();
      }
    });

    $('#undo-close').on('click', function() {
      if(track.close) {
        track.close = false;
        $('.step-1').show();
        $('#step-2').hide();
        $('.rendered-track').remove();
        $('#marker-type option').remove();

        track.points.pop();
        track.draw();
      }
    });

    $('#enable-gates').on('change', function() {
      $('.gate-spacing').toggleClass('hidden');
      track.gatesEnabled = !track.gatesEnabled;
    });

    $('#single').on('change', function() {
      $('.track-width').toggleClass('hidden');
      track.singleLine = !track.singleLine;
    });

    /**
     * Draw preview of the track, enable the generate button
     */
    $("#preview").on("click", function() {
      var markerSpacing = parseInt($('#marker-spacing').val()) || 10;
      var gateSpacing = parseInt($('#gate-spacing').val()) || 100;
      var trackWidth = $('#track-width').val() || 16;
      id = Math.random().toString(36).substring(7);

      track.clear();
      track.placeMarkers(markerSpacing, gateSpacing, trackWidth);
      track.drawGrid();
      track.drawMarkers();

      if(track.gatesEnabled) {
        track.drawGates();
      }

      $('.generate-button').removeClass('hidden');
    });

    /**
     * Generate the XML file.
     *
     * Canvas has (0, 0) at the top left and (n, m) in the bottom right
     * Liftoff has (0, 0) in the center, (-n, m) top left, (n, m) top right,
     * (-n, -m) bottom left, (n, -m) bottom right.
     *
     * Also JS is case insensitive and does some wired stuff when working with
     * XML, we do also take care of this here.
     */
    $('#generate').on('click', function() {
      var trackName = $('#track-name').val() || 'Edgy no name track';
      var itemName = $('#marker-type').val() || 'DiscConeBlue01';
      var $generating = $('<div />', {
        class: 'generating',
        text: 'Generating Track - this may take some time...'
      })
      $('.rendered-track').append($generating);

      track.generate(id, trackName, itemName, attachXML);

      if(track.gatesEnabled) {
        $('.race').removeClass('hidden');
      }
      else {
        $('.race').addClass('hidden');
      }
    });

    /**
     * When generating a race, a start point needs no be placed.
     * Start point is the position of the first gate. The first gate to pass is
     * the second gate. Start and finish are both the second gate.
     */
    $('#generate-race').on('click', function() {
      var $generating = $('<div />', {
        class: 'generating',
        text: 'Generating Race - this may take some time...'
      })
      $('.rendered-track').append($generating);

      track.generateRace(attachXML);
    });
  });

  var canvas = document.getElementById('canvas');
  if(canvas.getContext) {
    track = new Track(canvas);
  }
  else {
    $('.header').append($('<div />', {
      text: 'Your browser does not support Canvas, you should update...'
    }));
  }
})();
