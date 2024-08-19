

<div align="center">

# PromptAlchemy
[![Stars](https://img.shields.io/github/stars/bmd1905/PromptAlchemy.svg)](https://api.github.com/repos/bmd1905/PromptAlchemy)

 Transform basic queries into sophisticated prompts for exceptional results.

 </div>


 [![Pipeline](./assets/prompt_alchemy.png)](#features)

 ## Target Audience: Developers

**PromptAlchemy** is a powerful, open-source library designed to transform basic user prompts into sophisticated prompts capable of unlocking the full potential of language models. By leveraging advanced techniques like Chain-of-Thought, Few-Shot Learning, and more, PromptAlchemy empowers developers and researchers to build more intelligent and effective applications.


## Features

- **Intuitive API**: Easily integrate PromptAlchemy into your projects.
- **Versatile Techniques**: Apply a range of prompt engineering strategies.
- **Customizable**: Tailor the transformation process to your specific needs.


## Setup

### Docker local
```
docker build -t bmd1905/promptalchemy .
docker run -p 30000:30000 --env-file .env bmd1905/promptalchemy
```

### Jenkins as CI
Start Jenkins server:
```
# Port 8082
docker compose -f docker-compose-jenkins.yaml up --build

# Get Jenkins password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Manual CD (implement ArgoCD later)
```
# Build
docker build -t bmd1905/promptalchemy_local .

# Then run
docker run -ti -p 30002:30000 --env-file .env bmd1905/promptalchemy_local
```
