# Stage 0, based on Node.js, to build and compile Angular
FROM node:8.6 as node
WORKDIR /app
COPY ./package.json /app/
RUN npm install
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN npm install -g bower
RUN npm install -g bower-npm-resolver
RUN npm install -g gulp
COPY ./ /app/
RUN bower install
RUN gulp build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13
COPY --from=node /app/dist/ /usr/share/nginx/html
COPY ./compose/nginx/nginx.conf /etc/nginx/conf.d/default.conf
