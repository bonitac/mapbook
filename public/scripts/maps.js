function initAutocomplete() {
  let map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 49.2827, lng: -123.1207 },
    zoom: 11,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  let input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });
  //arr of infoWindows
  let infoWindows = [];
  //closes all infoWindows
  function closeAllInfoWindows() {
    for (let i = 0; i < infoWindows.length; i++) {
      infoWindows[i].close();
    }
  }

  let markers = [];
  function loadMarkers() {
    $.ajax({
      method: 'get',
      url: '/maps/1',
      dataType: 'json',
      success: function (response) {
        response.results.forEach((point) => {
          let infoWindow = new google.maps.InfoWindow()
          infoWindows.push(infoWindow)
          let newMarker = new google.maps.Marker({
            map: map,
            icon: "https://static.planetminecraft.com/files/avatar/2070651_13.gif",
            position: { lat: Number(point.lat), lng: Number(point.lng) }
          });
          markers.push(newMarker)

          newMarker.addListener('click', function () {
            if (infoWindow) {
              infoWindow.close();
              newMarker.open = false;
            }
            infoWindow.setContent(`<h5 class="title">${point.title}</h5>`
              + `<img src="${point.image}" class="image" style="max-width:180px;mad-height:100px;">`
              + `<div class="description">${point.description}</div>`
              + `<button type="submit" class="edit">Edit point</button>`
              + `<form class="delete"><button type="submit">Delete point</button></form>`
              + `<div style="display: none" class="point_id">${point.id.toString()}</div>`)
            closeAllInfoWindows()
            infoWindow.open(map, newMarker);
          })
        });
      },
      error: function (error) {
        console.log("error is ", error);
      }
    })
  }
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  loadMarkers()


  searchBox.addListener('places_changed', function () {
    let places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // create new infoWindow
    let infoWindow = new google.maps.InfoWindow();

    // For each place, get the icon, name and location.
    let bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Create a marker for each place.
      if (place.photos) {
        markers.push(new google.maps.Marker({
          map: map,
          // icon: "https://66.media.tumblr.com/tumblr_m7wvguKViU1r17mw1.png",
          title: place.name,
          photo: place.photos[0].getUrl(),
          position: place.geometry.location
        }));
      } else {
        markers.push(new google.maps.Marker({
          map: map,
          // icon: "https://66.media.tumblr.com/tumblr_m7wvguKViU1r17mw1.png",
          position: place.geometry.location
        }));
      }

      function loadInfoWindow(markers) {
        for (let i = 0; i < markers.length; i++) {
          google.maps.event.addListener(markers[i], 'click', function () {
            if (markers[i].title) {
              infoWindow.setContent(`<h5 class="title">${markers[i].title}</h5>`
                + `<img src="${markers[i].photo}" class="image" style="max-width:180px;max-height:100px;">`
                + '<form action="/maps" method="post" class="setPoint">Description:<br><input type="text" class="description" name="description" style=width:95%;height:40px;text-align:top;><br>'
                + '<button type="submit">Add point</button></form>'
                + `<div class="lat" style="display: none">${markers[i].position.lat()}</div>`
                + `<div class="lng" style="display: none">${markers[i].position.lng()}</div>`
                // insert into map_id dummy
                + '<div class="map_id" style="display: none">1</div>')
            } else {
              infoWindow.setContent(
                '<form action="/maps" method="post" class="setPoint">Name:<br><input type="text" name="name" class="name" style=width:95%;height:20px;text-align:top;><br>'
                + '<button class="picture" type="button">Add picture</button>'
                + 'Description:<br><input type="text" name="description" class="description" style=width:95%;height:40px;text-align:top;><br>'
                + '<button type="submit">Add point</button></form>'
                + `<div class="lat" style="display: none">${markers[i].position.lat()}</div>`
                + `<div class="lng" style="display: none">${markers[i].position.lng()}</div>`
                // insert into map_id dummy
                + '<div class="map_id" style="display: none">1</div>')
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