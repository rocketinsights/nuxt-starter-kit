export const state = () => {
  return {}
}

export const mutations = {}

// I think "Session Init" is more descriptive of when this runs
const sessionInit = async (store) => {}

export const actions = {
  async nuxtClientInit (store) { // hooked up via plugin
    await sessionInit(store)
    store.dispatch('auth/init')
    store.dispatch('storage/init')
  },
  async nuxtServerInit (store) {
    await sessionInit(store)
  }
}

export const getters = {}

export const strict = false
