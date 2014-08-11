#!/bin/bash

source ../retry.sh

function run_command 
{
  
	status=256
   
  	echo "*** Running $1"      
   	$1
  	status=$?   
    
     	if [ $status != 0 ] ; then
            echo "Failed with exit code $status"
            exit $status
      	fi   
}


[ -d dist ] && sudo rm -rf dist
[ -d node_modules ] && sudo rm -rf node_modules

sudo npm cache clean
sudo bower cache clean

retry "npm install"
retry "bower install -force"
retry "bower update -force"

run_command "grunt build"


pushd dist
	echo '{' > views/versionDetails.html
	echo '    "revision": "'$REVISION'",' >> views/versionDetails.html
	echo '    "buildVersion": "'$BUILD_NUM'",' >> views/versionDetails.html
	echo '    "buildId": "'$BUILD_ID'",' >> views/versionDetails.html
	echo '    "configurationName": "'$CONFIGURATION_NAME'",' >> views/versionDetails.html
	echo '    "timestamp": "'`date +%T`'",' >> views/versionDetails.html
	echo '    "date": "'`date +'%d/%m/%Y'`'"' >> views/versionDetails.html
	echo '}' >> views/versionDetails.html


	run_command "npm install --production"
	run_command "npm pack"
#popd
