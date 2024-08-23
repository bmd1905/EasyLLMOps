pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5', daysToKeepStr: '5'))
        timestamps()
    }

    environment {
        DOCKER_IMAGE = 'bmd1905/promptalchemy'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_FULL_IMAGE = "${DOCKER_IMAGE}:${DOCKER_TAG}"
        DOCKER_REGISTRY_CREDENTIAL = 'dockerhub'
    }

    stages {
        stage('Run Tests') {
            steps {
                script {
                    echo 'Running tests...'
                    // Uncomment and adjust as needed
                    // sh './run-tests.sh'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker image...'
                    dir('api') {
                        dockerImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "--platform=linux/amd64 .")
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo 'Pushing Docker image to the registry...'
                    docker.withRegistry('', DOCKER_REGISTRY_CREDENTIAL) {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy to Google Kubernetes Engine') {
            agent {
                kubernetes {
                    yaml '''
                        apiVersion: v1
                        kind: Pod
                        spec:
                          containers:
                          - name: helm
                            image: bmd1905/jenkins-k8s:lts-jdk17
                            imagePullPolicy: Always
                            command:
                            - cat
                            tty: true
                    '''
                }
            }
            steps {
                script {
                    container('helm') {
                        sh("helm upgrade --install promptalchemy ./deployments/promptalchemy --debug --namespace model-serving")
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                echo 'Build and Deployment successful.'
            }
        }
        failure {
            script {
                echo 'Build or Deployment failed!'
            }
        }
        cleanup {
            script {
                echo 'Cleaning up...'
                sh 'docker image prune -f'
            }
        }
    }
}
