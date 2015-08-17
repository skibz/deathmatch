
##### at least these things

- [ ] add an error route to express app
- [x] add dist glue for js, css and images
  + [ ] change hrefs in views
- [x] logo and favicon
- [x] clientside progress bar
- [x] desktop notifications
  + [x] lobby announcements
  + [ ] chat mentions/events?
- [ ] server
  + [ ] disable other droplet and resize this one to $10
  + [x] as upstart service
  + [ ] with least privilege
  + [ ] and `chroot` jailed
  + [x] stderr logging to file
  + [x] stdout logging to file
  + [ ] [push to deploy](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps) from ci environment
- [x] user auth
  + [x] twitch
  + [x] steam
    * [x] not going to bother with email registration. if i do, it'll be invitation based.
- [ ] some kind of an about and/or settings page
  + [ ] make it a `?` button near the username area
    * [ ] change the link from the by-line
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
