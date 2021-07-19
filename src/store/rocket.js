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
        employees = await this.$http.$get('https://jsonplaceholder.typicode.com/users')
  
        commit('setEmployees', employees)
  }}
  
  const getters = {
    showEmployees(state) {
        return state.employees
    }
  };
  
  export default { state, mutations, actions, getters };
  