<template>
  <section>
    <h2 class="title">Rocket Employees</h2>
    <ul v-for="employee in employeeHeadshots" :key="employee.id">
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
      missingFromSite: 'rocket/missingFromSite'
    }),
    ...mapState({
      user: ({ auth }) => auth.user,
      employeeHeadshots: ({ rocket }) => rocket.employeeHeadshots
    })
  },
  mounted() {
    this.getContentfulEmployees(), 
    this.getSlackEmployees()
  },
  methods: {
    ...mapActions({
      signInWithRedirect: 'auth/signInWithRedirect',
      signOut: 'auth/signOut',
      getContentfulEmployees: 'rocket/getContentfulEmployees', 
      getSlackEmployees: 'rocket/getSlackEmployees'
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
