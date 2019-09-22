FROM nginx:alpine

RUN apk update && apk add bash

COPY src/ /usr/share/nginx/html

COPY docker/startup.sh /tmp/

RUN chmod +x /tmp/startup.sh

CMD /tmp/startup.sh && nginx -g 'daemon off;'
