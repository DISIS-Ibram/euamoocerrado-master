#!/usr/bin/env bash

# yarn install 2>&1 &

yarn install
npm run start & > /dev/stderr

while sleep 5; do
    echo "..."    
done
