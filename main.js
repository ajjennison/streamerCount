//TO:DO - Prevent duplicate streamer names from being added to database
//To:DO - Refactor Jquery DOM Manipulation into seperate functions

var url = "https://wind-bow.gomix.me/twitch-api/";
var streamers = localStorage.getItem("streamers").split(',');
var followers = 0;
var num = 0;

//initalize event listeners
$(".streamer-count").html(streamers.length + " Total Streamers");
$(".follower-count").html(addCommasToNumber(localStorage.getItem("totalFollowers")) + " Total Followers");
$(".add-streamer").on("click", function(e){
  e.preventDefault();
  addToStorage($("#name-field").val(), "streamers");
  $("#name-field").val("");
});
$(".update-followers").on("click", function() {
  $('.streamer-input').hide();
  $(".follower-count").html("<p>Loading... Total Followers<p>").append('<p><span class="loading-counter">0' + " / " + streamers.length + "</span> Loaded</p>");
  $(".update-confirm").html("");
  $(".update-followers").hide();
  getStreamers();
  });

//retrieve streamer info with controlled request delay
function getStreamers(){
  //fire an ajax request for streamer info every 10 miliseconds
  if(num < streamers.length) {
    getUserData(streamers[num]);
    num++;
    $('.loading-counter').html(num + " / " + streamers.length);
    setTimeout(getStreamers,100);
    //after last ajax call, wait 1 seconds for all data to sum
  } else if (num == streamers.length) {
      getUserData(streamers[num]);
      num++;
      setTimeout(getStreamers,1000);
    //after all calls,
  } else {
      console.log("total:" + followers);
      $(".loading-counter").remove();
      $(".follower-count").html(addCommasToNumber(followers) + " Total Followers");
      $(".update-followers").show();
      $(".streamer-input").show();
      localStorage.setItem("totalFollowers", followers);
      followers = 0;
      num = 0;
    }
}

function getUserData(streamer) {

   $.ajax ({
    url: url + "channels/" + streamer,
    dataType: "jsonp",
    error: function(error, message) {
      console.log(message);
    },
    success: function(userInfo) {
      if(userInfo.followers) {
        sumFollowers(userInfo.followers);
      } else {
        removeStreamer(streamer);
      }
    }
  });
}

function sumFollowers(userFollowers) {
  followers += userFollowers;
}

function addToStorage(streamerName, storageName) {
  var old = localStorage.getItem(storageName);
    if(old === null) old = "";
    localStorage.setItem(storageName, old + "," + streamerName);

    if(storageName == "streamers") {
      streamers = localStorage.getItem("streamers").split(',');
      $(".streamer-count").html(streamers.length + " Total Streamers");
      $(".update-confirm").html(streamerName + " successfully added!")
    }
}

function removeStreamer(streamerName) {
  var streamersList = localStorage.getItem("streamers").split(",");
  streamersList.splice(streamersList.indexOf(streamerName), 1);
  localStorage.setItem("streamers", streamersList);
  addToStorage(streamerName, "removed");
}

function addCommasToNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
