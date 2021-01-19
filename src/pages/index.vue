<template>
  <section>
    <nav>
      <h3>{{user && user.displayName}}</h3>
      <button @click.stop.prevent="signInWithRedirect('google')">
        Sign In With Google
      </button>
      <button @click.stop.prevent="signOut">
        Sign Out
      </button>
    </nav>
    <h2 class="title">Disney Movies</h2>
    <ul class="movies">
      <li v-for="movie in disneyMovies" :key="movie.title">
        {{movie.title}}
      </li>
    </ul>
    <file-uploader />
    
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import FileUploader from '@/components/FileUploader'

export default {
  components: { FileUploader },
  computed: {
    ...mapGetters({
      byStudio: 'movies/byStudio'
    }),
    ...mapState({
      user: ({ auth }) => auth.user
    }),
    disneyMovies () {
      return this.byStudio('Disney')
    }
  },
  methods: {
    ...mapActions({
      signInWithRedirect: 'auth/signInWithRedirect',
      signOut: 'auth/signOut'
    })
  }
}
</script>

<style>
.title {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
