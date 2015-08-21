
##### at least these things

- [ ] fix the chat box text styling
  - [ ] it's hard to discern message boundaries
  - [ ] server and people messages look the same
  - [ ] text is too big
  - [ ] font is not monospaced enough
- [ ] add a faq
  + [ ] desktop notification permission request
  * [ ] change the link from the by-line
  - [ ] link to steam group page `steam://url/GroupSteamIDPage/<id>`
  - [ ] `http://logs.tf/json_search?uploader=STEAM_0:0:16807487`, `http://logs.tf/json_search?uploader=STEAM_0:1:15659092`, `http://logs.tf/json/<log_id>`
  - [ ] moderation philosophy, or lack thereof
  - [ ] code location and license
- [ ] add an error route to express app
- [x] shell glue for js, css and images
- [x] logo and favicon
- [x] clientside progress bar
- [x] desktop notifications
  + [x] lobby announcements
- [ ] web server
  - [x] reverse proxied
  + [x] as upstart service
  + [x] with least privilege
  + [ ] and `chroot` jailed
  + [x] logging to file (in /var/log/upstart)
  + [ ] [push to deploy](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps) from ci environment
  + [ ] disable other droplet
- [x] user auth
  + [x] twitch
  + [x] steam
    * [x] not going to bother with email registration. if i do, it'll be invitation based.

##### nice to have

- [ ] a new and more sensible layout
- [ ] refactored frontend javascript
  - [ ] bonus: small components ui library
+ [ ] desktop notification on chat mentions/events?
  + [ ] how do we stop these from being annoying?
    + [ ] only show if user is not focused on window?
      + [ ] will `pagevisibility` even work for this?
- [ ] user disconnect: `<option disabled>`. rejoin: `<option>`
- [ ] hearting users? hearting causes them to be alphabetically sorted at the top of the `chatting` list
- [ ] audit for xss
  - [ ] rcon ui controls (depends on xss audit)

##### super nice to have

- [ ] use websocket "rooms" to facilitate direct or scoped messages
+ [ ] tests for frontend code
- [ ] nickname tab-completion
  - [ ] how would it behave when pressing tab?
    - [ ] would it only work if there's one match?
    - [ ] would it display a tooltip with matches if more than one?
