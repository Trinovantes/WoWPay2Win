```
sudo apt update
sudo apt install -y nodejs npm

sudo npm install -g parcel-bundler
python3 auctions.py
parcel build index.html
```

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