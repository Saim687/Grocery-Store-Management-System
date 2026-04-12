pipeline {
  agent any

  triggers {
    githubPush()
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Containerized Build') {
      steps {
        sh 'docker run --rm -v "$WORKSPACE:/app" -w /app node:20-alpine sh -c "npm ci"'
      }
    }

    stage('Deploy Part-II Stack') {
      steps {
        sh 'docker compose -f docker-compose.part2.yml up -d'
        sh 'docker compose -f docker-compose.part2.yml ps'
      }
    }
  }

  post {
    always {
      sh 'docker compose -f docker-compose.part2.yml ps || true'
    }
  }
}
