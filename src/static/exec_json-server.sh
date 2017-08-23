#! /bin/sh
node ./node_modules/json-server/bin/index.js \
    ./src/static/db.json \
    --watch \
    --port 3001 \
    --delay 1000
