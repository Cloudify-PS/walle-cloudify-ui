#!/usr/bin/env bash

set -e

echo "build started"
export BUILD_BRANCH=${GIT_REFERENCE}
export VAGRANT_BASEDIR="`pwd`/build/continuous-build" # contains provision script and synced folder
export VAGRANT_WORKDIR="${VAGRANT_BASEDIR}/aws" # contains the Vagrantfile itself
export REPORTS_BASEDIR="`pwd`"

if [ "${BUILD_UID}" = "default" ]; then
    export BUILD_UID="`date +%s`"
fi

echoerr() { echo "$@" 1>&2; }

echo "user is $USER";

echo "installing node"
nvm install 0.10.35 # keep this in older version deliberately.

# replace json file placeholders with environment variables. https://github.com/guy-mograbi-at-gigaspaces/node-replace-env-in-json-file
curl -L https://goo.gl/j6qnth | INJECT_FILE="${CONFIG_FILE}" node

chmod 600  $PEM_FILE

npm install cloudify-cosmo/vagrant-automation-machines#dynamic-provision-arguments -g

function cleanup(){
    pushd ${VAGRANT_WORKDIR}
        echo "I am at `pwd` and I am destroying the machine"
        vagrant destroy -f || echo "destroy failed for some reason"
        rm -rf .vagrant || echo "no .vagrant folder to remove"
    popd
}
trap cleanup EXIT

pushd ${VAGRANT_BASEDIR}
    vagrant-automation-machines-setup --cloud aws --args S3_ACCESS_KEY S3_SECRET_KEY GITHUB_USERNAME GITHUB_PASSWORD
    cleanup || echo "no need to teardown the machine because it was not running"
    pushd ${VAGRANT_WORKDIR}
        vagrant up --provider=aws
    popd
popd

#pushd ${REPORTS_BASEDIR}
#    rm -rf reports
#    vagrant-automation-machines-copy reports # copy from guest machine!
#popd
