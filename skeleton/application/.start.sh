#!/bin/sh
apt-get -y update
apt-get -y install openssh-server
mkdir -p /var/run/sshd
/usr/sbin/sshd
mkdir -p /root/.ssh
update-rc.d ssh defaults
mv /application/authorized_keys /root/.ssh/authorized_keys
chown -R root.root /root/.ssh
npm i -g pm2
cd /application
pm2 ecosystem.config.js
pm2 start --name "snoot" --watch npm -- start
tail -f /dev/null
