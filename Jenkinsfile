pipeline {
  agent any

  environment {
    APP_DIR = '.'
    PART2_COMPOSE = 'docker-compose.part2.yml'
  }

  triggers {
    githubPush()
  }

  options {
    timestamps()
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Containerized Build') {
      steps {
        sh 'docker run --rm -v "$WORKSPACE/$APP_DIR:/app" -w /app node:20-alpine sh -c "npm ci"'
      }
    }

    stage('Deploy Part-II Stack') {
      steps {
        sh 'docker compose -f "$PART2_COMPOSE" up -d'
        sh 'docker compose -f "$PART2_COMPOSE" ps'
      }
    }
  }

  post {
    always {
      sh 'docker compose -f "$PART2_COMPOSE" ps || true'
    }
  }
}
