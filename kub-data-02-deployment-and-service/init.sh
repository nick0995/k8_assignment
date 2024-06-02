echo "Initilizing the kub-data-02-deployment-and-service"
cd ../k8_config/application
kubectl apply -f api-service.yaml,api-deployment.yaml,api-ingress.yaml,api-secret.yaml,api-config.yaml

cd ../database
kubectl apply -f mysql-config.yaml,mysql-pv.yaml,mysql-service.yaml,mysql-secret.yaml,mysql-statefulset.yaml

cd ..
kubectl apply -f api-hpa.yaml