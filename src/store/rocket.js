import _ from "lodash";

const state = () => {
  return { employees: null };
};

const mutations = {
  setEmployees(state, employeeData) {
    const fields = [
      "items.sys.space.id",
      "items.fields.name",
      "items.fields.position",
      "item.fields.profilePic.id"
    ];
    const employees = _.pick(employeeData, fields);
    state.employees = employees;
  }
};

const actions = {
  async getEmployees({ commit }) {
    const employees = await this.$http.$get(
      "https://cdn.contentful.com/spaces/eq7v79j9q2bj/entries?access_token=002313db02188f7993bf8e6f0c498c5dca85d796115c35908738242d9808cc92&content_type=team"
    );

    commit("setEmployees", employees);
  }
};

const getters = {
  getEmployees(state) {
    return state.employees;
  }
};

export default { state, mutations, actions, getters };
