
##### at least these things

- [ ] logo and favicon
- [x] clientside progress bar
- [x] desktop notifications
  + [x] lobby announcements
  + [ ] chat mentions/events?
- [ ] server
  + [x] as upstart service
  + [ ] with least privilege
  + [x] stderr logging to file
  + [x] stdout logging to file
  + [ ] deploy from ci
- [x] user auth
  + [x] twitch
  + [x] steam
    * [x] not going to bother with email registration. if i do, it'll be invitation based.
- [ ] some kind of an about and/or settings page
  + [ ] documentation
  + [ ] links
  + [ ] desktop notification permission request
  + [ ] anything else?

##### nice to have

- [ ] nickname tab-completion
- [ ] use websocket "rooms" to facilitate direct or scoped messages
- [ ] moderation
  + [ ] punish/ban?
  + [ ] really necessary?
- [ ] audit for xss
- [ ] admin rcon interface from chat frontend (depends on xss audit)
