// The google map
let map;
let input;
let searchBox;
// Initialize the google map
function initAutocomplete() {
  // Instantiate a google map
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 49.2827, lng: -123.1207 },
    zoom: 11,
    mapTypeId: 'roadmap'
  });
  // Create the search box and link it to the UI element.
  let input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
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
          title: place.name,
          photo: place.photos[0].getUrl(),
          position: place.geometry.location
        }));
      } else {
        markers.push(new google.maps.Marker({
          map: map,
          position: place.geometry.location
        }));
      }
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    loadInfoWindow(infoWindow);
  });

  // Waiting for the full google map loaded
  map.addListener('tilesloaded', function () {
    let searchBar = $("#pac-input");
    searchBar.show();
  });
}
// Create a info. windown for each mark during the searh phase
function loadInfoWindow(infoWindow) {
  for (let i = 0; i < markers.length; i++) {
    google.maps.event.addListener(markers[i], 'click', function () {
      if (markers[i].title) {
        infoWindow.setContent(`<h5 class="title">${markers[i].title}</h5>`
          + `<img src="${markers[i].photo}" class="image" style="max-width:180px;max-height:100px;">`
          + '<form action="/maps" method="post" class="setPoint mt-2 mb-2">Description:<br><textarea class="description" type="text" name="description" style="width:95%;height:40px;"></textarea><br>'
          + '<button type="submit">Add point</button></form>'
          + `<div class="lat" style="display: none">${markers[i].position.lat()}</div>`
          + `<div class="lng" style="display: none">${markers[i].position.lng()}</div>`
          // insert into map_id dummy
          + '<div class="map_id" style="display: none">1</div>')
      } else {
        infoWindow.setContent(
          '<form action="/maps" method="post" class="setPoint mt-2 mb-2">Name:<br><input type="text" name="name" class="name" style=width:95%;height:20px;text-align:top;><br>'
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
// Create all Marks
let markers = [];
// Array of infoWindows
let infoWindows = [];
function loadMarkers(type, mapID) {
  let urlString = "/gm/" + type + "/" + mapID;
console.log(urlString);
  $.ajax({
    method: 'get',
    url: urlString,
    dataType: 'json',
    success: function (response) {
      if(response.results.length <= 0) {
        console.log(">>> No Data Return");
      } else {  // if: no results
        response.results.forEach((point) => {
          let infoWindow = new google.maps.InfoWindow();
          infoWindows.push(infoWindow);
          var icon = {
              url: response.mark_icon,
              scaledSize: new google.maps.Size(32, 33), // size
          };
          let newMarker = new google.maps.Marker({
            map: map,
            icon: icon,
            position: { lat: Number(point.lat), lng: Number(point.lng) }
          });
          markers.push(newMarker);
          newMarker.addListener('click', function () {

            let curUserName = $('#uid').html();
            console.log("name", curUserName);
            if(curUserName === "0"|| curUserName == 0) {
              infoWindow.setContent(`<h5 class="title">${point.title}</h5>`
              + `<img src="${point.image}" class="image" style="max-width:180px;mad-height:100px;">`
              + `<div class="description mt-2 mb-2">${point.description}</div>`
              + `<button class="edit mb-2" style="display:none">Edit</button>`
              + `<form action="/maps/editPoint" method="post" class="editPoint "
              style="display:none;
                     padding:7px;
                     margin-top: 10px;
                     margin-bottom: 10px;
                     background-color: #e6faff;
                     border-style:dashed;
                     border-width:1px;
                     border-color:#00ccff;">
                 Name:<br><input type="text" name="name" class="editName" style="width:100%;height:20px;"><br>`
              + 'Image URL:<br><input type="text" style=width:100% class="editImage"><br>'
              + 'Description:<br><input type="text" name="description" class="editDescription" style="width:100%;height:40px;"><br>'
              + '<button type="submit" style="margin-top:7px;">Update</button></form>'
              + `<form class="delete" style="display:none"><button type="submit style="display:none">Delete</button></form>`
              + `<div style="display: none" class="point_id">${point.id.toString()}</div>`);
            } else {

              let creator = $('#creator').text().split(':')[1].trim();
              let curUserName = $('#user_dropdown').text();
              console.log("creator", creator);
              console.log("curUserName", curUserName);
              if(creator === curUserName) {

                infoWindow.setContent(`<h5 class="title">${point.title}</h5>`
                + `<img src="${point.image}" class="image" style="max-width:180px;mad-height:100px;">`
                + `<div class="description mt-2 mb-2">${point.description}</div>`
                + `<button class="edit mb-2">Edit</button>`
                + `<form action="/maps/editPoint" method="post" class="editPoint "
                style="display:none;
                       padding:7px;
                       margin-top: 10px;
                       margin-bottom: 10px;
                       background-color: #e6faff;
                       border-style:dashed;
                       border-width:1px;
                       border-color:#00ccff;">
                   Name:<br><input type="text" name="name" class="editName" style="width:100%;height:20px;"><br>`
                + 'Image URL:<br><input type="text" style=width:100% class="editImage"><br>'
                + 'Description:<br><input type="text" name="description" class="editDescription" style="width:100%;height:40px;"><br>'
                + '<button type="submit" style="margin-top:7px;">Update</button></form>'
                + `<form class="delete"><button type="submit">Delete</button></form>`
                + `<div style="display: none" class="point_id">${point.id.toString()}</div>`);

              } else {
                infoWindow.setContent(`<h5 class="title">${point.title}</h5>`
                + `<img src="${point.image}" class="image" style="max-width:180px;mad-height:100px;">`
                + `<div class="description mt-2 mb-2">${point.description}</div>`
                + `<button class="edit mb-2" style="display:none">Edit</button>`
                + `<form action="/maps/editPoint" method="post" class="editPoint "
                style="display:none;
                       padding:7px;
                       margin-top: 10px;
                       margin-bottom: 10px;
                       background-color: #e6faff;
                       border-style:dashed;
                       border-width:1px;
                       border-color:#00ccff;">
                   Name:<br><input type="text" name="name" class="editName" style="width:100%;height:20px;"><br>`
                + 'Image URL:<br><input type="text" style=width:100% class="editImage"><br>'
                + 'Description:<br><input type="text" name="description" class="editDescription" style="width:100%;height:40px;"><br>'
                + '<button type="submit" style="margin-top:7px;">Update</button></form>'
                + `<form class="delete" style="display:none"><button type="submit style="display:none">Delete</button></form>`
                + `<div style="display: none" class="point_id">${point.id.toString()}</div>`);


              }
            }
            closeAllInfoWindows();
            infoWindow.open(map, newMarker);
          });
        }); // response.results
      } // else: get results
    }, error: function (error) {
      console.log("!------ Error ------!");
      console.log(error);
    }
  }); // ajax get .maps/mapID
} // function loadMarkers()

// Close all infoWindows
function closeAllInfoWindows() {
  for (let i = 0; i < infoWindows.length; i++) {
    infoWindows[i].close();
  }
}