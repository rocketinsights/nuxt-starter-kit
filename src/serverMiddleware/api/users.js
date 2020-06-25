import _ from 'lodash'
import { createUser, listUsers } from '../../database/models/User'

const getRequestBody = (req) => {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => body += chunk.toString())
    req.on('end', () => resolve(JSON.parse(body)))
  })
}

export default async function (req, res) {
  const method = _.toLower(req.method)
  res.setHeader('Content-Type', 'application/json')

  if (req.url === '/users/create' && method === 'post') {
    const postBody = await getRequestBody(req)
    console.log('creation time', postBody)
    const dbUser = await createUser(postBody.name)
    return res.end(JSON.stringify({ user: dbUser }))
  }

  if (req.url === '/users/list' && method === 'get') {
    const users = await listUsers()
    return res.end(JSON.stringify({ users }))
  }

  res.end(JSON.stringify({
    error: `/api${req.url} was not handled`,
    method
  }))
}
