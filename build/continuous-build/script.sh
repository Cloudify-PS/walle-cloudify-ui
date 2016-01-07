#!/usr/bin/env bash

set -e

export BUILD_BRANCH=${TAG}
export S3_FOLDER="continuous-build/nightly/${CFY_VERSION}-${CFY_PRERELEASE}-${BUILD_ID}"
export VAGRANT_WORKDIR="`pwd`/build/continuous-build"
export REPORTS_BASEDIR="`pwd`"

echoerr() { echo "$@" 1>&2; }

echo "user is $USER";

nvm install 0.10.35

# replace json file placeholders with environment variables
curl https://goo.gl/j6qnth | INJECT_FILE="${CONFIG_FILE}" node

chmod 600  $PEM_FILE

npm install vagrant-automation-machines -g

function cleanup(){
    pushd $VAGRANT_WORKDIR
        vagrant destroy -f
    popd
}
trap cleanup EXIT

pushd ${VAGRANT_WORKDIR}
    vagrant-automation-machines-setup aws
    cleanup || echo "no need to teardown the machine because it was not running"
    vagrant up --provider=aws
popd

pushd ${REPORTS_BASEDIR}
    rm -rf reports
    vagrant-automation-machines-copy reports # copy from guest machine!
popd
