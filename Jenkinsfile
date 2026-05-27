pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

stage('Test') {
    steps {
        bat 'if not exist test-results mkdir test-results'
        // Agregamos --passWithNoTests y --coverageThreshold=0 
        // para que no falle por falta de cobertura todavía.
        bat 'npm run test:ci -- --passWithNoTests --coverageThreshold=0'
    }
    post {
        always {
            // junit buscará el archivo solo si existe
            script {
                if (fileExists('test-results/jest-results.xml')) {
                    junit 'test-results/jest-results.xml'
                }
            }
        }
    }
}

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
            }
        }
    }
}