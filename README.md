

<div align="center">

# PromptAlchemy (WIP)
[![Stars](https://img.shields.io/github/stars/bmd1905/PromptAlchemy.svg)](https://api.github.com/repos/bmd1905/PromptAlchemy)

 Transform basic queries into sophisticated prompts for exceptional results.

 </div>

 [![Pipeline](./assets/prompt_alchemy.png)](#features)

 ## Target Audience: Developers

**PromptAlchemy** is a powerful, open-source library designed to transform basic user prompts into sophisticated prompts capable of unlocking the full potential of language models. By leveraging advanced techniques like Chain-of-Thought, Few-Shot Learning, and more, PromptAlchemy empowers developers and researchers to build more intelligent and effective applications.


## Features

- **Intuitive API**: Easily integrate PromptAlchemy into your projects with a clean and well-documented API
- **Versatile Techniques**: Apply a range of prompt engineering strategies, including:
    - Chain-of-Thought (CoT)
    - Few-Shot Learning
    - Zero-Shot Learning
    - Task-specific prompting
    - Multi-task prompting
- **Customizable**: Tailor the transformation process to your specific needs.
- **Extensible**: Easily add new prompt engineering techniques as they emerge in the field.
- **Performance Metrics**: Built-in tools to measure and compare the effectiveness of different prompting strategies.


## Local Development
### Frontend
```bash
cd ui/promptalchemy-ui

# Build docker image
make build

# Run docker image
make run
```

### Backend
```bash
cd api
docker build -t bmd1905/promptalchemy_local --platform=linux/amd64 .
docker run -it -p 30000:30000 -p 4000:4000 --env-file .env bmd1905/promptalchemy_local
```

You can then access:
- FastAPI docs at http://localhost:30000/docs
- LiteLLM docs at http://localhost:4000/docs

## Production Deployment

### Setup Cluster with Terraform

```bash
cd iac/terraform

terraform init
terraform plan
terraform apply
```

Get cluster info:
```bash
cat ~/.kube/config
```

### Start Service on GKE Manually

Deploy NGINX-ingress
```shell
kubectl create ns nginx-system
kubens nginx-system
helm upgrade --install nginx-ingress ./deployments/nginx-ingress
```

Setup secret for API Key:
```bash
kubectl create ns model-serving
kubens model-serving

cd deployments/promptalchemy

k create secret generic promptalchemy-env --from-env-file=.env -n model-serving
k describe secret promptalchemy-env -n model-serving
```

Grant permission
```bash
cd deployments/infrastructure
kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml
```

Deploy model:
```bash
kubens model-serving
helm upgrade --install promptalchemy ./deployments/promptalchemy --debug --force
```

For more detailed frontend setup instructions, please refer to `ui/promptalchemy-ui/README.md`

### Setup Jenkins with Ansible
First create a Google Compute Engine instance named "jenkins-server" running Ubuntu 22.04 with a firewall rule allowing traffic on ports 8081 and 50000 from any source.
```bash
ansible-playbook iac/ansible/deploy_jenkins/create_compute_instance.yaml
```

Then deploy Jenkins on a server by installing prerequisites, pulling a Docker image, and creating a privileged container with access to the Docker socket and exposed ports 8081 and 50000.

```bash
ansible-playbook -i iac/ansible/inventory iac/ansible/deploy_jenkins/deploy_jenkins.yaml
```

Connect Jenkins UI through external IP address at port 8081: http://<EXTERNAL_IP>:8081

Install plugins: `Dashboard` > `Manage Jenkins` > `Plugins` > `Available Plugins` > Search for `Docker`, `Docker Pipeline`, `Kubernetes`, `GCloud SDK`, & `Google Kubernetes Engine` then click `Install`.

Setup Github repo

Add credential for DockerHub

Add credential for GKE cluster

Connect to GKE cluster

```bash
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=system:anonymous

kubectl create clusterrolebinding cluster-admin-default-binding --clusterrole=cluster-admin --user=system:serviceaccount:model-serving:default

# Test credential
kubectl auth can-i create pods --as=system:serviceaccount:model-serving:default
```

## 📝 To-Do List

### 🚀 Deployment
- [x] Implement core features (FastAPI + LiteLLM + Redis)
- [x] Set up CI pipeline (Jenkins)
- [x] IaC (Ansible + Terraform)
- [ ] Monitoring (Grafana + Prometheus + Jaeger + Alert)
- [ ] Set up CD pipeline (Argo CD)
- [ ] Optimize performance (Batching)

### 📚 Documentation
- [ ] Write user guide
- [ ] Create tutorials and examples

### 🌟 Post-Launch
- [ ] Gather user feedback
- [ ] Implement enhancements
- [ ] Plan for future updates

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
