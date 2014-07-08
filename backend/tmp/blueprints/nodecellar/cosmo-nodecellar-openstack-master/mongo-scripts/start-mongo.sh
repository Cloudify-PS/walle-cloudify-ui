#!/bin/bash

function info(){ builtin echo [INFO] [$(basename $0)] $@; }
function error(){ builtin echo [ERROR] [$(basename $0)] $@; }

#. ${CLOUDIFY_LOGGING}
#. ${CLOUDIFY_FILE_SERVER}

TEMP_DIR="/tmp"
MONGO_ROOT=${TEMP_DIR}/mongodb
PID_FILE="mongo.pid"

info "Changing directory to ${MONGO_ROOT}"
cd ${MONGO_ROOT} || exit $?

info "Starting mongodb from ${MONGO_ROOT}/mongodb/bin/mongod with port ${port}"
nohup ./mongodb/bin/mongod --port ${port} --dbpath data --rest --journal --shardsvr > /dev/null 2>&1 &
echo $! > ${PID_FILE}

info "Waiting for mongo to launch"

STARTED=false
REST_PORT=`expr ${port} + 1000`
for i in $(seq 1 30)
do
    if wget http://localhost:${REST_PORT} 2>/dev/null ; then
        info "Server is up."
        STARTED=true
        break
    else
        info "mongodb not up. waiting 1 second."
        sleep 1
    fi  
done
if [ ${STARTED} = false ]; then
    error "Failed to start mongodb in 30 seconds."
    exit 1
fi
# Installing jq to parse json 
info "Installing jq"
if [ ! -f ./jq ]; then
    wget http://stedolan.github.io/jq/download/linux64/jq || exit $?
    chmod +x ./jq || exit $?
    info "jq installed sucessfully"
else 
    info "Skipping, jq already installed"
fi

info "Getting latest state version of current node ${CLOUDIFY_NODE_ID} from cloudify manager at ${CLOUDIFY_MANAGER_IP}"

NODE_STATE=`curl -s -X GET "http://${CLOUDIFY_MANAGER_IP}:8100/nodes/${CLOUDIFY_NODE_ID}?runtime=true"`
info "Node state is ${NODE_STATE}"

VERSION=`echo ${NODE_STATE} | ./jq  '.stateVersion'`
info "version is ${VERSION}"

IP_ADDR=$(ip addr | grep inet | grep eth0 | awk -F" " '{print $2}'| sed -e 's/\/.*$//')
info "About to post IP adress ${IP_ADDR} and port ${port}"

RUNTIME_INFO="{\"runtime_info\": {\"ip_address\": \"${IP_ADDR}\", \"port\":\"${port}\"}, \"state_version\": ${VERSION}}"
URL="http://${CLOUDIFY_MANAGER_IP}:8100/nodes/${CLOUDIFY_NODE_ID}"

info "Runtime info: ${RUNTIME_INFO}"
info "Url: ${URL}"

curl -X PATCH -H "Content-Type: application/json" -d "${RUNTIME_INFO}" ${URL}

info "Successfully posted data to manager"


