import _ from 'lodash'
import { auth, getRedirectResult, signInWith } from '@/services/firebase.client'

const state = () => {
  return {
    user: null
  }
}

const mutations = {
  setUser (state, userData) {
    const fields = ['uid', 'displayName', 'email', 'emailVerified', 'photoURL']
    const user = _.pick(userData, fields)
    state.user = user
  }
}

const actions = {
  async init ({ commit, state }) {
    const redirectUser = await getRedirectResult()
    if (redirectUser) commit('setUser', redirectUser)

    auth.onAuthStateChanged((user) => {
      if (user) commit('setUser', user)
    })
  },
  signInWithRedirect () {
    signInWith('google')
  },
  async signOut ({ commit, state }) {
    await auth.signOut()
    commit('setUser', null)
  }
}

const getters = {}

export const strict = false
export default { state, mutations, actions, getters }
