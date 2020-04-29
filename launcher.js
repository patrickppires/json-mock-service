const fs = require('fs-extra')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const logger = require('./lib/logger')
const routes = require('./lib/routes')
const requestMiddleware = require('./middleware/request')
const errorHandling = require('./middleware/error-handling')
const DEFAULT_LOG_NAME = 'json-mock-server.log'
module.exports = class MockServerLauncher {
    onPrepare ({
        outputDir,
        mockServerPort: port = 4567,
        mockServerWorkdir: workdir = './mock',
        mockLoglevel: logLevel = 'info'
    }) {
        this.server = express()
        this.port = port
        this.server.logger = logger
        this.server.logger.setLevel(logLevel)

        this.server.use(bodyParser.json())
        this.server.use(bodyParser.urlencoded({extended: true}))
        requestMiddleware(this.server)
        errorHandling(this.server)

        if (outputDir) {
            const file = path.join(outputDir, DEFAULT_LOG_NAME)
            fs.createFileSync(file)
            const stream = fs.createWriteStream(file)
            this.server.use(morgan('tiny', { stream }))
        }
        routes({app: this.server, workdir})

        return new Promise((resolve, reject) => this.server.listen(this.port, (err) => {
            /* istanbul ignore next */
            if (err) {
                this.server.logger.error(`Couldn't start mock server: ${err.message}`)
                return reject(err)
            }

            this.server.logger.info(`Mock server running at http://localhost:${port}`)
            resolve()
        }).once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                this.server.logger.info(`Port ${this.port} already in use, skipping start mock server`)
                return resolve()
            }
            reject(err)
        }))
    }
}
