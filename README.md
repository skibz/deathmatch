
# deathmatch

[![Build Status](https://travis-ci.org/skibz/deathmatch.svg)](https://travis-ci.org/skibz/deathmatch)
[![Coverage Status](https://coveralls.io/repos/skibz/deathmatch/badge.svg?branch=master&service=github)](https://coveralls.io/github/skibz/deathmatch?branch=master)
[![Dependency Status](https://david-dm.org/skibz/deathmatch.svg)](https://david-dm.org/skibz/deathmatch)
[![devDependency Status](https://david-dm.org/skibz/deathmatch/dev-status.svg)](https://david-dm.org/skibz/deathmatch#info=devDependencies)

server and client code for [deathmat.ch](http://deathmat.ch/)

##### configuration

+ `VIEW_ENGINE`: jade, ejs, etc...
+ `VIEWS`: template directory
+ `STATIC`: public document root
+ `FAVICON`: absolute path to `favicon.ico`
+ `SESSION_SECRET`: session store key
+ `HOST`: http server host address
+ `PORT`: http server port
+ `STEAM_API_KEY`: steam api key
+ `STEAM_REDIRECT_URI`: steam oauth callback address
+ `TWITCH_CLIENT_ID`: twitch api client id
+ `TWITCH_CLIENT_SECRET`: twitch api secret
+ `TWITCH_REDIRECT_URI`: twitch oauth callback address
+ `ADMINS_JSON`: json object of admin identities
+ `SERVERS_JSON`: json object of server identities
+ `MAPS_JSON`: json object of map identities
+ `DEFAULT_SERVER`: string key corresponding to server identity
+ `DEFAULT_MAP`: string key corresponding to map name in maps list
