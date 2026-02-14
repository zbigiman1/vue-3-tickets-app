import { config } from '@vue/test-utils'
import { h } from 'vue'

// Globally stub router-link and router-view to silence the 'Failed to resolve component: router-link' warning in unit tests
config.global.stubs = {
  ...config.global.stubs,
  // support both kebab-case and PascalCase usages in tests
  'router-link': {
    render() {
      return h('a', this.$slots.default && this.$slots.default())
    }
  },
  RouterLink: {
    render() {
      return h('a', this.$slots.default && this.$slots.default())
    }
  },
  'router-view': true,
  RouterView: true
}
