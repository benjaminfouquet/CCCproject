# setup worker 1
curl -X POST -H "Content-Type: application/json" http://admin:admin@127.0.0.1:5984/_cluster_setup -d '{"action": "enable_cluster", "bind_address":"0.0.0.0", "username": "admin", "password":"admin", "port": 5984, "node_count": "3", "remote_node": "172.26.128.15", "remote_current_user": "admin", "remote_current_password": "admin" }'
curl -X POST -H "Content-Type: application/json" http://admin:admin@127.0.0.1:5984/_cluster_setup -d '{"action": "add_node", "host":"172.26.128.15", "port": 5984, "username": "admin", "password":"admin"}'

# setup worker 2
curl -X POST -H "Content-Type: application/json" http://admin:admin@127.0.0.1:5984/_cluster_setup -d '{"action": "enable_cluster", "bind_address":"0.0.0.0", "username": "admin", "password":"admin", "port": 5984, "node_count": "3", "remote_node": "172.26.132.177", "remote_current_user": "admin", "remote_current_password": "admin" }'
curl -X POST -H "Content-Type: application/json" http://admin:admin@127.0.0.1:5984/_cluster_setup -d '{"action": "add_node", "host":"172.26.132.177", "port": 5984, "username": "admin", "password":"admin"}'

# finish cluster setup
curl -X POST -H "Content-Type: application/json" http://admin:admin@127.0.0.1:5984/_cluster_setup -d '{"action": "finish_cluster"}'

# check whether cluster is setup
curl http://admin:admin@127.0.0.1:5984/_cluster_setup
