pipeline {
    agent any

    options {
        // Limit the number of builds and the days to keep logs
        buildDiscarder(logRotator(numToKeepStr: '5', daysToKeepStr: '5'))
        // Enable timestamps for each job in the pipeline
        timestamps()
        // Fail the pipeline if any stage fails
        disableConcurrentBuilds()
        skipDefaultCheckout()
    }

    environment {
        DOCKER_IMAGE = 'bmd1905/promptalchemy'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_FULL_IMAGE = "${DOCKER_IMAGE}:${DOCKER_TAG}"
        DOCKER_REGISTRY_CREDENTIAL = 'dockerhub'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Check out the source code
                checkout scm
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo 'Running tests...'
                    // Assuming tests can be run with a script or command
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

        stage('Deploy') {
            when {
                branch 'main'  // Only deploy when on the main branch
            }
            steps {
                script {
                    echo "Deploying ${DOCKER_FULL_IMAGE}..."
                    // Add your deployment steps here
                    // Example: sh './deploy.sh'
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
                // Add any notification or cleanup steps here
            }
        }
        cleanup {
            script {
                echo 'Cleaning up...'
                // Optional: Clean up unused Docker images to save space
                sh 'docker image prune -f'
            }
        }
    }
}
