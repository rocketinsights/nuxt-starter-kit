import _ from 'lodash'
import mongoose from 'mongoose'

// this is to skirt HMR issues in dev
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

const listUsers = async () => {
  const User = getModel()
  const users = await User.find().exec()
  return users
}

export {
  createUser,
  listUsers
}
