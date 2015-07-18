
- [ ] create some kind of a database
  + [ ] in memory?
  + [ ] in node process?
  + [ ] document-oriented or sql?
    * [ ] right now, document-oriented is looking the best. `nedb` could be a winner.

- [ ] add a web server configuration script to be run at bootstrap
  - [ ] list all `*.env` files and export their contents as environment variables named with their respective file names
  - [ ] export a different socket binding based on execution environment (ie dev, prod)

- [ ] create a private backend for system configuration
  + [ ] figure out how to secure the backend
  + [ ] user configuration for adding/removing privileges
  + [ ] map list configuration
  + [ ] server list configuration

- [ ] admin's player lists need to update in real time (use websocket events for players (dis)connecting)

- [ ] public command: challenge another player to a duel

- [x] frontend user authentication
  - [x] twitch.tv strategy
  - [x] steam strategy
