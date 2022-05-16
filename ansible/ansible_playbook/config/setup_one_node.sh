# !bin/bash
export user='admin'
export pass='admin'
export VERSION='3.2.1'
export cookie='a192aeb9904e6590849337933b000c99'
export node='172.26.134.93'

# pull docker image
docker pull ibmcom/couchdb3:${VERSION}

# create docker containers
if [ ! -z $(docker ps --all --filter "name=couchdb${node}" --quiet) ] 
	then
		docker stop $(docker ps --all --filter "name=couchdb${node}" --quiet) 
		docker rm $(docker ps --all --filter "name=couchdb${node}" --quiet)
fi 

# -v mont data to the volume attached
# -p map ports

    docker create\
      --name couchdb${node}\
      -p 4369:4369\
      -p 5984:5984\
      -p 9100:9100\
      -v /home/ubuntu/data:/opt/couchdb/data\
      --env COUCHDB_USER=${user}\
      --env COUCHDB_PASSWORD=${pass}\
      --env COUCHDB_SECRET=${cookie}\
      --env NODENAME=${node}\
      --env ERL_FLAGS="-setcookie \"${cookie}\" -name \"couchdb@${node}\""\
      ibmcom/couchdb3:${VERSION}



docker start couchdb${node}
