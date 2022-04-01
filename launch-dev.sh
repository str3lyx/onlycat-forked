#!/bin/bash

cd ./backend
sh ./start-backend-server.sh
cd ..
cd ./frontend
sh ./start-frontend.sh
cd ..
