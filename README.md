# WoWPay2Win

At the beginning of the Ny'alotha raid in BfA, having the right corruption on gear drops (also available on BoEs) meant massive DPS increases. The gap was so big that it was nearly impossible to compete against players with BiS. As a result, many competitive players transferred to other realms and back just to buy their BiS for millions of gold.

Nowadays, this tool simply scans for BoEs in every auction house across the region.

## Architecture

This app consists of two parts:

1. **Website:** (`src/web`)
    - This is a SPA built using Vue.js

2. **Cron script:** (`src/cron`)
    - This is a Node script responsible for fetching auction house data from Blizzard's API

These two parts are completely independent from each other where their only communication channel is through the generated `json` data files.

## Dev Setup

```bash
# Runs linter
yarn lint

# Note that the website requires game data from the API (localized item names and icon files) before it can be properly built
yarn buildCron
yarn fetchData

# Starts webpack-dev-server on localhost:8080
yarn web
```

I recommend doing cron script development in VS Code because this repository is already configured to launch the scripts inside VS Code using `F5`. We just need to first run `yarn cron` in a separate terminal first.

## Building for Production

```bash
sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y nginx
sudo snap install --classic certbot
sudo npm install -g yarn

git clone https://github.com/Trinovantes/WoWPay2Win.git /var/www/wowpay2win.com
cd /var/www/wowpay2win.com

# Define CLIENT_ID and CLIENT_SECRET in this file
vim .env

yarn buildCron     # Builds the cron scripts
yarn fetchData     # Fetch game data (regions, connected realms, items)
yarn fetchAuctions # Fetch auction house data
yarn buildWeb      # Builds the website
```

## Setting up GitHub CI

Create `production` environment with the following secrets:
- `CLIENT_ID`
- `CLIENT_SECRET`
- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`

## Setting up Nginx

Create the nginx configuration file (`/etc/nginx/sites-available/wowpay2win.com`). The SSL options are initially commented out because those files do not exist yet. This will allow us to start nginx for the initial authentication without getting `FileDoesNotExist` errors.
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
    listen 443 ssl;
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
    listen      443 ssl;
    server_name www.wowpay2win.com;
    autoindex   off;
    root        /var/www/wowpay2win.com/dist-web/;
    expires     1d;
    add_header  Cache-Control public;

#    ssl_certificate /etc/letsencrypt/live/wowpay2win.com/fullchain.pem;
#    ssl_certificate_key /etc/letsencrypt/live/wowpay2win.com/privkey.pem;
#    ssl_trusted_certificate /etc/letsencrypt/live/wowpay2win.com/fullchain.pem;
#    include /etc/nginx/snippets/ssl.conf;

    location ~* ^/data/.+\.json$ {
        expires modified +1h;
    }
}
```

Next symlink the config file to `sites-enabled`:
```
sudo ln -s /etc/nginx/sites-available/wowpay2win.com /etc/nginx/sites-enabled/
```

Create the common nginx file (`/etc/nginx/snippets/ssl.conf`):
```
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

Now we can restart nginx to host the non-SSL version for Let's Encrypt authentication challenge.
```
sudo systemctl restart nginx
sudo certbot certonly --webroot -d wowpay2win.com -d www.wowpay2win.com --webroot-path /var/www/letsencrypt
```

**Important:** If we are behind Cloudflare, we need to ensure "Always Use HTTPS" is disabled.

After successfully creating new certificates, we can go back to `/etc/nginx/sites-available/wowpay2win.com` and uncomment the SSL options. We can also test auto renew with `certbot renew --dry-run`.

Next we need to add this line to `/etc/letsencrypt/cli.ini` to ensure nginx reloads whenever we renew our certificates.
```
deploy-hook = systemctl reload nginx
```

Finally run `crontab -e` and add this line:
```
30 * * * * cd /var/www/wowpay2win.com && /usr/local/bin/yarn fetchAuctions 2>&1 > /dev/null
```
