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
    <h2 class="title">Rocket Employees</h2>
    <ul v-for="employee in filteredEmployeesData" :key="employee.sys.id">
      <li >
        Name: {{employee.fields.name}}
      </li>
      <li >
        Position: {{employee.fields.position}}
      </li>
      <!-- <li >
        ID: {{employee.sys.id}}
      </li> -->
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
      byStudio: 'movies/byStudio',
      showEmployees: 'rocket/showEmployees',
      filteredEmployeesData:'rocket/filteredEmployeesData'
    }),
    ...mapState({
      user: ({ auth }) => auth.user,
      employees: ({ rocket }) => rocket.employees
    }),
    disneyMovies () {
      return this.byStudio('Disney')
    }
  },
  mounted() {
    this.getEmployees()
  },
  methods: {
    ...mapActions({
      signInWithRedirect: 'auth/signInWithRedirect',
      signOut: 'auth/signOut',
      getEmployees: 'rocket/getEmployees'
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
