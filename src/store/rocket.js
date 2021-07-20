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
            const employees = await this.$http.$get('https://jsonplaceholder.typicode.com/users')
            console.log(employees)
            commit('setEmployees', employees)
        } catch(error) {
            console.error(error.message)
        }
        
  }}
  
  const getters = {
    employees(state) {
        return state.employees
    }
  };
  
  export default { state, mutations, actions, getters };
  