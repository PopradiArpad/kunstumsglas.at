FROM node:8.6.0-alpine

# To build during installation a build environment is needed
RUN apk add --no-cache make gcc g++ python imagemagick

# Leverage Docker's cache
# First install the least probably changing parts
# Do not use package-lock.json which confuses the installation in the container
WORKDIR /app
COPY package.json .
RUN npm install

# Install gosu to let step down from root to specific user
ENV GOSU_VERSION 1.11
RUN set -eux; \
	\
	apk add --no-cache --virtual .gosu-deps \
		ca-certificates \
		dpkg \
		gnupg \
	; \
	\
	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
	wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
	wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
	\
# verify the signature
	export GNUPGHOME="$(mktemp -d)"; \
	gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
	command -v gpgconf && gpgconf --kill all || :; \
	rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
	\
# clean up fetch dependencies
	apk del --no-network .gosu-deps; \
	\
	chmod +x /usr/local/bin/gosu; \
# verify that the binary works
	gosu --version; \
	gosu nobody true

# Remove build dependencies but not imagemagick
RUN apk del make gcc g++ python

# Copy the app's own files but only the ones that are needed by the running app
ENV NODE_ENV=production
COPY .babelrc .
COPY public public/
COPY app_w app_w/
RUN npm run-script build_app_w
# app_m and server has common code in server/cms/shared_server_app
COPY app_m app_m/
COPY server server/
RUN npm run-script build_app_m
RUN npm run-script build_server

# Let run as an unprivileged user with nonexisting uid on the host (for a breakout)
RUN addgroup -g 2000 kunstumsglas && adduser -u 2000 -G kunstumsglas -s /bin/sh -D kunstumsglas
# For image processing etc a temporary volume
# RUN mkdir -p /app/tmp && chmod o+rwx /app/tmp
RUN mkdir -p /app/tmp && chown -R kunstumsglas:kunstumsglas /app/tmp
VOLUME /app/tmp
# USER kunstumsglas:kunstumsglas

# Only root can get port under 1024
EXPOSE 8080

# Chown the tmp mount to the app
# Place the wrapper somewhere into $PATH
COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# (SIGINT, SIGTERM) for a gracefull shutdown in rolling updates
CMD ["node", "server_build/server.js","--gc_interval=100"]
