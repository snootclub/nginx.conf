#!/bin/sh
pacman -Syu --noconfirm opensshd nodejs npm pm2 python neovim
for key_type in dsa rsa ecdsa ed25519; do
	ssh-keygen -t dsa -N "" -f /etc/ssh/ssh_host_${key_type}_key
done
/bin/sshd
mkdir -p /root/.ssh
mv /application/authorized_keys /root/.ssh/authorized_keys
chown -R root.root /root/.ssh
cd /application
pm2 ecosystem.config.js
pm2 start --name "snoot" --watch npm -- start
tail -f /dev/null
