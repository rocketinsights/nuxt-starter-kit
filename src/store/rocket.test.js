import _ from "lodash"
import Vuex from "vuex"
import { createLocalVue } from "@vue/test-utils"

describe("store/rocket", () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  let NuxtStore
  let store

  beforeAll(async () => {
    // note the store will mutate across tests
    const storePath = `${process.env.buildDir}/store.js`
    NuxtStore = await import(storePath)
  })

  beforeEach(async () => {
    store = await NuxtStore.createStore()
  })

  describe("getEmployees", () => {
    let employees

    beforeEach(() => {
        console.log(_.keys(store))
        store.dispatch("rocket/getEmployees")
        employees = store.getters['rocket/employees']
    })

    test("service returns list as expected", () => {
      expect(_.isArray(employees)).toBe(true)
    })

    // test("should be 6 movies total", () => {
    //   expect(disney.length).toBe(6)
    // })
  })
})
