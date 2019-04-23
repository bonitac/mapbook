
$(document).ready( () => {

  function GetTodayDate() {
     var tdate = new Date();
     var dd = tdate.getDate(); //yields day
     var MM = tdate.getMonth(); //yields month
     var yyyy = tdate.getFullYear(); //yields year
     var currentDate= yyyy + "-" +( MM+1) + "-" + dd;
     return currentDate;
  }

  function getRandomInt(max) {
    let num = Math.floor(Math.random() * Math.floor(max)) + 1;
    let mapIcon = "/icon/Map0" + num.toString() + ".png";
    return mapIcon;
  }

  // $('#new_map_btn').click(function(event) {
  //   event.preventDefault();

  // }


  $('#add_map_btn').click(function(event) {

    let curUserName = $('#uid').html();
    if(curUserName === "0"|| curUserName == 0) { // Cannot like contributed map
      alert('Please login first.');
    } else {
      let insertObj = {};
      insertObj.title = $('#new_map_name').val();
      insertObj.icon = getRandomInt(9);
      insertObj.description = $('#new_map_description').val();
      insertObj.user_id = $('#uid').html();
      let curDate = GetTodayDate();
      insertObj.date_created = curDate;
      $.ajax({
        method: "PUT",
        url: "/maps/add",
        data: insertObj
        }).done((datas) => {
          let latestID = datas[datas.length - 1].id;
          let url = "/maps/" + latestID.toString();
          //window.location.reload(); // Any Other Function/Way to do this?
          window.location = url;
        });
    }

  });

  $('#login_ok_btn').click(function(event) {
    let name = $('#name_input').val();
    let password = $('#password_input').val();
    let url = "/login/";

    if( (name === "Howard" || name === "Bonita" || name === "Estella") && password === "12345") {
      switch(name) {
        case "Bonita": url += "1"; break;
        case "Estella": url += "2"; break;
        case "Howard": url += "3"; break;
        default: url + "1"; break;
      }
      $('#name_input').val("");
      $('#password_input').val("");
      window.location = url;
    } else {
      alert("Username or password incorrect!");
      // alert("User Name: " + name + " or Password: " + password + " is incorrect!");
    }

  });

  let path = window.location.pathname;
  let mapType = path.split('/')[1];
  let mapID = path.split('/')[2];

  $('#like_btn').click(function(event) {
    let like_sign = $('#like_sign').html();


    let url = "";
    let method = "";
    let insertObj = {};
    let creator = $('#creator').text().split(':')[1].trim();
    let curUserName = $('#user_dropdown').text();
    if(mapType === "contribute" || creator === curUserName) { // Cannot like contributed map
      alert('You created and contributed to this map. You cannot "like" it.');
    } else {
      if(like_sign === '1') { // Already Liked it, can unlike it
        url = "/unlike";  // Remove from DB
        method = "GET";
      } else {  // Not Liked Yet, can like it
        url = "/like";  // Add to DB
        method = "POST";
      }
      insertObj.user_id = $('#uid').html();
      insertObj.map_id = mapID;
      let curDate = GetTodayDate();
      insertObj.date = curDate;
      $.ajax({
      method: method,
      url: url,
      data: insertObj
      }).done((datas) => {
        let url = "/"+ mapType +"/" + mapID;
        //window.location.reload(); // Any Other Function/Way to do this?
        window.location = url;
      });
    }

  });

});
