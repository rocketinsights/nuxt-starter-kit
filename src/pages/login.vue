<template>
  <div class="flex h-screen justify-center items-center">
    <section class="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Be sure to use this with a layout container that is full-width on mobile -->
      <div class="bg-white overflow-hidden shadow sm:rounded-lg">
        <header class="text-4xl px-4 py-5 sm:px-6">
          <!-- We use less vertical padding on card headers on desktop than on body sections -->
          heading goes here
        </header>
        <main class="px-4 py-5 sm:p-6">
          login buttons go here
        </main>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

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
