import _ from 'lodash'
import mongoose from 'mongoose'

const getModel = () => {
  if (!mongoose.models['User']) {
    return mongoose.model('User', { name: String })
  } else {
    return mongoose.models['User']
  }
}

// returns a promise
const createUser = (name) => {
  const User = getModel()
  const user = new User({ name })
  return user.save()
}

export {
  createUser
}
