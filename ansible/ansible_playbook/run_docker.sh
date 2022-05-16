#!/bin/zsh

ansible-playbook -i hosts -u ubuntu --key-file=group57.key run_docker.yaml