function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.2827, lng: -123.1207},
    zoom: 11,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    let infoWindow = new google.maps.InfoWindow();

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      if (place.photos){
        markers.push(new google.maps.Marker({
          map: map,
          icon: "https://66.media.tumblr.com/tumblr_m7wvguKViU1r17mw1.png",
          title: place.name,
          photo: place.photos[0].getUrl(),
          position: place.geometry.location
        }));
      } else {
        markers.push(new google.maps.Marker({
          map: map,
          icon: "https://66.media.tumblr.com/tumblr_m7wvguKViU1r17mw1.png",
          position: place.geometry.location
        }));
      }

      function loadInfoWindow(markers) {
        for (let i = 0; i < markers.length; i++) {
          google.maps.event.addListener(markers[i], 'click', function () {
            if (markers[i].title){
            infoWindow.setContent(`<h3>${markers[i].title}</h3>`
              + `<img src="${markers[i].photo}" style="max-width:180px;max-height:100px;">`
              + '<form>Description:<br><input type="text" name="description" style=width:95%;height:40px;text-align:top;><br></form>'
              + '<button type="button">Add point</button>')
            } else {
              infoWindow.setContent(
                '<form>Name:<br><input type="text" name="name" style=width:95%;height:20px;text-align:top;><br></form>'
                + '<button class="picture" type="button">Add picture</button>'
                + '<form>Description:<br><input type="text" name="description" style=width:95%;height:40px;text-align:top;><br></form>'
                + '<button type="button">Add point</button>')
              }
            infoWindow.open(map, markers[i]);
          })
        };
      }
      loadInfoWindow(markers)

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


$(document).ready(function() {
  initAutocomplete();
  //on click of add button on marker, add to database
  // $('button').onclick(knex('points').insert(map_id: map, title:$('input'), date_created: , description: ))
});