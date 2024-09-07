#!/bin/bash

# cluster_config.sh
# Configuration file for Kubernetes cluster setup

# GCP Configuration
GCP_CONFIG_KEYS=("PROJECT" "ZONE" "CLUSTER_NAME")
GCP_CONFIG_VALUES=("easy-llmops" "asia-southeast1-b" "easy-llmops-gke")

# Namespace Configuration
NAMESPACE_KEYS=("MODEL_SERVING" "NGINX")
NAMESPACE_VALUES=("model-serving" "nginx-system")

# Chart Configuration
CHART_KEYS=("LITELLM" "NGINX_INGRESS" "REDIS")
CHART_VALUES=("./deployments/litellm" "./deployments/nginx-ingress" "./deployments/redis")

# Manifest Locations
MANIFEST_KEYS=("WEBUI_INGRESS" "OPEN_WEBUI")
MANIFEST_VALUES=("./open-webui/kubernetes/manifest/base/webui-ingress.yaml" "./open-webui/kubernetes/manifest/base")

# Feature Flags
FEATURE_KEYS=("AUTOSCALING" "LOGGING" "MONITORING")
FEATURE_VALUES=(false false false)

# Logging Configuration
LOG_FILE="/tmp/cluster_setup.log"

# Resource Configuration
RESOURCE_KEYS=("LITELLM_REPLICAS" "REDIS_STORAGE_SIZE")
RESOURCE_VALUES=(1 "8Gi")

# Security Configuration
SECURITY_KEYS=("ENV_FILE_PATH" "RBAC_ROLEBINDING" "RBAC_ROLE")
SECURITY_VALUES=(".env" "deployments/infrastructure/rolebinding.yaml" "deployments/infrastructure/role.yaml")

# Terraform Configuration
TERRAFORM_DIR="iac/terraform"

# Function to get value from array
get_value() {
    local keys=("${!1}")
    local values=("${!2}")
    local key=$3
    for i in "${!keys[@]}"; do
        if [[ "${keys[$i]}" == "$key" ]]; then
            echo "${values[$i]}"
            return
        fi
    done
    echo "Key not found: $key"
    return 1
}

# Additional configuration variables can be added here