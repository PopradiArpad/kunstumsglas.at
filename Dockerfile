FROM node:8.6.0-alpine

#To build during installation a build environment is needed
RUN apk add --no-cache make gcc g++ python imagemagick

#Leverage Docker's cache
#First install the least probably changing parts
#Do not use package-lock.json which confuses the installation in the container
WORKDIR /app
COPY package.json .
RUN npm install

#Remove build dependencies but not imagemagick
RUN apk del make gcc g++ python

#Copy the app's own files but only the ones that are needed by the running app
COPY .babelrc .
COPY public public/
COPY app_w app_w/
RUN npm run-script build_app_w
#app_m and server has common code in server/cms/shared_server_app
COPY app_m app_m/
COPY server server/
RUN npm run-script build_app_m
RUN npm run-script build_server

#Let run as an unprivileged user with nonexisting uid on the host (for a breakout)
RUN addgroup -g 2000 onlyhere && adduser -u 2000 -G onlyhere -s /bin/sh -D onlyhere
USER onlyhere

#Only root can get port under 1024
EXPOSE 8080

#(SIGINT, SIGTERM) for a gracefull shutdown in rolling updates
CMD ["node", "server_build/server.js","--gc_interval=100"]
