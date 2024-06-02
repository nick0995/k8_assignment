# Assignment for NAGP
# ** Install minikube as application was deployed and tested on local using minikube. **

# Below is the link to install the minikube on local:

https://minikube.sigs.k8s.io/docs/start/?arch=%2Fwindows%2Fx86-64%2Fstable%2F.exe+download

# To start the applcication and deploying the pods for api and database, go to directory kub-data-02-deployment-and-service and run the following commands

sh init.sh

This will create the entire setup for the application. It will deploy the pods for api and database.

# To run the application and get the external ip, run the following command

kubectl get nodes -o wide  or
minikube service api-service

# To check the pods,replicasets and services health, run the following command:

minikube dashboard


# Simulate Load to Trigger Autoscaling

Ensure Metrics Server is Installed
If not already installed, install the Metrics Server:

kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml


To simulate a load on the API service and demonstrate the HPA in action, you can use a load-testing tool like kubectl run with a busybox image to generate CPU load.

sh
Copy code
kubectl run -i --tty load-generator --rm --image=busybox /bin/sh

# Inside the load-generator pod, run the following command:
while true; do wget -q -O- http://<API_SERVICE_IP>; done
