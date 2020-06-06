# On Remote Server

```
sudo apt update
sudo apt install -y nodejs npm
sudo npm install -g parcel-bundler
```

Create the nginx configuration file (`/etc/nginx/sites-available/wowpay2win.com`):

```
#-------------------------------------------------------------------------------
# wowpay2win.com
#-------------------------------------------------------------------------------

server {
    listen 80;
    server_name wowpay2win.com www.wowpay2win.com;

    include /etc/nginx/snippets/letsencrypt.conf;

    location / {
        return 301 https://www.wowpay2win.com$request_uri;
    }
}

server {
    listen 443;
    server_name wowpay2win.com;

#    ssl_certificate /etc/letsencrypt/live/wowpay2win.com/fullchain.pem;
#    ssl_certificate_key /etc/letsencrypt/live/wowpay2win.com/privkey.pem;
#    ssl_trusted_certificate /etc/letsencrypt/live/wowpay2win.com/fullchain.pem;
#    include /etc/nginx/snippets/ssl.conf;

    location / {
        return 301 https://www.wowpay2win.com$request_uri;
    }
}

server {
    listen      443;
    server_name www.wowpay2win.com;
    autoindex   off;

#    ssl_certificate /etc/letsencrypt/live/wowpay2win.com/fullchain.pem;
#    ssl_certificate_key /etc/letsencrypt/live/wowpay2win.com/privkey.pem;
#    ssl_trusted_certificate /etc/letsencrypt/live/wowpay2win.com/fullchain.pem;
#    include /etc/nginx/snippets/ssl.conf;

    location / {
        root /var/www/wowpay2win.com/;
    }
}
```

The SSL options are initially commented out because those files do not exist yet. This will allow us to start nginx for the initial authentication without getting `FileDoesNotExist` errors.

Next symlink the config file to `sites-enabled`:
```
sudo ln -s /etc/nginx/sites-available/wowpay2win.com /etc/nginx/sites-enabled/
```

Create the common nginx file (`/etc/nginx/snippets/ssl.conf`):
```
ssl on;

# certs sent to the client in SERVER HELLO are concatenated in ssl_certificate
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;

# modern configuration. tweak to your needs.
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_ciphers AES256+EECDH:AES256+EDH:!aNULL;
ssl_prefer_server_ciphers on;

# HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
add_header Strict-Transport-Security max-age=15768000;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;

# OCSP Stapling ---
# fetch OCSP records from URL in ssl_certificate and cache them
ssl_stapling on;
ssl_stapling_verify on;
```

Create the common nginx file (`/etc/nginx/snippets/letsencrypt.conf`):
```
location ^~ /.well-known/acme-challenge/ {
    default_type "text/plain";
    root /var/www/letsencrypt;
}
```

Now we can restart nginx (`sudo systemctl restart nginx`) to host the non-SSL version for Let's Encrypt authentication challenge.
```
sudo certbot certonly --webroot -d wowpay2win.com -d www.wowpay2win.com --webroot-path /var/www/letsencrypt
```

If we are behind Cloudflare, we need to create a Page Rule to ensure the authentication challenge is not being automatically redirected to https:
```
*wowpay2win.com/.well-known/acme-challenge/*
SSL: Off
```

After this, go back to `/etc/nginx/sites-available/wowpay2win.com` and uncomment the SSL options.

Next we need to add this line to `/etc/letsencrypt/cli.ini` to ensure nginx restarts whenever the auto renew script runs (automatically generated in `/etc/cron.d/certbot`).
```
deploy-hook = systemctl reload nginx
```

Finally, we can test auto renew with `certbot renew --dry-run`.

# Cron

Run `crontab -e` and add this line:
```
30 * * * * python3 /var/www/wowpay2win.com/auctions.py
```

# Deploy
```
./auctions.py
npm run clean
npm run build
```
