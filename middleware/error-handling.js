module.exports = (app) => app.use(function (err, req, res, next) {
    app.logger.error(err)
    res.status(500).send('Ocorreu um erro interno!')
})
