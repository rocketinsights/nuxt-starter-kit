<template>
  <section>
    <h2 class="title">Rocket Employees</h2>
    <ul v-for="employee in employees" :key="employee.id">
      <li >
        Name: {{employee.name}}
      </li>
      <li >
        Position: {{employee.position}}
      </li>
      <img :src="`${employee.imageUrl}`" />
      <!-- Employee ID commented out for privacy -->
      <!-- <li >
        ID: {{employee.id}}
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
    }),
    ...mapState({
      user: ({ auth }) => auth.user,
      employees: ({ rocket }) => rocket.employees
    })
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
