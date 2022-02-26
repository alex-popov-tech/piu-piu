# Piu-piu

Simple tool which holds needed http connection count with endpoints you choose, and shows brief status in cute table.
Простой инструмент который позволяет постоянно опрашивать сайты которые вы выберете, и показывает текущий статус в таблице.

## How to use with local Node.js

```sh
CONNECTIONS_COUNT=500 TARGETS="https://www.bing.com/,https://www.google.com/,https://duckduckgo.com/" REFRESH_RATE=100 node ./piu-piu.js
```

## How to use with Docker having this repo

```sh
docker run -it --rm -e CONNECTIONS_COUNT=500 -e TARGETS="https://www.google.com/" -e REFRESH_RATE=500 -v "$PWD:/app" node:slim node /app/piu-piu.js
```

## How to use with just Docker

```sh
docker run -it --rm -e CONNECTIONS_COUNT=500 -e TARGETS="https://www.google.com/" -e REFRESH_RATE=500 alex-popov-tech/piu-piu:latest
```
