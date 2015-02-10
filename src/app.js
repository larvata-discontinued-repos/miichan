// Generated by CoffeeScript 1.6.3
var newTab, renderRoom, renderSchedule;

window.onload = function() {
  renderSchedule();
  return renderRoom();
};

newTab = function(room_id) {
  var url;
  url = "http://www.douyutv.com/" + room_id;
  return chrome.tabs.create({
    url: url
  });
};

renderSchedule = function() {
  var s, scheduleHtml, schedules, _i, _len;
  schedules = chrome.extension.getBackgroundPage().schedules;
  scheduleHtml = '';
  for (_i = 0, _len = schedules.length; _i < _len; _i++) {
    s = schedules[_i];
    scheduleHtml += "<div class='schedule'>";
    scheduleHtml += "<div>";
    scheduleHtml += "<span class='time'>" + s.end + "</span><span class='channel'>" + s.begin + "</span>";
    scheduleHtml += "</div>";
    scheduleHtml += "<div>";
    scheduleHtml += "<span class='programm'>" + s.description + "</span>";
    scheduleHtml += "</div>";
    scheduleHtml += "</div>";
  }
  document.getElementById('scheduleList').innerHTML = scheduleHtml;
  return chrome.extension.getBackgroundPage().setBadge('');
};

renderRoom = function() {
  var b, btns, r, roomHtml, rooms, _i, _j, _len, _len1, _results;
  rooms = chrome.extension.getBackgroundPage().rooms;
  roomHtml = '';
  for (_i = 0, _len = rooms.length; _i < _len; _i++) {
    r = rooms[_i];
    roomHtml += "<li class='layout-item-module layout-item-module-base'>";
    roomHtml += "<button title='关注人数:" + r.fans + "' class='open-tab-button pure-button " + (r.show_status === 2 ? '' : 'button-success') + "' data-room-id='" + r.room_id + "'>" + r.room_name + "</button>";
    roomHtml += "</li>";
  }
  document.getElementById('roomList').innerHTML = roomHtml;
  btns = document.getElementsByClassName('open-tab-button');
  _results = [];
  for (_j = 0, _len1 = btns.length; _j < _len1; _j++) {
    b = btns[_j];
    _results.push(b.addEventListener('click', function() {
      var url;
      url = "http://www.douyutv.com/" + this.attributes['data-room-id'].value;
      return chrome.tabs.create({
        url: url
      });
    }));
  }
  return _results;
};
