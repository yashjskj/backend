pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'yashjskj/private-registry/backend:latest'
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
                    sh 'kubectl apply -f k8s/mongodb-service.yaml'
                    sh 'kubectl apply -f k8s/mongodb-deployment.yaml'
                    sh 'kubectl apply -f k8s/backend-service.yaml'
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    
                    // Rollout restarts to ensure changes are applied
                    sh 'kubectl rollout restart deployment/mongodb -n mongodb'
                    sh 'kubectl rollout restart deployment/backend -n backend'

                    // Adding sleep for 50 seconds
                    echo 'Waiting for 50 seconds to ensure service are running...'
                    sleep 50
                    
                    // Verify if MongoDB deployment is successful
                    def mongodbPodStatus = sh(script: 'kubectl get pods -n mongodb -l app=mongodb -o jsonpath="{.items[0].status.phase}"', returnStdout: true).trim()
                    if (mongodbPodStatus != 'Running') {
                        echo "MongoDB pod is not running, initiating rollback..."
                        // Rollback MongoDB deployment if it's not running
                        sh 'kubectl rollout undo deployment/mongodb -n mongodb'
                        currentBuild.result = 'FAILURE' // Mark the build as failed
                    }

                    // Verify if Backend deployment is successful
                    def backendPodStatus = sh(script: 'kubectl get pods -n backend -l app=backend -o jsonpath="{.items[0].status.phase}"', returnStdout: true).trim()
                    if (backendPodStatus != 'Running') {
                        echo "Backend pod is not running, initiating rollback..."
                        // Rollback Backend deployment if it's not running
                        sh 'kubectl rollout undo deployment/backend -n backend'
                        currentBuild.result = 'FAILURE' // Mark the build as failed
                    }
                }
            }
        }
    }
}
