import _ from 'lodash'
import { connect, client } from '../../database'

export default async function (req, res, next) {
  if (!_.isEmpty(client.connections)) next()
  await connect()
  next()
}
