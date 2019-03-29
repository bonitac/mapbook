$(() => {
  $.ajax({
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/place/details/output?parameters"
  }).done((result)=> console.log(result))
    // method: "GET",
    // url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  })
// });





function loginToggle(){
  $('.login-form').slideToggle('fast');
  $('#exampleInputEmail1').focus();
}
