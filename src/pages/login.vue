<template>
  <div class="flex h-screen justify-center items-center">
    <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Be sure to use this with a layout container that is full-width on mobile -->
      <div class="bg-white overflow-hidden shadow sm:rounded-lg">
        <header class="text-center text-4xl px-4 py-5 sm:px-6">
          <!-- We use less vertical padding on card headers on desktop than on body sections -->
          Login With...
        </header>
        <!-- This example requires Tailwind CSS v2.0+ -->
        <main class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li class="px-4 py-4 sm:px-6">
              <button
                @click.stop.prevent="signInWithRedirect('github')"
                type="button"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <font-awesome-icon
                  class="-ml-1 mr-3 h-5 w-5"
                  :icon="['fab', 'github']"
                />
                Github
              </button>
            </li>
            <li class="px-4 py-4 sm:px-6">
              <button
                @click.stop.prevent="signInWithRedirect('google')"
                type="button"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <font-awesome-icon
                  class="-ml-1 mr-3 h-5 w-5"
                  :icon="['fab', 'google']"
                />
                Google
              </button>
            </li>
            <!-- <li class="px-4 py-4 sm:px-6">
              <button
                @click.stop.prevent="signInWithRedirect('facebook')"
                type="button"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <font-awesome-icon
                  class="-ml-1 mr-3 h-5 w-5"
                  :icon="['fab', 'facebook']"
                />
                Facebook
              </button>
            </li>
            <li class="px-4 py-4 sm:px-6">
              <button
                @click.stop.prevent="signInWithRedirect('twitter')"
                type="button"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <font-awesome-icon
                  class="-ml-1 mr-3 h-5 w-5"
                  :icon="['fab', 'twitter']"
                />
                Twitter
              </button>
            </li> -->
          </ul>
        </main>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      user: ({ auth }) => auth.user
    })
  },
  methods: {
    ...mapActions({
      signInWithRedirect: 'auth/signInWithRedirect',
      signOut: 'auth/signOut'
    })
  }
}
</script>

<style lang="sass">
</style>
