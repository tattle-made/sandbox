# About

An App that deploys to tattle's k8 cluster. This app gives you a node and alpine environment inside the cluster. It also includes tools like vim, git and curl

# Prerequisits

**Kubernetes Configuration**
To deploy to your k8 cluster, the action needs access to your kubernetes credentials. This can be obtained from the system administrator.A handy Command to get it is `cat $HOME/.kube/config | base64`
Ensure that you set this value in a Github Secret so that it can be accessed by the action.

**Existing Deployment in The Cluster**
The CD pipeline simply updates the image of the docker container in the cluster. It assumes that a deployment already exists in the cluster.

```
cd debug-container-node/k8
kubectl apply -f .
```

v 0.0.10
