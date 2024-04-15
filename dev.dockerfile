FROM node:19.4.0-alpine

WORKDIR /auth

COPY package.json /auth

COPY package-lock.json /auth

RUN apk add --update --no-cache python3 make g++

RUN npm ci --quiet

RUN npm rebuild bcrypt --build-from-source

COPY . /auth

CMD ["npm", "start"]