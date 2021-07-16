import _ from 'lodash';

const getRedirectResult = async $fire => {
  try {
    const result = await $fire.auth.getRedirectResult();
    if (!result.credential) return null;
    return result.user;
  } catch (err) {
    console.error('getRedirectResult error', {
      code: err.code,
      message: err.message,
      email: err.email,
      credential: err.credential
    });
  }
};

export const state = () => {
  return {
    user: null
  };
};

export const mutations = {
  setUser(state, userData) {
    const fields = ['uid', 'displayName', 'email', 'emailVerified', 'photoURL'];
    const user = _.pick(userData, fields);
    state.user = user;
  }
};

export const actions = {
  async init({ commit }) {
    const redirectUser = await getRedirectResult(this.$fire);
    if (redirectUser) commit('setUser', redirectUser);
  },
  signInWithRedirect(ctx, provider) {
    switch (_.toLower(provider)) {
      case 'github':
        this.$fire.auth.signInWithRedirect(
          new this.$fireModule.auth.GithubAuthProvider()
        );
        break;
      case 'google':
        this.$fire.auth.signInWithRedirect(
          new this.$fireModule.auth.GoogleAuthProvider()
        );
        break;
      case 'facebook':
        this.$fire.auth.signInWithRedirect(
          new this.$fireModule.auth.FacebookAuthProvider()
        );
        break;
      case 'twitter':
        this.$fire.auth.signInWithRedirect(
          new this.$fireModule.auth.TwitterAuthProvider()
        );
        break;
    }
  },
  onAuthStateChanged({ commit }, { authUser, claims }) {
    if (!authUser) {
      this.$fire.auth.signOut();
      commit('setUser', null);
      return;
    }

    commit('setUser', authUser);
  }
};

export const getters = {};
