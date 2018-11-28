#!/bin/sh
pacman -Syu --noconfirm openssh nodejs npm pm2 python neovim
ssh-keygen -A
/bin/sshd
mkdir -p /root/.ssh
mv /application/authorized_keys /root/.ssh/authorized_keys
chown -R root.root /root/.ssh
cd /application
pm2 ecosystem.config.js
pm2 start --name "snoot" --watch npm -- start
tail -f /dev/null
