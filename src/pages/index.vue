<template>
  <section>
    <nav></nav>
    <NavBar imgURL="rocket-insights-logo.svg" :user="user" />
    <h2 class="title">Disney Movies</h2>
    <ul class="movies">
      <li v-for="movie in disneyMovies" :key="movie.title">
        {{ movie.title }}
      </li>
    </ul>
    <file-uploader />
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import FileUploader from "@/components/FileUploader";
import NavBar from "@/components/NavBar";

export default {
  components: { FileUploader, NavBar },
  data: function() {
    return {};
  },
  computed: {
    ...mapGetters({
      byStudio: "movies/byStudio",
      getUser: "auth/getUser",
      isUserAuth: "auth/isUserAuth"
    }),
    ...mapState({
      user: ({ auth }) => auth.user
    }),
    disneyMovies() {
      return this.byStudio("Disney");
    }
  },
  mounted() {
    this.authAction();
  },
  methods: {
    ...mapActions({
      signInWithRedirect: "auth/signInWithRedirect",
      signOut: "auth/signOut",
      authAction: "auth/authAction"
    })
  }
};
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
