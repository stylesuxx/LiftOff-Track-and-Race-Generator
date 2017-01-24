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

  // Register all click handlers
  $(document).ready(function() {
    function sanitizeXML(xml) {
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

    function attachXML(xml) {
      var xml = sanitizeXML(xml);
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
      id = Math.random().toString(36).substring(7);

      track.clear();
      track.drawGrid();
      track.placeMarkers(markerSpacing, gateSpacing, trackWidth);
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

      // Give the DOM some time to update before invoking track generation
      setTimeout(function() {
        track.generate(id, trackName, itemName, attachXML);
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
      var $generating = $('<div />', {
        class: 'generating',
        text: 'Generating Race - this may take some time...'
      })
      $('.rendered-track').append($generating);

      // Give the DOM some time to update...
      setTimeout(function() {
        track.generateRace(id, attachXML);
      },100);
    });
  });

  var canvas = document.getElementById('canvas');
  if(canvas.getContext) {
    track = new Track.Track(canvas);
  }
  else {
    $('.header').append($('<div />', {
      text: 'Your browser does not support Canvas, you should update...'
    }));
  }
})();
