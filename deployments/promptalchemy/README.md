# Managing Prompt Alchemy App with Helm

## Prerequisites

Before you begin, ensure the following are installed:

- Kubernetes cluster (e.g., Minikube, EKS, GKE)
- kubectl CLI
- Helm v3.x
- Prompt Alchemy application code and Docker image

## Environment Setup

### Start Kubernetes Service

First, deploy the NGINX-ingress controller:

```shell
# Create a namespace for NGINX-ingress
kubectl create ns nginx-system

# Switch to the nginx-system namespace
kubens nginx-system

# Deploy or upgrade the NGINX-ingress using Helm
helm upgrade --install nginx-ingress ./deployments/nginx-ingress
```

This step sets up the NGINX-ingress service, which will manage external access to the services running in your Kubernetes cluster.

### Setup Secret for API Key

Next, create a Kubernetes namespace and secret to store your environment variables securely:

```bash
# Create a namespace for the Prompt Alchemy application
kubectl create ns model-serving

# Switch to the promptalchemy namespace
kubens model-serving

# Navigate to the Prompt Alchemy deployment directory
cd deployments/promptalchemy

# Create a Kubernetes secret from the .env file to securely store environment variables
kubectl create secret generic promptalchemy-env --from-env-file=.env -n model-serving

# Verify that the secret has been created successfully
kubectl describe secret promptalchemy-env -n model-serving
```

This ensures that the Prompt Alchemy application can access the necessary environment variables securely.

## Deploying the Application

Deploy or upgrade your application using Helm:

```bash
# Deploy or upgrade the Prompt Alchemy application using Helm with debugging and force options
helm upgrade --install promptalchemy ./deployments/promptalchemy --debug --force
```

This command will either install the application if it doesn't exist or upgrade it to the latest version if it's already deployed.

## Accessing the Application

To access your application locally, use port forwarding:

```bash
# Forward the local port 30000 to the service's port 30000 in the Kubernetes cluster
kubectl port-forward svc/promptalchemy 30000:30000
```

Now you can access your Prompt Alchemy application at `http://localhost:30000`.

## Helm Chart Structure

Your Helm chart should include the following files:

- `Chart.yaml`: Metadata about the chart
- `values.yaml`: Default configuration values
- `templates/`: Directory containing Kubernetes manifest templates

## Customization

You can customize the deployment by modifying the `values.yaml` file or by passing values directly to the `helm upgrade` command:

```bash
# Deploy or upgrade the Prompt Alchemy application with a custom number of replicas
helm upgrade --install promptalchemy . --set replicaCount=3
```

## Troubleshooting

If you encounter issues:

```bash
# Check the status of all pods in the promptalchemy namespace
kubectl get pods -n model-serving

# View the logs of a specific pod (replace <pod-name> with the actual pod name)
kubectl logs <pod-name> -n model-serving

# Describe the detailed configuration and status of a specific pod (replace <pod-name> with the actual pod name)
kubectl describe pod <pod-name> -n model-serving
```

## Uninstalling

To remove the application:

```bash
# Uninstall the Prompt Alchemy application
helm uninstall promptalchemy
```

Remember to delete any persistent volumes or other resources that were not managed by Helm if necessary.

---

This version includes comments within each code block to explain what each command does.
