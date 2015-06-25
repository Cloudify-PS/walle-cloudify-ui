#!/bin/bash
set -e

source activate.sh
cfy blueprints publish-archive -l ../../../artifacts/blueprint.tar.gz -b node-app -n singlehost.yaml
cfy deployments create -d node-app -b node-app

echo "waiting for deployment environment..."
sleep 10
cfy executions start  -d node-app -w install -l
