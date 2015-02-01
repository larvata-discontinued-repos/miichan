// Generated by CoffeeScript 1.6.3
var apiAvatar, apiScheduleList, apiScheduleRoom, apiSnap, clearRoomNotification, getBase64Image, getRooms, getSchedules, lastSchedules, rooms, roomsStatus, scheduleChanged, schedules, setBadge, showRoomNotification, showScheduleNotification;

schedules = [];

scheduleChanged = false;

lastSchedules = [];

rooms = [];

roomsStatus = {};

apiScheduleList = "http://douyu.sashi-con.info/api/list";

apiScheduleRoom = "http://douyu.sashi-con.info/api/room";

apiSnap = "http://douyu.sashi-con.info/snap";

apiAvatar = "http://douyu.sashi-con.info/avatar/";

getBase64Image = function(img) {
  var canvas, ctx;
  canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpg");
};

setBadge = function(text) {
  return chrome.browserAction.setBadgeText({
    text: text
  });
};

showScheduleNotification = function() {
  var items, options;
  items = schedules.map(function(s) {
    var start;
    start = s.end.split('～')[0];
    return {
      title: "" + s.begin + " " + start,
      message: s.description
    };
  });
  options = {
    type: "list",
    iconUrl: 'images/icon89.png',
    title: 'douyu schedule updated',
    message: 'happy happy harurupi~',
    items: items
  };
  return chrome.notifications.create("6666", options, function(notificationId) {});
};

showRoomNotification = function(room) {
  var img;
  img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = room.room_src.replace("http://staticlive.douyutv.com/upload/web_pic", apiSnap);
  return img.onload = function(data) {
    var imgAvatar, imgData;
    imgData = getBase64Image(img);
    imgAvatar = new Image();
    imgAvatar.crossOrigin = 'anonymous';
    imgAvatar.src = apiAvatar + room.owner_uid;
    return imgAvatar.onload = function(data) {
      var avatarData, d, formattedTime, message, options;
      avatarData = getBase64Image(imgAvatar);
      d = new Date(room.show_time * 1000);
      formattedTime = "" + (d.getFullYear()) + "/" + (d.getMonth() + 1) + "/" + (d.getDay() + 1) + " " + (d.getHours()) + ":" + (('0' + d.getMinutes()).substr(d.getMinutes().toString().length - 1)) + ":" + (('0' + d.getSeconds()).substr(d.getSeconds().toString().length - 1));
      message = "于 " + formattedTime + " 开播";
      message += "\t" + room.show_details;
      options = {
        type: "image",
        iconUrl: avatarData,
        title: "" + room.room_name,
        imageUrl: imgData,
        message: message
      };
      return chrome.notifications.create(room.room_id.toString(), options, function(notificationId) {});
    };
  };
};

clearRoomNotification = function(room) {
  return chrome.notifications.clear(room.room_id.toString(), function() {});
};

getSchedules = function() {
  var request;
  request = new XMLHttpRequest();
  request.open("GET", apiScheduleList, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      schedules = JSON.parse(request.responseText);
      if (JSON.stringify(schedules) === JSON.stringify(lastSchedules)) {

      } else {
        setBadge('!');
        showScheduleNotification();
      }
      lastSchedules = schedules;
    } else {

    }
  };
  request.onerror = function() {};
  return request.send();
};

getRooms = function() {
  var request;
  request = new XMLHttpRequest();
  request.open("GET", apiScheduleRoom, true);
  request.onload = function() {
    var r, _i, _len;
    if (request.status >= 200 && request.status < 400) {
      rooms = JSON.parse(request.responseText);
      for (_i = 0, _len = rooms.length; _i < _len; _i++) {
        r = rooms[_i];
        if (roomsStatus[r.room_id] === r.show_status) {

        } else if (r.show_status === 1) {
          showRoomNotification(r);
        } else if (r.show_status === 2) {
          clearRoomNotification(r);
        }
        roomsStatus[r.room_id] = r.show_status;
      }
    }
  };
  request.onerror = function() {};
  return request.send();
};

(function() {
  console.log("background loaded");
  getSchedules();
  getRooms();
  setInterval(getSchedules, 120000);
  return setInterval(getRooms, 120000);
})();
