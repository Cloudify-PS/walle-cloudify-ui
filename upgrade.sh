SYSCONF_DEST=/etc/sysconfig/cosmoui
. $SYSCONF_DEST

echo "I am checking out revision $1" > upgrade.output

echo "pulling from git"
git pull origin master

echo "checking out $1"
git checkout $1

echo "running npm install"
npm install

echo "running bower install"
bower install --allow-root

echo "running grunt --force"
grunt build --force

# echo "updating monit configuration"
# MONIT_PIDFILE=$DEST_FOLDER/RUNNING_PID
# cat conf/monit.conf | sed 's,__monit_pidfile__,'"$MONIT_PIDFILE"',' > /etc/monit.d/hpwidget

echo "copying service script"
\cp -f conf/initd.conf /etc/init.d/cosmoui

echo "restarting server"
nohup service cosmoui restart &
