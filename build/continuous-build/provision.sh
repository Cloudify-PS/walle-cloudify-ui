#!/usr/bin/env bash
set -e

echo "read configuration"

source /etc/ENVIRONMENT_VARIABLES.sh || echo "no environment variables file.. skipping.. "

source /vagrant/dev/ENVIRONMENT_VARIABLES.sh || echo "no dev environment variables file.. skipping.. "

# Declaring credentials variables passed through vagrant args feature
export S3_ACCESS_KEY=$1
export S3_SECRET_KEY=$2
export GITHUB_USERNAME=$3
export GITHUB_PASSWORD=$4

if [ ! -f /usr/bin/git ]; then
    echo "installing git"
    sudo yum install git -y
else
    echo "git already installed"
fi

echo "define variables"
export REPORTS_BASE=`echo ~`/reports
export PROJECT_NAME="cloudify-ui"
export GIT_DEST="`pwd`/${PROJECT_NAME}"
export GIT_URL="https://$GITHUB_USERNAME:$GITHUB_PASSWORD@github.com/cloudify-cosmo/${PROJECT_NAME}.git"


echo "install nvm"
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash
source ~/.nvm/nvm.sh


## seems like some images don't have required libraries.. we will try to fix them
## commented out lines are lines that answers online suggest we should use, but build passes without them.
## we keep them here for future references just in case future images break, so we don't need to research again.
## the 'if' might be incorrect, but we try to invoke these commands only when needed. not using brute force to make build as fast as possible.
## so everything will undergo fine-tuning as we progress.



if [ ! -f /usr/lib64/libfreetype.so.6 ] || [ ! -f /usr/lib64/libfontconfig.so.1 ];then
    echo "fixing centos image : installing libfreetype.so.6 for phantomjs"
    sudo yum install freetype fontconfig -y
else
    echo "libfreetype is present.. moving on.."
fi

if [ ! -f /usr/bin/bzip2 ]; then
    sudo yum install -y bzip2
else
    echo "bzip2 exists. skipping..."
fi

## for an unknown reason, some tests fail in PhantomJS when Chrome isn't installed on the machine
## to remedy that, Chrome is installed
if [ ! -f /usr/bin/google-chrome-stable ];then
    echo "Installing Google Chrome"
    # add google chrome repo to yum
    sudo sh -c "echo '[google-chrome]
name=google-chrome - 64-bit
baseurl=http://dl.google.com/linux/chrome/rpm/stable/x86_64
enabled=1
gpgcheck=1
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub' > /etc/yum.repos.d/google-chrome.repo"
    # install google chrome
    sudo yum -y install google-chrome-stable --skip-broken
fi

if [ "${SKIP_BUILD}" == "" ];then # for development purposes
    if [ "${UPDATE_CLONE}" != "" ]; then
        echo "updating clone"
        rm -rf ${GIT_DEST}
    else
        echo "not updating clone.."
    fi
    git clone ${GIT_URL} ${GIT_DEST}

    pushd ${GIT_DEST}
        git checkout ${BUILD_BRANCH}
        echo "installing preprequirements and building"
        nvm install &> /dev/null
        npm config set registry http://registry.npmjs.org
        npm -g install guy-mograbi-at-gigaspaces/cloudify-ui-build-helper
        create-and-push-build-tag
        export S3_FOLDER="`get-unstable-s3-folder`"
        npm run install_prereq
        npm run build_and_publish
    popd
else
    echo "skipping build"
fi



