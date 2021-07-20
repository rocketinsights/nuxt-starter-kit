import _ from 'lodash'
const state = () => {
    return {employees: null}
  };
  
  const mutations = {
    setEmployees(state, employees) {
        state.employees = employees;
      }
  };
  
  const actions = {
    async getEmployees ({ commit }) {
        try{
            const employees = await this.$http.$get(this.$config.contentfulFullURL)
            console.log(employees)
            commit('setEmployees', employees.items)
        } catch(error) {
            console.error(error.message)
        }
        
  }}
  
  const getters = {
    employees(state) {
        return state.employees
    },
    filteredEmployeesData(state){
        const fields = ['fields.name', 'fields.position', 'fields.profilePic.sys.id','sys.id']
        return _.map(state.employees, e => _.pick(e, fields))
        
    }
  };
  
  export default { state, mutations, actions, getters };
  