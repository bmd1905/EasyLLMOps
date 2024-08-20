# Managing Prompt Alchemy App with Helm

## Prerequisites

Before begin, ensure the following installed:

- Kubernetes cluster (e.g., Minikube, EKS, GKE)
- kubectl CLI
- Helm v3.x
- Prompt Alchemy application code and Docker image

## Environment Setup

First, create a Kubernetes secret to store your environment variables:

```shell
# Create a secret from your .env file
kubectl create secret generic promptalchemy-env --from-env-file=.env --namespace promptalchemy

# Verify the secret
kubectl describe secret promptalchemy-env -n promptalchemy
```

This step ensures that the application can access necessary environment variables securely.

## Deploying the Application

Navigate to your Helm chart directory:

```shell
cd promptalchemy
```

Deploy or upgrade your application using Helm:

```shell
helm upgrade --install promptalchemy .
```

This command will either install the application if it doesn't exist, or upgrade it to the latest version if it's already deployed.

## Accessing the Application

To access your application locally, use port forwarding:

```shell
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

```shell
helm upgrade --install promptalchemy . --set replicaCount=3
```

## Troubleshooting

If you encounter issues:

1. Check pod status: `kubectl get pods -n promptalchemy`
2. View pod logs: `kubectl logs <pod-name> -n promptalchemy`
3. Describe the pod: `kubectl describe pod <pod-name> -n promptalchemy`

## Uninstalling

To remove the application:

```shell
helm uninstall promptalchemy
```

Remember to delete any persistent volumes or other resources that were not managed by Helm if necessary.