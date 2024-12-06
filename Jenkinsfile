pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'yashjskj/backend:latest'
    }
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }
        stage('Push to Docker Registry') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker-credentials', url: '']) {
                        sh 'docker push $DOCKER_IMAGE'
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f k8s/secret.yaml'
                    sh 'kubectl apply -f k8s/mongodb-pv.yaml'
                    sh 'kubectl apply -f k8s/mongodb-pvc.yaml'
                    sh 'kubectl apply -f k8s/mongodb-service.yaml'
                    sh 'kubectl apply -f k8s/mongodb-deployment.yaml'
                    // Adding sleep for 5 seconds
                    echo 'Waiting for 5 seconds to ensure MongoDB stabilizes...'
                    sleep 10
                    sh 'kubectl apply -f k8s/backend-service.yaml'
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl rollout restart deployment/mongodb -n multi-service-app'
                    sh 'kubectl rollout restart deployment/backend -n multi-service-app'
                    
                    
                }
            }
        }
    }
}

