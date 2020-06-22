const state = () => {
  return {}
}

const mutations = {}

// I think "Session Init" is more descriptive of when this runs
const sessionInit = async (store) => {}

const actions = {
  async nuxtClientInit (store) { // hooked up via plugin
    await sessionInit(store)
  },
  async nuxtServerInit (store) {
    await sessionInit(store)
  }
}

const getters = {}

export default { actions, mutations, state, getters }