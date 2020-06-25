import _ from 'lodash'
import mongoose from 'mongoose'

const { MONGO_DB_USER, MONGO_DB_PASS, MONGO_DB_PATH } = process.env
const MONGO_URI = `mongodb://${MONGO_DB_USER}:${encodeURIComponent(MONGO_DB_PASS)}@${MONGO_DB_PATH}`
let client = {}

const connect = () => {
  try {
    client = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    return client
  } catch (err) {
    console.log('Failed to connect to MongoDB', err.message)
  }
}

export { connect, client }
