#!/bin/zsh

ansible-playbook -i hosts -u ubuntu --key-file=group57.key deploy_frontend.yaml