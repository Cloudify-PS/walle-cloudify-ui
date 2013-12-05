#! /usr/bin/env sh

if [ ! -f RUNNING_PID ];then
    node server.js &
    echo $! > RUNNING_PID
else
    echo "RUNNING_PID file exists"
fi