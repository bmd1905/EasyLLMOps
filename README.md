# PromptAlchemy (WIP)
[![Stars](https://img.shields.io/github/stars/bmd1905/PromptAlchemy.svg)](https://api.github.com/repos/bmd1905/PromptAlchemy)

 Transform basic queries into sophisticated prompts for exceptional results.

 [![Pipeline](./assets/prompt_alchemy.jpg)](#features)

## Please go to [here](https://bmd1905.github.io/PromptAlchemy/) to read the docs due to the heavily of the documentation)

## Target Audience: Developers

This project integrates the [Open WebUI](https://github.com/open-webui/open-webui) as the backend and frontend for a machine learning operations (MLOps) environment. It includes custom-built infrastructure such as Jenkins CI/CD pipelines, Kubernetes for orchestration, deployments on Google Kubernetes Engine (GKE), etc. The project aims to provide hands-on experience with MLOps, leveraging Open WebUI’s capabilities to manage and deploy large language models (LLMs) in a scalable, cloud-native environment.


## Key Features of Open WebUI ⭐ (from [@open-webui/open-webui](https://github.com/open-webui/open-webui))

- 🚀 **Effortless Setup**: Install seamlessly using Docker or Kubernetes (kubectl, kustomize or helm) for a hassle-free experience with support for both `:ollama` and `:cuda` tagged images.

- 🤝 **Ollama/OpenAI API Integration**: Effortlessly integrate OpenAI-compatible APIs for versatile conversations alongside Ollama models. Customize the OpenAI API URL to link with **LMStudio, GroqCloud, Mistral, OpenRouter, and more**.

- 🧩 **Pipelines, Open WebUI Plugin Support**: Seamlessly integrate custom logic and Python libraries into Open WebUI using [Pipelines Plugin Framework](https://github.com/open-webui/pipelines). Launch your Pipelines instance, set the OpenAI URL to the Pipelines URL, and explore endless possibilities. [Examples](https://github.com/open-webui/pipelines/tree/main/examples) include **Function Calling**, User **Rate Limiting** to control access, **Usage Monitoring** with tools like Langfuse, **Live Translation with LibreTranslate** for multilingual support, **Toxic Message Filtering** and much more.

- 📱 **Responsive Design**: Enjoy a seamless experience across Desktop PC, Laptop, and Mobile devices.

- 📱 **Progressive Web App (PWA) for Mobile**: Enjoy a native app-like experience on your mobile device with our PWA, providing offline access on localhost and a seamless user interface.

- ✒️🔢 **Full Markdown and LaTeX Support**: Elevate your LLM experience with comprehensive Markdown and LaTeX capabilities for enriched interaction.

- 🎤📹 **Hands-Free Voice/Video Call**: Experience seamless communication with integrated hands-free voice and video call features, allowing for a more dynamic and interactive chat environment.

- 🛠️ **Model Builder**: Easily create Ollama models via the Web UI. Create and add custom characters/agents, customize chat elements, and import models effortlessly through [Open WebUI Community](https://openwebui.com/) integration.

- 🐍 **Native Python Function Calling Tool**: Enhance your LLMs with built-in code editor support in the tools workspace. Bring Your Own Function (BYOF) by simply adding your pure Python functions, enabling seamless integration with LLMs.

- 📚 **Local RAG Integration**: Dive into the future of chat interactions with groundbreaking Retrieval Augmented Generation (RAG) support. This feature seamlessly integrates document interactions into your chat experience. You can load documents directly into the chat or add files to your document library, effortlessly accessing them using the `#` command before a query.

- 🔍 **Web Search for RAG**: Perform web searches using providers like `SearXNG`, `Google PSE`, `Brave Search`, `serpstack`, `serper`, `Serply`, `DuckDuckGo` and `TavilySearch` and inject the results directly into your chat experience.

- 🌐 **Web Browsing Capability**: Seamlessly integrate websites into your chat experience using the `#` command followed by a URL. This feature allows you to incorporate web content directly into your conversations, enhancing the richness and depth of your interactions.

- 🎨 **Image Generation Integration**: Seamlessly incorporate image generation capabilities using options such as AUTOMATIC1111 API or ComfyUI (local), and OpenAI's DALL-E (external), enriching your chat experience with dynamic visual content.

- ⚙️ **Many Models Conversations**: Effortlessly engage with various models simultaneously, harnessing their unique strengths for optimal responses. Enhance your experience by leveraging a diverse set of models in parallel.

- 🔐 **Role-Based Access Control (RBAC)**: Ensure secure access with restricted permissions; only authorized individuals can access your Ollama, and exclusive model creation/pulling rights are reserved for administrators.

- 🌐🌍 **Multilingual Support**: Experience Open WebUI in your preferred language with our internationalization (i18n) support. Join us in expanding our supported languages! We're actively seeking contributors!

- 🌟 **Continuous Updates**: We are committed to improving Open WebUI with regular updates, fixes, and new features.

## Getting Started

### Local Development

**1. Clone the Repository:**

First, you'll need to clone the project's repository from GitHub to your local machine. This will create a copy of the codebase in a directory named `PromptAlchemy`.

```bash
git clone https://github.com/bmd1905/PromptAlchemy.git
cd PromptAlchemy
```

**2. Backend Setup:**

To set up the backend, follow these steps:

- **(Optional) Conda Environment:**

  It's recommended to use a Conda environment to manage dependencies and avoid conflicts with other Python projects. If you don't have Conda installed, you can install it by following the instructions on the [Anaconda website](https://docs.anaconda.com/anaconda/install/).

  ```bash
  conda create --name open-webui-env python=3.11
  conda activate open-webui-env
  ```

- **Install Dependencies:**

  Install the required Python packages using `pip`. The `-r requirements.txt` option ensures all dependencies listed in the `requirements.txt` file are installed. The `-U` flag is used to upgrade packages to the latest version if possible.

  ```bash
  pip install -r requirements.txt -U
  ```

- **Start the Backend Server:**

  After installing the dependencies, you can start the backend server using the provided script. This script will launch the server, making it ready to handle API requests.

  ```bash
  bash start.sh
  ```

**3. Frontend Setup:**

The frontend of the application is located in the `open-webui` directory. To set it up, navigate to the directory and install the necessary dependencies:

```bash
cd open-webui
npm install
```

- **Build and Run the Frontend:**

  Once the dependencies are installed, build the frontend assets and start the development server:

  ```bash
  npm run build
  npm run dev
  ```

  The development server will host the frontend, allowing you to interact with the application via a web browser.

**4. Configuration:**

To configure the application, you'll need to set up environment variables. The `.env.example` file contains example configurations. Copy this file to `.env` and fill in the required variables, such as API keys for language models.

```bash
cp -RPp .env.example .env
```

Edit the `.env` file with your specific configuration details, ensuring that all required environment variables are set.

## Production Deployment

### Using Terraform for Google Kubernetes Engine (GKE)

**1. Set up the Cluster:**

If you're deploying the application to GKE, you can use Terraform to automate the setup of your Kubernetes cluster. Navigate to the `iac/terraform` directory and initialize Terraform:

```bash
cd iac/terraform
terraform init
```


**Plan and Apply Configuration:**

  Generate an execution plan to verify the resources that Terraform will create or modify, and then apply the configuration to set up the cluster:

  ```bash
  terraform plan
  terraform apply
  ```

**2. Retrieve Cluster Information:**

To interact with your GKE cluster, you'll need to retrieve its configuration. You can view the current cluster configuration with the following command:

```bash
cat ~/.kube/config
```

![Init Cluster](assets/gifs/1-init-cluster.gif)

Ensure your `kubectl` context is set correctly to manage the cluster.

### Manual Deployment to GKE

For a more hands-on deployment process, follow these steps:

**1. Deploy Nginx Ingress Controller:**

The Nginx Ingress Controller manages external access to services in your Kubernetes cluster. Create a namespace and install the Ingress Controller using Helm:

```bash
kubectl create ns nginx-system
kubens nginx-system
helm upgrade --install nginx-ingress ./deployments/nginx-ingress
```

Please story the Nginx Ingress Controller's IP address, as you'll need it later.

![Init Nginx Ingress Controller](assets/gifs/2-init-nginx-ingress-controller.gif)

**2. Configure API Key Secret:**

Store your environment variables, such as API keys, securely in Kubernetes secrets. Create a namespace for model serving and create a secret from your `.env` file:

```bash
kubectl create ns model-serving
kubens model-serving
kubectl delete secret promptalchemy-env 
kubectl create secret generic promptalchemy-env --from-env-file=.env -n model-serving
kubectl describe secret promptalchemy-env -n model-serving
```

![Deploy Secret](assets/gifs/3-deploy-secret.gif)

**3. Grant Permissions:**

Kubernetes resources often require specific permissions. Apply the necessary roles and bindings:

```bash
cd deployments/infrastructure
kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml
```

![Grant Permission](assets/gifs/4-grant-permission.gif)

**4. Deploy caching service using Redis:**

Now, deploy the semantic caching service using Redis:
```bash
cd ./deployments/redis
helm dependency build
helm upgrade --install redis .
```

![Deploy Redis](assets/gifs/5-deploy-redis.gif)

**5. Deploy LiteLLM:**

Deploy the [LiteLLM](https://github.com/BerriAI/litellm) service:

```bash
kubens model-serving
helm upgrade --install litellm ./deployments/litellm
```

![Deploy Litellm](assets/gifs/6-deploy-litellm.gif)

**6. Deploy the Open WebUI:**

Next, Deploy the web UI to your GKE cluster:

```bash
cd open-webui
kubectl apply -f ./kubernetes/manifest/base -n model-serving
```

![Deploy Open WebUI](assets/gifs/7-deploy-openwebui.gif)

**7. Play around with the Application:**

Open browser and navigate to the URL of your GKE cluster (e.g. `http://172.0.0.0` in step 1) and add `.nip.io` to the end of the URL (e.g. `http://172.0.0.0.nip.io`). You should see the Open WebUI:

![Final Web App](assets/gifs/8-final-web-app.gif)

### Continuous Integration/Continuous Deployment (CI/CD) with Jenkins and Ansible

For automated CI/CD pipelines, use Jenkins and Ansible as follows:

**1. Set up Jenkins Server:**

First, create a Service Account and assign it the `Compute Admin` role. Then create a Json key file for the Service Account and store it in the `iac/ansible/secrets` directory.

Next create a Google Compute Engine instance named "jenkins-server" running Ubuntu 22.04 with a firewall rule allowing traffic on ports 8081 and 50000.

```bash
ansible-playbook iac/ansible/deploy_jenkins/create_compute_instance.yaml
```

Deploy Jenkins on a server by installing prerequisites, pulling a Docker image, and creating a privileged container with access to the Docker socket and exposed ports 8081 and 50000.

```bash
ansible-playbook -i iac/ansible/inventory iac/ansible/deploy_jenkins/deploy_jenkins.yaml
```

![Create Ansible secrets](assets/gifs/9-create-ansible-secrets.gif)

**2. Access Jenkins:**

To access the Jenkins server through SSH, we need to create a public/private key pair. Run the following command to create a key pair:

```bash
ssh-keygen
```

Open `Metadata` and copy the `ssh-keys` value.

![Create SSH key pair](assets/gifs/10-setup-ssh-key.gif)

We need to find the Jenkins server password to be able to access the server. First, access the Jenkins server:

```bash
ssh <USERNAME>:<EXTERNAL_IP>
```

Then run the following command to get the password:

```bash
sudo docker exec -it jenkins-server bash
cat /var/jenkins_home/secrets/initialAdminPassword
```

![Get Jenkins password](assets/gifs/11-get-jenkins-password.gif)

Once Jenkins is deployed, access it via your browser:
 
```plaintext
http://<EXTERNAL_IP>:8081
```

![Access Jenkins](assets/gifs/12-access-jenkins-server.gif)

**3. Install Jenkins Plugins:**

Install the following plugins to integrate Jenkins with Docker, Kubernetes, and GKE:

- Docker
- Docker Pipeline
- Kubernetes
- Google Kubernetes Engine

After installing the plugins, restart Jenkins.

```bash
sudo docker restart jenkins-server
```

![Install Jenkins Plugins](assets/gifs/13-install-plugins.gif)

**4. Configure Jenkins:**

4.1. Add webhooks to your GitHub repository to trigger Jenkins builds.

Go to the GitHub repository and click on `Settings`. Click on `Webhooks` and then click on `Add Webhook`. Enter the URL of your Jenkins server (e.g. `http://<EXTERNAL_IP>:8081/github-webhook/`). Then click on `Let me select individual events` and select `Let me select individual events`. Select `Push` and `Pull Request` and click on `Add Webhook`.

![Add webhooks to GitHub repository](assets/gifs/14-add-webhooks.gif)

4.2. Add Github repository as a Jenkins source code repository.

Go to Jenkins dashboard and click on `New Item`. Enter a name for your project (e.g. `prompt-alchemy`) and select `Multibranch Pipeline`. Click on `OK`. Click on `Configure` and then click on `Add Source`. Select `GitHub` and click on `Add`. Enter the URL of your GitHub repository (e.g. `https://github.com/bmd1905/PromptAlchemy`). In the `Credentials` field, select `Add` and select `Username with password`. Enter your GitHub username and password (or use a personal access token). Click on `Test Connection` and then click on `Save`.

![Add Github repository as a Jenkins source code repository](assets/gifs/15-add-github-repo.gif)

4.3. Setup docker hub credentials.

First, create a Docker Hub account. Go to the Docker Hub website and click on `Sign Up`. Enter your username and password. Click on `Sign Up`. Click on `Create Repository`. Enter a name for your repository (e.g. `prompt-alchemy`) and click on `Create`.

From Jenkins dashboard, go to `Manage Jenkins` > `Credentials`. Click on `Add Credentials`. Select `Username with password` and click on `Add`. Enter your Docker Hub username, access token, and set `ID` to `dockerhub`.

![Setup docker hub credentials](assets/gifs/16-setup-dockerhub-credentials.gif)

4.4. Setup Kubernetes credentials.

First, create a Service Account for the Jenkins server to access the GKE cluster. Go to the GCP console and navigate to IAM & Admin > Service Accounts. Create a new service account with the `Kubernetes Engine Admin` role. Give the service account a name and description. Click on the service account and then click on the `Keys` tab. Click on `Add Key` and select `JSON` as the key type. Click on `Create` and download the JSON file.

![Setup Kubernetes credentials](assets/gifs/17-setup-kubernetes-credentials.gif)

Then, from Jenkins dashboard, go to `Manage Jenkins` > `Cloud`. Click on `New cloud`. Select `Kubernetes`. Enter the name of your cluster (e.g. `gke-prompt-alchemy-cluster-1), enter the URL and Certificate from your GKE cluster. In the `Kubernetes Namespace`, enter the namespace of your cluster (e.g. `model-serving`). In the `Credentials` field, select `Add` and select `Google Service Account from private`. Enter your project-id and the path to the JSON file.

![Setup Kubernetes credentials](assets/gifs/18-setup-kubernetes-credentials.gif)

**5. Test the setup:**

Push a new commit to your GitHub repository. You should see a new build in Jenkins.

![Test the setup](assets/gifs/19-test-cicd.gif)


### Monitoring with Prometheus and Grafana

**1. Create Discord webhook:**

First, create a Discord webhook. Go to the Discord website and click on `Server Settings`. Click on `Integrations`. Click on `Create Webhook`. Enter a name for your webhook (e.g. `prompt-alchemy-discord-webhook`) and click on `Create`. Copy the webhook URL.

![Create Discord webhook](assets/gifs/20-create-discord-webhook.gif)


**2. Configure Helm Repositories**

First, we need to add the necessary Helm repositories for Prometheus and Grafana:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

These commands add the official Prometheus and Grafana Helm repositories and update your local Helm chart information.

**3. Install Dependencies**

Prometheus requires certain dependencies that can be managed with Helm. Navigate to the monitoring directory and build these dependencies:

```bash
helm dependency build ./deployments/monitoring/kube-prometheus-stack
```

**4. Deploy Prometheus**

Now, we'll deploy Prometheus and its associated services using Helm:

```bash
kubectl create namespace monitoring
helm upgrade --install -f deployments/monitoring/kube-prometheus-stack.expanded.yaml kube-prometheus-stack deployments/monitoring/kube-prometheus-stack -n monitoring
```

This command does the following:
- `helm upgrade --install`: This will install Prometheus if it doesn't exist, or upgrade it if it does.
- `-f deployments/monitoring/kube-prometheus-stack.expanded.yaml`: This specifies a custom values file for configuration.
- `kube-prometheus-stack`: This is the release name for the Helm installation.
- `deployments/monitoring/kube-prometheus-stack`: This is the chart to use for installation.
- `-n monitoring`: This specifies the namespace to install into.

![Deploy Prometheus](assets/gifs/21-start-monitoring-services.gif)

By default, the services are not exposed externally. To access them, you can use port-forwarding:

For Prometheus:
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090
```
Then access Prometheus at `http://localhost:9090`

For Grafana:
```bash
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80
```
Then access Grafana at `http://localhost:3000`

The default credentials for Grafana are usually:
- Username: admin
- Password: prom-operator (you should change this immediately)

![Access Prometheus and Grafana](assets/gifs/22-access-prom-graf.gif)

**5. Test Alerting**

First we need to create a sample alert. Navigate to the `monitoring` directory and run the following command:

```bash
kubectl port-forward -n monitoring svc/alertmanager-operated 9093:9093
```

Then, in a new terminal, run the following command:

```bash
curl -XPOST -H "Content-Type: application/json" -d '[
  {
    "labels": {
      "alertname": "DiskSpaceLow",
      "severity": "critical",
      "instance": "server02",
      "job": "node_exporter",
      "mountpoint": "/data"
    },
    "annotations": {
      "summary": "Disk space critically low",
      "description": "Server02 has only 5% free disk space on /data volume"
    },
    "startsAt": "2023-09-01T12:00:00Z",
    "generatorURL": "http://prometheus.example.com/graph?g0.expr=node_filesystem_free_bytes+%2F+node_filesystem_size_bytes+%2A+100+%3C+5"
  },
  {
    "labels": {
      "alertname": "HighMemoryUsage",
      "severity": "warning",
      "instance": "server03",
      "job": "node_exporter"
    },
    "annotations": {
      "summary": "High memory usage detected",
      "description": "Server03 is using over 90% of its available memory"
    },
    "startsAt": "2023-09-01T12:05:00Z",
    "generatorURL": "http://prometheus.example.com/graph?g0.expr=node_memory_MemAvailable_bytes+%2F+node_memory_MemTotal_bytes+%2A+100+%3C+10"
  }
]' http://localhost:9093/api/v2/alerts
```

This command creates a sample alert. You can verify that the alert was created by running the following command:

```bash
curl http://localhost:9093/api/v2/status
```

Or, you can manually check the Discord channel.

![Discord alert](assets/gifs/23-discord-alert.gif)

---

This setup provides comprehensive monitoring capabilities for your Kubernetes cluster. With Prometheus collecting metrics and Grafana visualizing them, you can effectively track performance, set up alerts for potential issues, and gain valuable insights into your infrastructure and applications.

## Contributing
We welcome contributions to PromptAlchemy! Please see our CONTRIBUTING.md for more information on how to get started.

## License
PromptAlchemy is released under the MIT License. See the LICENSE file for more details.

## Citation
If you use PromptAlchemy in your research, please cite it as follows:
```
@software{PromptAlchemy2024,
  author = {Minh-Duc Bui},
  title = {PromptAlchemy: Transform basic queries into sophisticated prompts},
  year = {2024},
  url = {https://github.com/bmd1905/PromptAlchemy}
}
```

## Contact
For questions, issues, or collaborations, please open an issue on our GitHub repository or contact the maintainers directly.
