pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {

        stage('Clonar repositorio') {
            steps {
                checkout scm
                echo "hola, paso 1"
            }
        }

        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
                echo "hola, paso 2"
            }
        }

        stage('Ejecutar pruebas') {
            steps {
                bat 'npm test'
            }
        }
    }
}