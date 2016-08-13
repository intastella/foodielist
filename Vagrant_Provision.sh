#update apt sources and install web server and tools
sudo apt-get update

#install tools
sudo apt-get install -y apache2 curl git

#remove default hosting directory and link it to /vagrant
if ! [ -L /var/www ]; then
  sudo rm -rf /var/www
  sudo ln -fs /vagrant /var/www
fi

#set server name to avoid warning
sudo echo 'ServerName localhost' >> /etc/apache2/httpd.conf

#enable mod_rewrite
sudo a2enmod rewrite

#enable .htaccess rewrite on default site
sudo sed -i ':a;N;$!ba;s/AllowOverride None/AllowOverride All/2' /etc/apache2/sites-available/default
sudo apachectl restart

#install node from nodesource repo
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

#auto cd into /vagrant on vagrant ssh
sudo echo 'cd /vagrant' >> /home/vagrant/.bash_profile
