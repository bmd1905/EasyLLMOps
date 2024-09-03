#!/bin/bash

# Create namespace and switch context
kubectl create ns logging
kubens logging

# Install Elasticsearch
helm install elk-elasticsearch elastic/elasticsearch -f elastic.expanded.yaml --namespace logging --create-namespace

# Wait for Elasticsearch to be ready
echo "Waiting for Elasticsearch to be ready..."
kubectl wait --for=condition=ready pod -l app=elasticsearch-master --timeout=300s

# Create a secret for Logstash to access Elasticsearch
kubectl create secret generic logstash-elasticsearch-credentials \
  --from-literal=username=elastic \
  --from-literal=password=$(kubectl get secrets --namespace=logging elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d)

# Install Kibana
helm install elk-kibana elastic/kibana -f kibana.expanded.yaml

# Install Logstash
helm install elk-logstash elastic/logstash -f logstash.expanded.yaml

# Install Filebeat
helm install elk-filebeat elastic/filebeat -f filebeat.expanded.yaml

echo "ELK stack installation complete."
echo "Elasticsearch credentials are stored in the 'logstash-elasticsearch-credentials' secret"