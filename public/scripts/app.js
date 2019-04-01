$(document).ready(function () {

  let path = window.location.pathname;
  // console.log("path = ", path);
  // console.log("type = ", path.split('/')[1]);
  // console.log("id = ", path.split('/')[2]);
  initAutocomplete(); // instead of "&callback=initAutocomplete"
  loadMarkers(path.split('/')[1], path.split('/')[2]);


  // Add point submit button clicked
  $( "#map" ).on( "submit", ".setPoint", function(event) {
    event.preventDefault();
    let point = {};
    if ($( ".name" ).val() === undefined){
      point.title = $( ".title" ).html();
    } else {
      point.title = $( ".name" ).val();
    }
    point.date_created = new Date().toISOString();
    point.description = $( ".description" ).val();
    point.image = $( ".image" ).attr('src');
    point.lat = $( ".lat").html();
    point.lng = $( ".lng").html();
    point.map_id = path.split('/')[2];
    // Make an AJAX call to the server for data posting
    $.ajax({
      method:'post',
      url:'/maps',
      data : point,
      dataType: 'json',
      success:function(result){
        location.reload();
      },
      error: function(err){
        console.log("There was an error posting", err);
      }
    })
  });

// delete a point from the db
  $( "#map" ).on( "submit", ".delete", function(event) {
    event.preventDefault();
    let point_id = $( ".point_id").html()
    console.log("point_id =", point_id);
    //Make an AJAX call to the server for deleting point
    $.ajax({
      method:'get',
      url:'/deletePoint/' + path.split('/')[2],
      data: point_id,
      dataType: "string",
      success:function(result){
        location.reload();
      },
      error: function(err){
        location.reload();
      }
    })
  });

  //slide toggle edit form
  $( "#map" ).on( "click", ".edit", function () {
    $(".editPoint").slideToggle("fast");
  });

  $( "#map" ).on( "submit", ".editPoint", function(event) {
    event.preventDefault();
    let point_id = $( ".point_id").html();
    let point = {};
    point.id = point_id;
    if ($( ".editName" ).val().length){
      point.title = $( ".editName" ).val();
    }
    point.date_created = new Date().toISOString();
    if ($( ".editDescription" ).val().length){
      point.description = $( ".editDescription" ).val();
    }
    if ($( ".editImage" ).val()){
      point.image = $( ".editImage" ).val();
    }
    // Make an AJAX call to the server for deleting point
    $.ajax({
      method:'post',
      url:'/maps/editPoint',
      data: point,
      dataType: "json",
      success:function(result){
        location.reload();
      },
      error: function(err){
        location.reload();
      }
    });
  });


}); //Document.ready function ends here.

