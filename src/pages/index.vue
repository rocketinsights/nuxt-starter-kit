<template>
  <section>
    <h2 class="title">Disney Movies</h2>
    <ul class="movies">
      <li v-for="movie in disneyMovies" :key="movie.title">
        {{ movie.title }}
      </li>
    </ul>
    <file-uploader />
    <h2 class="title">Rocket Employees</h2>
    <!-- <ul>
      <li
        v-for="employee in rocketEmployees"
        :key="employee.items.sys.space.id"
      >
        {{ employee }}
      </li> -->
    </ul>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import FileUploader from "@/components/FileUploader";

export default {
  components: { FileUploader },
  computed: {
    ...mapGetters({
      byStudio: "movies/byStudio",
      getEmployees: "rocket/getEmployees"
    }),
    ...mapState({
      user: ({ auth }) => auth.user
    }),
    disneyMovies() {
      return this.byStudio("Disney");
    },
    // rocketEmployees() {
    //   return this.getEmployees();
    // }
  },
  methods: {
    ...mapActions({
      signInWithRedirect: "auth/signInWithRedirect",
      signOut: "auth/signOut"
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
