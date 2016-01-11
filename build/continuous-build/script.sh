#!/usr/bin/env bash

set -e

echo "build started"
export BUILD_BRANCH=${GIT_REFERENCE}
export S3_FOLDER="continuous-build/nightly/${CFY_VERSION}-${CFY_PRERELEASE}-${BUILD_ID}"
export VAGRANT_WORKDIR="`pwd`/build/continuous-build"
export REPORTS_BASEDIR="`pwd`"

if [ "${BUILD_UID}" = "default" ]; then
    export BUILD_UID="`date +%s`"
fi

# export GIT_TAG="v${CFY_VERSION}-${CFY_PRERELEASE}-${CFY_BUILD_NUMBER}-${BUILD_UID}"
#git config user.name $GIT_USERNAME
#git tag ${GIT_TAG} -m "automated build"
#git push origin --tags

echoerr() { echo "$@" 1>&2; }

echo "user is $USER";

echo "installing node"
nvm install 0.10.35 # keep this in older version deliberately.

# replace json file placeholders with environment variables. https://github.com/guy-mograbi-at-gigaspaces/node-replace-env-in-json-file
curl https://goo.gl/j6qnth | INJECT_FILE="${CONFIG_FILE}" node

chmod 600  $PEM_FILE

npm install cloudify-cosmo/vagrant-automation-machines -g

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
