server {

  listen 80 default_server;
  listen [::]:80 default_server

  server_name deathmat.ch www.deathmat.ch;
  root /var/www/deathmat.ch/public;

  location / {
    try_files $uri @nodejs;
  }

  location @nodejs {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
