
- [x] clientside progress bar

- [ ] chat features
  + [ ] nickname tab-completion
  + [ ] audio on mentions, direct messages and moderation events
  + [ ] audio on lobby status changes

- [ ] moderation
  + [ ] user chat muting
  + [ ] user chat blinding
  + [ ] user lobby banning

- [ ] desktop notifications
  + [ ] `"permissions":{"desktop-notification":{}}` add to manifest
    * [ ] create an app-manifest
  + [ ] direct message
  + [ ] mentions
  + [ ] muted
  + [ ] blinded
  + [ ] banned
  + [ ] lobby announcements

- [ ] clan features
  + [ ] team listing page
  + [ ] team configuration page
    * [ ] edit clan tag (show clan tags in chat?)
    * [ ] add a team member
    * [ ] remove a team member
    * [ ] associate a steam group
    * [ ] change leader(s)/admin(s)
  + [ ] challenge another team
  + [ ] results of matches

- [ ] process management
  + [ ] create user and group
    * [ ] user: `deathmatch`
    * [ ] group: `deathmatch`
    * [ ] `chroot`, `setgid`, `setuid`
  + [x] upstart script
  + [x] process logging (`/log/thedate`)
    * [x] stderr logging to file
    * [x] stdout logging to file

- [ ] fix websocket server typeerror when looking up properties of non-existent client objects
  + [ ] client and server need to handshake with `identify` and acknowledgement after client socket reconnects to server
    * [ ] have to trigger refresh of client list on client after acknowledgement

- [ ] security audit
  + [ ] ensure no one use can use xss to grab `data-deathmatch` and spoof as an admin
  + [ ] change the clientside chat to only activate once a client has sent `identify` and the websocket server has acknowledged the event.

- [ ] set up webhooks on droplet for deploys
  + [ ] move to develop branch and deploy on pushes to master

- [x] get a database
  + [x] document-oriented or sql?
    * [x] gonna try out `louischatriot/nedb`.

- [x] add a web server configuration script to be run at bootstrap
  + [x] export a different socket binding based on execution environment (ie dev, prod)

- [ ] create a private backend for system configuration
  + [ ] figure out how to secure the backend
    * [ ] fail2ban nginx http basic auth filter
  + [ ] user configuration for adding/removing privileges and roles
  + [ ] map listings
  + [ ] server listings
  + [ ] log file inspection and download (gzipped)
  + [ ] platform statistics
    * [ ] total lobbies
    * [ ] total players
    * [ ] total duels
    * [ ] average duels per day
    * [ ] average lobbies per day

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
  + [ ] !rcon

- [ ] public command: duel challenge (mge, bball, etc)
  + [ ] rules of challenging?
    * [ ] document the results?
      - [ ] duel ratings (elo, psr, wtf)
        + [ ] we're going to call it `wtf rating`
        + [ ] each user starts with 1000 `wtf`s
        + [ ] it'll be possible to go into negative `wtf`s
        + [ ] any player may challenge any other player
        + [ ] the challenger gets to decide on the map
        + [ ] the challenged player decides how many `wtf`s are at stake (the stake applies to both players)
        + [ ] winner takes all staked `wtf`s
        + [ ] it will be possible to stake nothing on a duel
        + [ ] both players have to report the same outcome for the winner to be credited and the loser to be debited.
        + [ ] if different outcomes are reported, both players are debited
        + [ ] if no report is given after a configured period, the duel is removed from records and both players are debited the staked `wtf`s (to deter players from challenging each other and not reporting results)
        + [ ] officers will be able to !give `wtf`s (endearingly know as giving a fuck?)

- [x] frontend user authentication
  - [x] twitch.tv strategy
  - [x] steam strategy
    + [x] not going to bother with traditional signup flow (ie. email)
      * [x] if i do, it's going to be invitation based

- [x] authenticated users need to be stored in a database
  + [x] design a user schema normalised for differences between data available from steam and twitch profiles
    * [ ] figure out how to allow a user to log in with a separate account without creating a new user record - until then, we'll only use steam auth strategy
