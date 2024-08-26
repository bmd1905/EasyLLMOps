

<div align="center">

# PromptAlchemy (WIP)
[![Stars](https://img.shields.io/github/stars/bmd1905/PromptAlchemy.svg)](https://api.github.com/repos/bmd1905/PromptAlchemy)

 Transform basic queries into sophisticated prompts for exceptional results.

 </div>

 [![Pipeline](./assets/prompt_alchemy.png)](#features)

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

**2. Configure API Key Secret:**

Store your environment variables, such as API keys, securely in Kubernetes secrets. Create a namespace for model serving and create a secret from your `.env` file:

```bash
kubectl create ns model-serving
kubens model-serving
kubectl delete secret promptalchemy-env 
kubectl create secret generic promptalchemy-env --from-env-file=.env -n model-serving
kubectl describe secret promptalchemy-env -n model-serving
```

**3. Grant Permissions:**

Kubernetes resources often require specific permissions. Apply the necessary roles and bindings:

```bash
cd deployments/infrastructure
kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml
```

**4. Deploy LiteLLM:**

Deploy the [LiteLLM](https://github.com/BerriAI/litellm) service:

```bash
kubens model-serving
helm upgrade --install litellm ./deployments/litellm
```

**5. Deploy the Open WebUI:**

Next, Deploy the web UI to your GKE cluster:

```bash
cd open-webui
kubens model-serving
kubectl apply -f ./kubernetes/manifest/base
```

**6. Deploy semantic caching service using Redis:**

Now, deploy the semantic caching service using Redis:
```bash
cd ./deployments/redis
helm dependency build
helm upgrade --install redis .
```

### Continuous Integration/Continuous Deployment (CI/CD) with Jenkins and Ansible

For automated CI/CD pipelines, use Jenkins and Ansible as follows:

**1. Set up Jenkins Server:**

Create a Google Compute Engine instance for Jenkins. Ensure it's accessible on the necessary ports:

- **Instance Name:** jenkins-server
- **OS:** Ubuntu 22.04
- **Ports:** Allow traffic on 8081 (Jenkins UI) and 50000 (Jenkins agent).

**2. Deploy Jenkins:**

Use Ansible to automate the deployment of Jenkins on your instance:

```bash
ansible-playbook -i iac/ansible/inventory iac/ansible/deploy_jenkins/deploy_jenkins.yaml
```

**3. Access Jenkins:**

Once Jenkins is deployed, access it via your browser:

```plaintext
http://<EXTERNAL_IP>:8081
```

**4. Install Jenkins Plugins:**

Install the following plugins to integrate Jenkins with Docker, Kubernetes, and GKE:

- Docker
- Docker Pipeline
- Kubernetes
- GCloud SDK
- Google Kubernetes Engine

**5. Configure Jenkins:**

Set up your GitHub repository in Jenkins, and add the necessary credentials for DockerHub and GKE.

### Monitoring with Prometheus

To monitor your deployed application, follow these steps:

**1. Install Dependencies:**

Prometheus requires certain dependencies that can be managed with Helm. Navigate to the monitoring directory and build these dependencies:

```bash
cd deployments/monitoring/kube-prometheus-stack
helm dependency build
```

**2. Deploy Prometheus:**

Deploy Prometheus and its associated services using Helm:

```bash
helm upgrade --install -f deployments/monitoring/kube-prometheus-stack.expanded.yaml kube-prometheus-stack deployments/monitoring/kube-prometheus-stack -n monitoring
```

This setup will provide monitoring capabilities for your Kubernetes cluster, ensuring you can track performance and troubleshoot issues.


## 📝 To-Do List

### 🚀 Deployment
- [x] Implement core features
- [x] Set up CI pipeline (Jenkins)
- [x] IaC (Ansible + Terraform)
- [x] Monitoring (Grafana + Prometheus + Alert)
- [x] Caching chatbot responses (Redis)
- [ ] Tracing (Jaeger)
- [ ] Set up CD pipeline (Argo CD)
- [ ] Optimize performance (Batching)

### 🌟 Post-Launch
- [ ] Create tutorials and examples
- [ ] Gather user feedback
- [ ] Implement enhancements

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
