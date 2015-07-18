
- [ ] set up webhooks on droplet for deploys
  + [ ] move to develop branch and deploy on pushes to master

- [ ] get a database
  + [x] document-oriented or sql?
    * [x] gonna try out `louischatriot/nedb`.

- [x] add a web server configuration script to be run at bootstrap
  + [x] export a different socket binding based on execution environment (ie dev, prod)

- [ ] create a private backend for system configuration
  + [ ] figure out how to secure the backend
  + [ ] user configuration for adding/removing privileges and roles
  + [ ] map listings
  + [ ] server listings

- [ ] admin's player/server/etc lists need to update in real time
  + [ ] use websocket events for state management

- [ ] wrap up irc bot commands from tfbot
  + [ ] !add
  + [ ] !rem
  + [ ] !map
  + [ ] !previous
  + [ ] !status
  + [ ] !top
  + [ ] !server

- [ ] public command: duel challenge (mge, bball, etc)
  + [ ] rules of challenging?
    * [ ] document the results?
      - [ ] duel ratings (elo, psr, wtf)

- [x] frontend user authentication
  - [x] twitch.tv strategy
  - [x] steam strategy
    + [x] not going to bother with traditional signup flow (ie. email)
      * [x] if i do, it's going to be invitation based

- [ ] authenticated users need to be stored in a database
  + [ ] design a user schema normalised for differences between data available from steam and twitch profiles
