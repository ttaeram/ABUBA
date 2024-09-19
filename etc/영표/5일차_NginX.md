### Nginx

Nginx는 웹 서버로 쓰기도 하고, reverse proxy용도로 쓰기도 한다. 근데 Jetson nano에도 react 서버를 올려 봤었는데, 굳이 엔진엑스를 안 써도 될듯하다. serve를 써도 특정 포트에 프론트 서버를 띄울 수 있다. 

나는 reverse proxy 용도로 썼다. 이는 하나의 DNS로 클라이언트의 요청이 들어오면 uri를 보고 엔진엑스가 알아서 일로 가야하는구나?라고 알고 그 서버로 보내준다.

아 Nginx를 도커로 계속 띄어놨었는데, 한번 띄울 때에 ssl 인증을 받아서 올려야한다. ssl인증은 한번만 받으면 된다. certbot으로 받으면 쉽다 → 한번 받고 지워버려서 짜증나긴했는디…

나는 계속 띄어놨었는데, 웹서버로만 쓰는 사람들은 nginx랑 react를 docker compose해서 같이 올리기도 한다. 

```docker
services:
    web:
        image: nginx:latest
        container_name: nginx
        restart: always
        volumes:
            - ./data/conf.d:/etc/nginx/conf.d
            - ./data/certbot/conf:/etc/nginx/ssl
            - ./data/certbot/data:/var/www/certbot
            - ./data/html:/usr/share/nginx/html
        ports:
            - 80:80
            - 443:443

    certbot:
        image: certbot/certbot:latest
        command: certonly --webroot --webroot-path=/var/www/certbot --email menstoo9504@google.com --agree-tos --no-eff-email -d i11a206.p.ssafy.io
        volumes:
            - ./data/certbot/conf:/etc/letsencrypt
            - ./data/certbot/logs:/var/log/letsencrypt
            - ./data/certbot/data:/var/www/certbot
```

포트는 80(http), 443(https) 두 개만 열어 놓고 Nginx 설정으로 다른 포트로 연결 해줘야 한다.

volume 설정은 필수. 

Nginx 설정을 꽤 까다롭다.

- 설정
```docker
server {
     listen [::]:80;
     listen 80;

     server_name i11a206.p.ssafy.io; #DNS, 없으면 사야하는데 EC2에서 설정가능

     location ~ /.well-known/acme-challenge {
         allow all;
         root /var/www/certbot;
     }

     location / {
        return 301 https://i11a206.p.ssafy.io$request_uri; #이는 http로 들어오면 https
	      #로 redirect
     }
}

upstream spring{
        server 54.180.9.157:8081; #그냥 이걸로 간다는 설정인듯. 쓰지는 않았다.
}

server {
    listen 443 ssl;
    server_name i11a206.p.ssafy.io;
    root   /usr/share/nginx/html;
    index  index.html;
    include snippets/error_pages.conf;
    ssl_certificate /etc/nginx/ssl/archive/i11a206.p.ssafy.io/fullchain1.pem;
    ssl_certificate_key /etc/nginx/ssl/archive/i11a206.p.ssafy.io/privkey1.pem;
		#443은 https 포트인데 그러면 ssl certificate 설정을 해줘야 들어갈 수 있음.
    location /jenkins {

        proxy_pass http://54.180.9.157:9090; #jenkins 서버 포트 적어줘야함.
        proxy_redirect     default;
        proxy_http_version 1.1;

      # Required for Jenkins websocket agents
        proxy_set_header   Connection        "Upgrade";
        proxy_set_header   Upgrade           $http_upgrade;

        proxy_set_header   Host              $http_host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_max_temp_file_size 0;
			#위 설정은 웹소켓 설정이다.
			
      #this is the maximum upload size
        client_max_body_size       10m;
        client_body_buffer_size    128k;

        proxy_connect_timeout      90;
        proxy_send_timeout         90;
        proxy_read_timeout         90;
        proxy_request_buffering    off; # Required for HTTP CLI commands

    }

    location /api{ #이렇게 설정을 해주면 https://DNS/백엔드 매핑 된걸로 요청하면 일로 포워딩해줌
        proxy_pass http://54.180.9.157:8081;
        proxy_http_version 1.1;
        proxy_set_header   Connection        "Upgrade";
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Accept-Encoding gzip;
    }
    location / { #이건 기본 path이다. 
        try_files $uri /index.html; 
    }
}
```