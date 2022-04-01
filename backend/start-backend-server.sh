#!/bin/bash

echo "Launching MongoDB in Docker...."
docker run -p 27021:27021 -d --name mongodb mongo
echo "Launching Only Cat Server...."
npx nodemon ./src/main.js
