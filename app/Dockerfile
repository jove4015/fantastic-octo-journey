FROM node:20-bullseye-slim

WORKDIR /usr/src/app
ARG version
ENV SENTRY_RELEASE ${version}
ENV SENTRY_IGNORE_API_RESOLUTION_ERROR 1

COPY package*.json ./
COPY packages/kiefa-cultivator/package.json ./packages/kiefa-cultivator/package.json
COPY tsconfig.json ./

RUN apt-get update && apt-get install -y netcat && apt-get install -y openssl && apt-get install -y curl

ARG PACKAGE_LOCK_CHECKSUM
RUN npm install --omit=dev

COPY packages/kiefa-cultivator/ ./packages/kiefa-cultivator/
WORKDIR /usr/src/app/packages/kiefa-cultivator

WORKDIR /usr/src/app
ENV NODE_OPTIONS='-r next-logger'
EXPOSE 4000
CMD [ "npm", "run", "dev-ui" ]
