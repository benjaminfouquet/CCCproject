# Assignment 2 for cloud and cluster computing

## Introduction
In this project, our aim is to develop a software system that showcases the livability of Melbourne by analyzing and visualizing the twitter streaming data and historical data we harvested. 

To achieve superb performance of the system, we developed a cloud-based application that can harvest twitter data using twitter API powered by VMs across the MRC. In the following sections we will introduce the rationale and approaches of our data analysis, the technical details of the system and the final display of our analysis result.

## Group Members
Student Name | Student ID 
--- | --- 
Wentao Gao | 1256470
Benjamin Fouquent | 1267505
Yuze Qu | 1289458
Siri Liang| 1137743
Juan Dai | 1025253

## Web Application 
This app is hosted on http://172.26.131.21:3000

***(Note: You should connect Univeristy VPN to be able to connect to the application)***

## system architecture
Here is the system architure of our system
![image](https://user-images.githubusercontent.com/80622629/168474673-1b3e4a87-f543-41f9-a171-c4debeffe9b4.png)

## Related ansible deployment script

### 1. Deploy Couchdb on one node
 ```
 ansible/ansible_playbook/deploy_couchdb.sh
 ```

### 2. Configure clusters on the master node
```
ansible/ansible_playbook/setup_couchdb_cluster.sh
```

### 3. Deploy twitter harvesters
```
ansible/ansible_playbook/deploy_harvester.sh
```

### 4. Deploy the backend
```
ansible/ansible_playbook/deploy_backend.sh
```

### 5. Deploy the frontend
```
ansible/ansible_playbook/deploy_frontend.sh
```

## Youtube/Google drive video link

## Collaborative drive link(Google Drive)
https://drive.google.com/drive/folders/1pNQQmzxCwkAYndEj8-nfMgX36bdgxB3o
