
ctx logger info "downloading app.tgz"
ctx download-resource app.tgz '@{"target_path": "/tmp/app.tgz"}'
# to see this file you need to ssh to the machine
# then go into the docker image `sudo docker exec -it cfy bash`
# and then you can ls -l on it
ctx logger info "`ls -ll /tmp/app.tgz`"

mkdir -p /etc/service/cloudify-ui/cosmo-ui

tar xf /tmp/app.tgz -C /etc/service/cloudify-ui/cosmo-ui
mv  -f /etc/service/cloudify-ui/cosmo-ui/package/* /etc/service/cloudify-ui/cosmo-ui

ctx logger info "starting service"
cd /etc/service/cloudify-ui/cosmo-ui
nohup node cosmoui.js localhost > /dev/null 2>&1 &


ctx logger info "finished installation"
exit 0

