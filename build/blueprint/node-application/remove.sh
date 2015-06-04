#!/bin/bash
set -e

source activate.sh
cfy deployments delete -d node-app -f
cfy blueprints delete -b node-app
