echo "Initilizing the kub-data-02-deployment-and-service"

echo "Running the database deployment"
cd ../k8_config/database
kubectl apply -f mysql-config.yaml,mysql-pv.yaml,mysql-service.yaml,mysql-secret.yaml,mysql-statefulset.yaml


cd ../application

echo "Creating ingress resource"
minikube addons enable ingress

echo "Running deployment for api application"
kubectl apply -f api-service.yaml,api-deployment.yaml,api-ingress.yaml,api-secret.yaml,api-config.yaml

cd ..
kubectl apply -f api-hpa.yaml


echo "$(minikube ip) api.local" | tee -a /etc/hosts
