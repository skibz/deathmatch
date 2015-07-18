
- [ ] create some kind of a database
  + [x] document-oriented or sql?
    * [x] right now, document-oriented is looking the best. `nedb` could be a winner.

- [x] add a web server configuration script to be run at bootstrap
  - [x] export a different socket binding based on execution environment (ie dev, prod)

- [ ] create a private backend for system configuration
  + [ ] figure out how to secure the backend
  + [ ] user configuration for adding/removing privileges
  + [ ] map list configuration
  + [ ] server list configuration

- [ ] admin's player lists need to update in real time (use websocket events for players (dis)connecting)

- [ ] port bot commands from tfbot
  + [ ] !add
  + [ ] !rem
  + [ ] !map
  + [ ] !previous
  + [ ] !status
  + [ ] !top
  + [ ] !server

- [ ] public command: challenge another player to a duel

- [x] frontend user authentication
  - [x] twitch.tv strategy
  - [x] steam strategy

- [ ] authenticated users need to be stored in a database
  + [ ] design a user schema normalised for differences between steam and twitch profiles
