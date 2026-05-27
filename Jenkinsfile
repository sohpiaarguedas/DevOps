// ═══════════════════════════════════════════════════════════════
//  Jenkinsfile — PetLog Vue CRUD
//  Pipeline declarativo para CI con Jest
//
//  Requisitos del agente:
//    · Node.js >= 18 disponible (vía nvm o herramienta Jenkins Node)
//    · Plugin "JUnit" instalado en Jenkins   (para publicar resultados)
//    · Plugin "HTML Publisher" instalado      (para publicar cobertura)
//
//  Variables de entorno configurables en Jenkins > Manage > System:
//    · NODE_VERSION  (default: '18')
// ═══════════════════════════════════════════════════════════════

pipeline {

    agent any

    // ── Herramientas (requiere configuración en Jenkins > Tools) ──
    // Si usas nvm o Node ya está en el PATH, puedes quitar este bloque.
    // tools {
    //     nodejs 'node-18'   // nombre del tool configurado en Jenkins
    // }

    environment {
        // Colores en la salida de Jest dentro de Jenkins
        FORCE_COLOR = '0'
        // Archivo de reporte JUnit que Jest genera
        JEST_JUNIT_OUTPUT_DIR  = 'test-results'
        JEST_JUNIT_OUTPUT_NAME = 'jest-results.xml'
    }

    stages {

        // ── 1. Checkout ──────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ── 2. Instalar dependencias ──────────────────────────────
        stage('Install') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                // `ci` usa package-lock.json para instalación reproducible
                sh 'npm ci'
            }
        }

        // ── 3. Pruebas unitarias + cobertura ──────────────────────
        stage('Test') {
            steps {
                // Crea el directorio de resultados si no existe
                sh 'mkdir -p test-results'

                // Ejecuta Jest en modo CI:
                //   --ci          → falla si hay snapshots sin actualizar
                //   --coverage    → genera informe de cobertura
                //   --forceExit   → evita que Jest quede colgado en CI
                sh 'npm run test:ci'
            }
            post {
                always {
                    // Publica el reporte JUnit en la interfaz de Jenkins
                    junit(
                        testResults:          'test-results/jest-results.xml',
                        allowEmptyResults:    false,
                        skipPublishingChecks: false
                    )

                    // Publica el HTML de cobertura (Istanbul / V8)
                    publishHTML(target: [
                        allowMissing:          false,
                        alwaysLinkToLastBuild: true,
                        keepAll:               true,
                        reportDir:             'coverage/lcov-report',
                        reportFiles:           'index.html',
                        reportName:            'Cobertura Jest'
                    ])
                }
            }
        }

        // ── 4. Archivar artefactos ────────────────────────────────
        stage('Archive') {
            steps {
                archiveArtifacts(
                    artifacts:     'coverage/**,test-results/**',
                    allowEmptyArchive: false
                )
            }
        }
    }

    // ── Notificaciones post-pipeline ─────────────────────────────
    post {
        success {
            echo "✅ Pipeline completado — todas las pruebas pasaron."
        }
        failure {
            echo "❌ Pipeline fallido — revisa el stage 'Test' y los reportes."
        }
        unstable {
            echo "⚠️  Pipeline inestable — algunas pruebas fallaron."
        }
        always {
            // Limpia el workspace para no acumular artefactos entre builds
            cleanWs()
        }
    }
}
