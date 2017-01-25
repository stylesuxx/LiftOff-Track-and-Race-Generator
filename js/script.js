(function() {
  var track;

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

  var maps = [
    {
      display: 'LiftOff Arena',
      name: 'LiftoffArena',
      zOffset: 0.1
    },
    {
      display: 'The Drawing Board',
      name: 'TheDrawingBoard',
      zOffset: 0
    }
  ]

  // Register all click handlers
  $(document).ready(function() {
    function attachXML(xml) {
      $('.rendered-track').remove();
      $('.content > div').append(
        $('<div />', {
          class: 'rendered-track'
        }).append($('<textarea />', {
          text: xml,
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          spellcheck: 'false'
        }).format({method: 'xml'}))
      );
    }

    function generateUUID() {
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });

      return uuid;
    }

    /**
     * New point may be added until the track has been closed
     */
    $('#add-point').on('click', function() {
      if(!track.close && !track.addingPoint) {
        track.addingPoint = true;
        track.addSegment();
        track.draw();
      }
    });

    $('#delete-point').on('click', function() {
      track.deleteLastSegment();
      track.draw();
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

        track.closePath();
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

        track.openPath();
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
      var trackWidth = $('#track-width').val() || 18.5;

      // Generate and set track and race ID
      track.id = generateUUID();
      track.raceId = generateUUID();

      track.clear();
      track.drawGrid();
      track.placeMarkers(markerSpacing, gateSpacing, trackWidth);
      track.drawMarkers();

      if(track.gatesEnabled) {
        track.drawGates();
      }

      $('.generate-button, #download-zip').removeClass('hidden');
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
      var map = $('#map-name').val() || 'LiftoffArena';
      var zOffset = $('#map-name option[value=' + map + ']').attr('z') || 0.0;
      var trackName = $('#track-name').val() || 'Edgy no name track';
      var markerType = $('#marker-type').val() || 'DiscConeBlue01';
      var $generating = $('<div />', {
        class: 'generating',
        text: 'Generating Track - this may take some time...'
      })
      $('.rendered-track').append($generating);

      // Give the DOM some time to update before invoking track generation
      setTimeout(function() {
        track.zOffset = zOffset;
        var xml = track.getTrackXML(trackName, map, markerType, 'AirgateBigLiftoffDark01');
        attachXML(xml);
      }, 100);

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
      var raceName = $('#race-name').val() || 'Edgy no name race';
      var $generating = $('<div />', {
        class: 'generating',
        text: 'Generating Race - this may take some time...'
      })
      $('.rendered-track').append($generating);

      // Give the DOM some time to update...
      setTimeout(function() {
        var xml = track.getRaceXML(raceName);
        attachXML(xml);
      },100);
    });

    $('#download-zip').on('click', function() {
      var zip = new JSZip();
      var map = $('#map-name').val() || 'LiftoffArena';
      var zOffset = $('#map-name option[value=' + map + ']').attr('z') || 0.0;
      var trackName = $('#track-name').val() || 'Edgy no name track';
      var markerType = $('#marker-type').val() || 'DiscConeBlue01';
      var $generating = $('<div />', {
        class: 'generating',
        text: 'Generating Zip file - this may take some time...'
      })
      $('.rendered-track').append($generating);

      setTimeout(function() {
        track.zOffset = zOffset;
        var trackXML = track.getTrackXML(trackName, map, markerType, 'AirgateBigLiftoffDark01');
        zip.file('Liftoff_Data/Tracks/' + track.id + '/' + track.id + '.track', trackXML);

        if(track.gatesEnabled) {
          var raceName = $('#race-name').val() || 'Edgy no name race';
          var raceXML = track.getRaceXML(raceName);
          zip.file('Liftoff_Data/Races/' + track.raceId + '/' + track.raceId + '.race', raceXML);
        }

        zip.generateAsync({ type: 'blob' })
        .then(function(blob) {
          saveAs(blob, track.id + '.zip');

          attachXML(trackXML);
        });
      }, 100);

    })

    // Add the tracks as options to Step 1
    $(maps).each(function(index, item) {
      var $option = $('<option />', {
        text: item.display,
        value: item.name,
        z: item.zOffset
      });

      $('#map-name').append($option);
    });
  });

  var canvas = document.getElementById('canvas');
  if(canvas.getContext) {
    var xml = new X2JS();
    track = new Track.Track(canvas, xml);
  }
  else {
    $('.header').append($('<div />', {
      text: 'Your browser does not support Canvas, you should update...'
    }));
  }
})();
