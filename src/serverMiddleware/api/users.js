import _ from 'lodash'
import { createUser } from '../../database/models/User'

const getRequestBody = (req) => {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => body += chunk.toString())
    req.on('end', () => resolve(JSON.parse(body)))
  })
}

export default async function (req, res) {
  const method = _.toLower(req.method)

  switch (req.url) {
    case '/users/create-user':
      if (method === 'post') {
        const postBody = await getRequestBody(req)
        const dbUser = await createUser(postBody.name)

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ user: dbUser }))
      }
      
      break
    default:
      console.log(`/api${req.url} was not handled`)
  }
}
