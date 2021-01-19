import _ from 'lodash'
import bodyParser from 'body-parser'
import cors from 'cors'
import mux from './mux'

const app = require('express')()

app.use(bodyParser.json({ limit: '250kb' }))
app.use(cors())
app.use('/mux', mux)

app.get('/healthcheck', (req, res) => {
  return res.status(200).json({ status: 200 })
})

export default app
