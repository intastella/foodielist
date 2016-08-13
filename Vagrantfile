Vagrant.configure(2) do |config|
  config.vm.box = "hashicorp/precise32"
  config.vm.box_check_update = false
  config.vm.provision :shell, path: "Vagrant_Provision.sh"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 35729, host: 35729
end