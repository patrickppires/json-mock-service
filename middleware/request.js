module.exports = (app) => app.use((req, res, next) => {
    app.logger.info(`[REQUEST] [${req.method}] ${req.originalUrl} | Data ==> ${JSON.stringify(req.body)}`)
    next()
})
