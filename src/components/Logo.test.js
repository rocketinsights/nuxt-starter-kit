import _ from 'lodash'
import { config, mount } from '@vue/test-utils'
import Logo from '@/components/Logo.vue'

config.showDeprecationWarnings = false

describe('Logo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Logo)
    expect(wrapper.isVisible()).toBeTruthy()
  })
})
