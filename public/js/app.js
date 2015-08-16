
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

/**
 * filters any dangerous characters
 * @param  {String} string
 * @return {String}        html-entitied string
 */
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

/**
 * append a message to the chat stream
 * @param  {Object}   message keyed by `sender` and `body`
 * @param  {Function} next    to be executed after function is complete
 * @return {Function}
 */
function appendMessage(message, next) {
  var div = document.createElement('div');
  div.textContent = message.sender + ': ' + message.body;
  one('main').appendChild(div);
  if (typeof next === 'function') return next(message);
}

/**
 * append a message to the chat stream indicating
 * that a client has joined the chat room
 * @param  {Object}   who
 * @param  {Function} next to be executed after the function is complete
 * @return {Function}
 */
function announceJoined(who, next) {
  var div = document.createElement('div');
  div.textContent = who.displayname + ' connected';
  one('main').appendChild(div);
  if (typeof next === 'function') return next();
}

/**
 * append a message to the chat stream indicating
 * that a client has left the chat room
 * @param  {Object}   who
 * @param  {Function} next to be executed after function is complete
 * @return {Function}
 */
function announceLeft(who, next) {
  var div = document.createElement('div');
  div.textContent = who.displayname + ' disconnected';
  one('main').appendChild(div);
  if (typeof next === 'function') return next();
}

/**
 * construct a connected clients list from an array
 * of client objects
 * @param  {Array}   clients
 * @param  {Function} next    to be executed after function is complete
 * @return {Function}
 */
function clientList(clients, next) {
  for (var client in clients) addClient(
    clients[client], one('#client-list')
  );
  if (typeof next === 'function') return next();
}

/**
 * emits a chat message event (to the websocket server)
 * containing a message object keyed by `sender` and `body`
 * which is relayed to other connected clients.
 *
 * @param  {Object}   message
 * @param  {Function} next    to be executed after function is complete
 * @return {Function}
 */
function emitMessage(message, next) {
  socket.emit('chat#message', message);
  if (typeof next === 'function') return next();
}

/**
 * add a given option to the connected clients list
 * @param {Object}   who  client object (socket, displayname, steam, twitch)
 * @param {HTMLInputElement.select}   to   options are added to this element
 * @param {Function} next   to be executed after function is complete
 */
function addClient(who, to, next) {
  var select = to || one('#client-list');
  var option = document.createElement('option');
  option.id = who.socket;
  option.textContent = who.displayname;
  option.setAttribute('data-steam', who.steam);
  option.setAttribute('data-twitch', who.twitch);
  option.setAttribute('data-socket', who.socket);
  select.appendChild(option);
  if (typeof next === 'function') return next(who);
}

/**
 * remove a given option from the connected clients list
 * @param  {Object}   who  client object (socket, displayname, steam, twitch)
 * @param  {Function} next to be executed after function is complete
 * @return {Function}
 */
function removeClient(who, next) {
  all('#' + (who.socket || 'id_' + who.id)).forEach(function(o) {
    o.remove();
  });
  if (typeof next === 'function') return next(who);
}

/**
 * resets the message submission form
 * @param  {Function} next executed after function is complete
 * @return {Function}
 */
function resetForm(next) {
  one('#message-form').reset();
  if (typeof next === 'function') return next();
}

var socket = io();
var user = one('#user');
var permission; // notifications

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
