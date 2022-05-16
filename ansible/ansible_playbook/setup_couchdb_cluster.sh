#!/bin/zsh

ansible-playbook -i hosts -u ubuntu --key-file=group57.key setup_couchdb_cluster.yaml