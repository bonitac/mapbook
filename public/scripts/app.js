// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "https://maps.googleapis.com/maps/api/place/details/output?parameters"
//   }).done((result)=> console.log(result))
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   })
// });

$(document).ready(function () {

$( "#map" ).on( "submit", ".setPoint", function(event) {
    event.preventDefault();
    let point = {}
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
    point.map_id = $( ".map_id").html();
  //Make an AJAX call to the server for data posting
    $.ajax({
      method:'post',
      url:'/maps',
      data : point,
      dataType: 'json',
      success:function(result){
        console.log("Posting was successful");
        console.log(result);
        initAutocomplete()
      },
      error: function(err){
        console.log("There was an error posting", err)
      }
    })
  });

// delete a point from the db
  $( "#map" ).on( "submit", ".delete", function(event) {
    event.preventDefault();
    let point_id = $( ".point_id").html()
  //Make an AJAX call to the server for deleting point
    $.ajax({
      method:'get',
      url:'/maps/deletePoint',
      data: point_id,
      dataType: "string",
      success:function(result){
        console.log("Deleting was successful");
        console.log(result);
        initAutocomplete();
      },
      error: function(err){
        initAutocomplete();
        //console.log("There was an error deleting", err)
      }
    })
  });

}); //Document.ready function ends here.

