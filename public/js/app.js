
'use strict';

/**
 *
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
  for (var i in clients) addClient(
    clients[i], one('#client-list')
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
  socket.emit('chat message', message);
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
  var option = one('#' + who.socket);
  option.remove();
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

/**
 * wrap up the message string from textarea into an object
 * keyed by `sender` and `body`. immediately append the message
 * string to the message log and only then emit a socket event
 * containing the message object to be relayed (via websocket server)
 * to other connected clients.
 *
 * @param  {CustomEvent} e preventable, propagation stoppable
 * @return {Function}
 */
function messageFormSubmit(e) {
  e.preventDefault();
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

one('#message-form').onsubmit = messageFormSubmit;

socket.on('client list', clientList);
socket.on('chat message', appendMessage);
socket.on('someone joined', function(who) {
  addClient(who, one('#client-list'), announceJoined);
});
socket.on('someone left', function(who) {
  removeClient(who, announceLeft);
});

socket.emit(
  'identify',
  user.getAttribute('data-steam'),
  user.getAttribute('data-twitch'),
  user.getAttribute('data-displayname'),
  user.getAttribute('data-deathmatch')
);
