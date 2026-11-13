pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'trainerselva/jenkins-k8s'
        // Replace with the Public IP of your K8s Master EC2 instance
        KUBE_API = 'https://98.87.5.160:6443' 
    }
    stages {
        stage('Checkout Code') {
            steps { checkout scm }
        }
        
        stage('Execute Tests') {
            agent {
                docker {
                    image 'node:alpine';
                    args '-u root:root';
                    reuseNode true 
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm test' // Pipeline halts here if tests fail
            }
        }
        
        stage('Build & Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                    sh "echo \$PASS | docker login -u \$USER --password-stdin"
                    sh "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                    sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                }
            }
        }
        
        stage('Deploy to Kubernetes Cluster') {
            steps {
                sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
                sh 'chmod +x kubectl'
                
                sh "sed -i 's/__BUILD_NUMBER__/${env.BUILD_NUMBER}/g' k8s.yaml"
                
                withCredentials([string(credentialsId: 'k8s-token', variable: 'K8S_TOKEN')]) {
                    sh "./kubectl --server=${KUBE_API} --token=\$K8S_TOKEN --insecure-skip-tls-verify apply -f k8s.yaml"
                }
            }
        }
    }
}
