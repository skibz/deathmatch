
'use strict';

function throttle(callback, limit) {
  var wait = false;
  return function() {
    if (wait) return;
    callback();
    wait = true;
    setTimeout(function() {
      wait = false;
    }, limit);
  };
}

function one(selector) {
  return document.querySelector(selector);
}

function all(selector) {
  return [].slice.call(
    document.querySelectorAll(selector)
  );
}

function appendMessage(message, next) {
  var div = document.createElement('div');
  div.textContent = message.sender + ': ' + message.body;
  one('.main').appendChild(div);
  one('.main.messages').scrollTop = Number.MAX_VALUE;
  if (typeof next === 'function') return next(message);
}

function announceJoined(who, next) {
  var div = document.createElement('div');
  div.textContent = who.displayname + ' connected';
  one('.main').appendChild(div);
  one('.main.messages').scrollTop = Number.MAX_VALUE;
  if (typeof next === 'function') return next();
}

function announceLeft(who, next) {
  var div = document.createElement('div');
  div.textContent = who.displayname + ' disconnected';
  one('.main').appendChild(div);
  one('.main.messages').scrollTop = Number.MAX_VALUE;
  if (typeof next === 'function') return next();
}

function clientList(clients, next) {
  var optgroup = one('#client-list');
  for (var client in clients) {
    addClient(clients[client], optgroup);
  }
  if (typeof next === 'function') return next();
}

function lobbyList(clients, next) {
  var optgroup = one('#lobby-players'), option;
  for (var client in clients) {
    option = document.createElement('option');
    option.id = 'id_' + clients[client].id;
    option.textContent = clients[client].displayname;
    optgroup.appendChild(option);
  }
  optgroup.label = 'Playing [' + (all('#lobby-players > option') || []).length + ']';
}

function emitMessage(message, next) {
  socket.emit('chat#message', message);
  if (typeof next === 'function') return next();
}

function addClient(who, to, next) {
  var select = to || one('#client-list');
  var option = document.createElement('option');
  option.id = 'socket_' + who.socket;
  option.textContent = who.displayname;
  option.setAttribute('data-steam', who.steam);
  option.setAttribute('data-twitch', who.twitch);
  option.setAttribute('data-socket', who.socket);
  option.title = who.steam ?
    'Double click to open this user\'s Steam profile' :
    'Double click to open this user\'s Twitch profile';

  option.ondblclick = function(e) {
    var steam = e.target.getAttribute('data-steam');
    if (steam !== 'null') {
      window.location.assign('steam://url/SteamIDPage/' + steam);
    } else {
      window.open(
        'http://www.twitch.tv/' + e.target.textContent + '/profile'
      );
    }
  };

  select.appendChild(option);
  select.label = 'Chatting [' + (all('#client-list > option') || []).length + ']';
  if (typeof next === 'function') return next(who);
}

function removeClient(who, next) {
  if (who.socket) {
    one('#socket_' + who.socket).remove();
    one('#client-list').label = 'Chatting [' +
      all('#client-list > option').length + ']';
  } else {
    one('#id_' + who.id).remove();
    one('#lobby-players').label = 'Playing [' +
      (all('#lobby-players > option') || []).length + ']';
  }
  if (typeof next === 'function') return next(who);
}

function resetForm(next) {
  one('#message-input').value = '';
  if (typeof next === 'function') return next();
}

function messageSubmit(message) {
  return message.body.length ? appendMessage(
    message, emitMessage.bind(this, message, resetForm)
  ) : undefined;
}

var socket = io();
var user = one('#user');
var notifications;

socket.on('client#identity', function() {
  if ('Notification' in window) {
    Notification.requestPermission(function(permission) {
      notifications = permission === 'granted' ? true : false;
    });
  } else {
    if (window.confirm(
      'Your browser is too outdated to use desktop notifications. ' +
      'Please consider updating it to take advantage of this site\'s features. ' +
      'Would you like to be redirected to a download page for Google Chrome?'
    )) {
      window.location.assign('https://google.com/chrome');
    }
  }
  socket.emit('client#identify', {
    steam: user.getAttribute('data-steam'),
    displayname: user.getAttribute('data-displayname'),
    twitch: user.getAttribute('data-twitch')
  });
});

socket.on('client#list', clientList);
socket.on('chat#message', appendMessage);
socket.on('chat#joined', function(who) {
  addClient(who, one('#client-list'), announceJoined);
});

socket.on('chat#left', function(who) {
  removeClient(who, announceLeft);
});

socket.on('lobby#players', lobbyList);
socket.on('lobby#rem', removeClient);
socket.on('lobby#add', function(who) {
  var optgroup = one('#lobby-players');
  var option = document.createElement('option');
  option.id = 'id_' + who.id;
  option.textContent = who.displayname;
  optgroup.appendChild(option);
  optgroup.label = 'Playing [' + (all('#lobby-players > option') || []).length + ']';
});

socket.on('lobby#started', function(details) {
  all(
    '#lobby-players > option'
  ).forEach(function(option) {
    option.remove();
  });
  one('#lobby-players').label = 'Playing [0]';
  one('main').innerHTML += '<div>[deathmat.ch]: Pickup has begun - Click <a href="' +
    details.connect + '">here</a> to join!</div>';
  if (!notifications) return;
  var notification = new Notification('Pickup has begun!', {
    body: 'Click here to join'
  });
  notification.onclick = function(e) {
    window.location.assign(details.connect);
  };
});

socket.on('lobby#postponed', function() {
  one('main').innerHTML += '<div>[deathmat.ch]: There aren\'t enough players to begin. The one minute' +
    ' countdown will begin again when there are twelve players.</div>';
});

one('#lobby-add').onclick = throttle(
  socket.emit.bind(socket, 'lobby#player-add'), 100
);

one('#lobby-rem').onclick = throttle(
  socket.emit.bind(socket, 'lobby#player-rem'), 100
);

one('#message-input').onkeydown = function(e) {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
    e.stopPropagation();
    var message = {
      sender: one('[data-displayname]').getAttribute('data-displayname'),
      body: one('#message-input').value
    };
    messageSubmit(message);
  } else if (e.keyCode === 9) {
    e.preventDefault();
    e.stopPropagation();
    one('#message-input').value += '\t';
  } else {
    return;
  }
};

one('#message-send').onclick = throttle(function() {
  var message = {
    sender: one('[data-displayname]').getAttribute('data-displayname'),
    body: one('#message-input').value
  };
  return messageSubmit(message);
}, 1000);

one('#about').onclick = function(e) {
  one('.lobby-controls').style.display = 'none';
  one('.main').style.display = 'none';
  one('#message-form').style.display = 'none';
  one('#about-container').classList.remove('hidden');
};

one('#back-to-chat').onclick = function(e) {
  one('#about-container').classList.add('hidden');
  one('.lobby-controls').style.display = '';
  one('.main').style.display = '';
  one('#message-form').style.display = '';
};
