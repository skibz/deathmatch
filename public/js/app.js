
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
  }
}

function escapeHtml(string) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  return String(string).replace(
    /[&<>"'\/]/g,
    function fromEntityMap(s) {
      return entityMap[s];
    }
  );
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
  one('main').appendChild(div);
  one('.main.messages').scrollTop = 99999999;
  if (typeof next === 'function') return next(message);
}

function announceJoined(who, next) {
  var div = document.createElement('div');
  div.textContent = who.displayname + ' connected';
  one('main').appendChild(div);
  if (typeof next === 'function') return next();
}

function announceLeft(who, next) {
  var div = document.createElement('div');
  div.textContent = who.displayname + ' disconnected';
  one('main').appendChild(div);
  if (typeof next === 'function') return next();
}

function clientList(clients, next) {
  for (var client in clients) addClient(
    clients[client], one('#client-list')
  );
  if (typeof next === 'function') return next();
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
  select.appendChild(option);
  if (typeof next === 'function') return next(who);
}

function removeClient(who, next) {
  all('#' + ('socket_' + who.socket || 'id_' + who.id)).forEach(function(o) {
    o.remove();
  });
  if (typeof next === 'function') return next(who);
}

function resetForm(next) {
  one('#message-input').value = '';
  if (typeof next === 'function') return next();
}

function messageSubmit() {
  var message = {
    sender: one('[data-displayname]').getAttribute('data-displayname'),
    body: one('#message-input').value
  };
  return message.body.length ? appendMessage(
    message, emitMessage.bind(this, message, resetForm)
  ) : undefined;
}

var socket = io();
var user = one('#user');
var permission;

socket.on('client#identity', function() {

  if ('Notification' in window) {
    Notification.requestPermission(function(permission) {
      if (permission === 'granted') {
        permission = true;
      }
    });
  } else {
    alert(
      'Hey, I\'m afraid you won\'t be able to use this ' +
      'site until you update your browser to something more modern.'
    );
    window.location = 'https://google.com/chrome';
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

socket.on('lobby#rem', removeClient);

socket.on('lobby#add', function(who) {
  var option = document.createElement('option');
  option.id = 'id_' + who.id;
  option.textContent = who.displayname;
  one('#lobby-players').appendChild(option);
});

socket.on('lobby#started', function(details) {

  [].slice.call(
    one('#lobby-players').childNodes
  ).forEach(function(child) {
    child.remove();
  });

  one('main').innerHTML += '<div>[deathmat.ch]: Pickup has begun - Click <a href="' +
    details.connect + '">here</a> to join!</div>';

  if (!permission) return;

  var notification = new Notification(
    'Pickup has begun!', {body: 'Click this message to join'}
  );

  notification.onclick = function(e) {
    window.open(details.connect);
  };
});

socket.on('lobby#postponed', function() {
  console.log('lobby postponed');
});

one('#lobby-add').onclick = throttle(
  socket.emit.bind(socket, 'lobby#player-add'), 2000
);

one('#lobby-rem').onclick = throttle(
  socket.emit.bind(socket, 'lobby#player-rem'), 2000
);

one('#message-input').onkeyup = function(e) {
  if (e.keyCode !== 13) return;
  else e.preventDefault();
  return messageSubmit();
};

one('#message-send').onsubmit = function(e) {
  return messageSubmit();
};

one('#about').onclick = function(e) {
  one('.lobby-controls').style.display = 'none';
  one('main').style.display = 'none';
  one('#message-form').style.display = 'none';
  one('#about-container').classList.remove('hidden');
};

one('#back-to-chat').onclick = function(e) {
  one('#about-container').classList.add('hidden');
  one('.lobby-controls').style.display = '';
  one('main').style.display = '';
  one('#message-form').style.display = '';
};
