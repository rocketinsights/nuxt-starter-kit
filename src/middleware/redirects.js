import _ from 'lodash'
const redirects = require('./redirects.json')

export default function (req, res, next) {
  const incomingProtocol = req.headers['x-forwarded-proto']
  const redirectProtocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  const subdomain = _.chain(req.headers.host).split('.').first().toLower().value()
  if (subdomain === 'www' || incomingProtocol === 'http') {
    const apexDomain = `${redirectProtocol}://${req.headers.host.replace('www.', '')}${req.url}`
    res.writeHead(308, { Location: apexDomain })
    return res.end()
  }

  // find the redirect if it exists where the from === the requested url
  const redirect = redirects.find(r => r.from === req.originalUrl)

  // If it exists, redirect the page with a 308 response else carry on
  if (redirect) {
    res.writeHead(308, { Location: redirect.to })
    res.end()
  } else {
    next()
  }
}
