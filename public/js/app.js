
'use strict';

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

function appendMessage(message, done) {
  var div = document.createElement('div');
  div.textContent = message.sender + ': ' + escapeHtml(message.body);
  one('main').appendChild(div);
  if (typeof done === 'function') return done();
}

function appendNotification(notification, done) {
  var div = document.createElement('div');

  if (notification.joined) {
    div.textContent = escapeHtml(notification.displayName + ' connected');
  } else if (notification.parted) {
    div.textContent = escapeHtml(notification.displayName + ' disconnected');
  } else {
    return;
  }

  one('main').appendChild(div);
  if (typeof done === 'function') return done();
}

function clientList(clients, done) {
  var select = one('#client-list');
  for (var i in clients) {
    var option = document.createElement('option');
    option.value = clients[i].socket;
    option.textContent = clients[i].displayName;
    option.setAttribute('steam', clients[i].steam);
    option.setAttribute('twitch', clients[i].twitch);
    option.setAttribute('socket', clients[i].socket);
    select.appendChild(option);
  }
}

function emitMessage(message, done) {
  socket.emit('chat message', {
    sender: one('[data-displayname]').getAttribute('data-displayname'),
    body: one('#message-input').value
  });
  if (typeof done === 'function') return done();
}

function resetForm(done) {
  one('#message-form').reset();
}

var socket = io();
var user = one('#user');

one('#message-form').onsubmit = function(e) {
  e.preventDefault();
  var message = {
    sender: one('[data-displayname]').getAttribute('data-displayname'),
    body: one('#message-input').value
  };
  return message.body.length ? appendMessage(
    message, emitMessage.bind(this, message, resetForm)
  ) : undefined;
};

socket.on('client list', clientList);
socket.on('chat message', appendMessage);
socket.on('someone joined', function(who) {
  appendNotification(who, function() {
    var select = one('#client-list');
    var option = document.createElement('option');
    option.value = who.socket;
    option.textContent = who.displayName;
    option.setAttribute('steamid', who.steam);
    option.setAttribute('twitch', who.twitch);
    option.setAttribute('socketid', who.socket);
    select.appendChild(option);
  });
});
socket.on('someone left', function(who) {
  appendNotification(who, function() {
    var option = one('option[value="' + who.socket + '"]');
    option.remove();
  });
});
socket.emit(
  'identify',
  user.getAttribute('data-steam'),
  user.getAttribute('data-twitch'),
  user.getAttribute('data-displayname'),
  user.getAttribute('data-deathmatch')
);
