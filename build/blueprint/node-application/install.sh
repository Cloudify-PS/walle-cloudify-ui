#!/bin/bash
set -e

source activate.sh
cfy blueprints upload -p singlehost.yaml  -b node-app
cfy deployments create -d node-app -b node-app

echo "waiting for deployment environment..."
sleep 10
cfy executions start  -d node-app -w install -l
