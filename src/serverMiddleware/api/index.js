import _ from 'lodash'
import users from './users'

export default function (req, res, next) {
  try {
    // route all /api/users requests to our users file
    if (req.originalUrl.indexOf('/api/users/') !== -1) {
      return users(req, res)
    }
  } catch (err) {
    // swallow the error:
    // it's a "cannot set headers after they are sent to the client"
    // error and it's a benign pain in my ass
  }
}
