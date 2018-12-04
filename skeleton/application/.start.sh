#!/bin/sh
apt update
apt install -y vim-tiny mg openssh-server
/usr/sbin/sshd
mkdir -p /root/.ssh
mv /application/authorized_keys /root/.ssh/authorized_keys
chown -R root.root /root/.ssh
chmod 700 -R /root/.ssh
cd /application
npm i -g pm2
pm2 ecosystem.config.js
pm2 start --name "snoot" --watch npm -- start
tail -f /dev/null
