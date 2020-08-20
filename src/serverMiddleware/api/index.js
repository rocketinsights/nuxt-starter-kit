import _ from 'lodash'

const _getRequestBody = (req) => {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => body += chunk.toString())
    req.on('end', () => resolve(JSON.parse(body)))
  })
}

export default function (req, res, next) {
  const method = _.toLower(req.method)
  res.setHeader('Content-Type', 'application/json')

  if (!_.includes(req.originalUrl, '/api/')) {
    // not an api route, exit early
    console.log('This should not happen. Make sure serverMiddleware is setup correctly for the api in nuxt.config.js')
    return next()
  }

  try {
    if (req.url == '/healthcheck' && method === 'get') {
      return res.end(JSON.stringify({ statusCode: 200 }))
    }
  } catch (err) {
    // swallow the error:
    // it's a "cannot set headers after they are sent to the client"
    // error and it's a benign pain in my ass
  }
}
