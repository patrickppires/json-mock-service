const fs = require('fs-extra')
const path = require('path')
const loader = require('./loader')
const render = require('./renderTemplate')

module.exports = async ({app, workdir}) => loader(workdir)
    .then(files => files.forEach(file => parseRoute(file, app, workdir)))

const parseRoute = (file, app, workdir) => {
    fs.readFile(path.resolve(file), 'utf8', (_err, content) => {
        if (_err) throw new Error(_err)
        content = JSON.parse(content)
        registerRoute({
            app,
            method: content.request.method,
            url: content.request.url,
            statusCode: content.response.status,
            body: content.response.body,
            bodyFileName: content.response.bodyFileName,
            attachment: content.response.attachment,
            workdir,
            replace: content.replace
        })
        app.logger.debug(`[${content.request.method}] ${content.request.url}`)
    })
}

const registerRoute = ({app, method, url, statusCode, body, bodyFileName, attachment, workdir, replace}) => {
    app[method](url, (req, res) => {
        res.status(statusCode || 200)
        attachment !== undefined ? sendFile(workdir, attachment, replace, req, res) : send(body || path.resolve(workdir, '__files', bodyFileName), replace, req, res)
        res.end()
    })
}

const sendFile = (workdir, file, replace, req, res) => res.attachment(path.basename(file))
    .send(processTemplate(path.resolve(workdir, '__files', file), req, res, replace))

const send = (body, replace, req, res) => res
    .send(processTemplate(body, req, res, replace))

const processTemplate = (file, request, response, replace) => render(file, request, response, replace)
