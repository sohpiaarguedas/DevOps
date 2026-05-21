pipeline {
    agent any

    stages {

        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }

        stage('Ejecutar pruebas') {
            steps {
                bat 'npm test'
            }
        }
    }
}