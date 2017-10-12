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

EXPOSE 80
CMD ["npm", "start"]
