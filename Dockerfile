FROM node:slim

WORKDIR /opt/

COPY package.json /opt/
COPY package-lock.json /opt/

RUN npm ci

COPY . /opt/

CMD node ./piu-piu.js
