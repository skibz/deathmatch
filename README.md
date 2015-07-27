
# deathmatch

[![Build Status](https://travis-ci.org/skibz/deathmatch.svg)](https://travis-ci.org/skibz/deathmatch)
[![Coverage Status](https://coveralls.io/repos/skibz/deathmatch/badge.svg?branch=develop&service=github)](https://coveralls.io/github/skibz/deathmatch?branch=develop)
[![Dependency Status](https://david-dm.org/skibz/deathmatch.svg)](https://david-dm.org/skibz/deathmatch)


server and client code for [deathmat.ch](http://deathmat.ch/)

##### configuration

+ `VIEW_ENGINE`: jade, ejs, etc...
+ `VIEWS`: template directory
+ `STATIC`: public document root
+ `FAVICON`: absolute path to `favicon.ico`
+ `SESSION_SECRET`: session store key
+ `DB_COMPACTION_INTERVAL`: `nedb` optimisation interval (milliseconds)
+ `USERS_STORE`: absolute path to users datafile
+ `LOBBIES_STORE`: absolute path to lobbies datafile
+ `DELETED_STORE`: absolute path to deleted datafile
+ `DUELS_STORE`: absolute path to duels datafile
+ `HOST`: http server host address
+ `PORT`: http server port
+ `STEAM_API_KEY`: steam api key
+ `STEAM_REDIRECT_URI`: steam oauth callback address
+ `TWITCH_CLIENT_ID`: twitch api client id
+ `TWITCH_CLIENT_SECRET`: twitch api secret
+ `TWITCH_REDIRECT_URI`: twitch oauth callback address
