#!/usr/bin/env bash

cat << 'EOF' > /etc/nginx/conf.d/default.conf
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
	if ($request_method ~* "(GET|OPTIONS)") {
		add_header "Access-Control-Allow-Origin"  *;
       		add_header 'Access-Control-Allow-Credentials' 'true' always;
	        add_header 'Access-Control-Allow-Methods' 'GET,OPTIONS' always;
        	add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With' always;
        	add_header 'Access-Control-Max-Age' 1728000;
}
}

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

}
EOF
