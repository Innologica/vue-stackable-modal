import StackModal from './components/StackModal'

const install = (Vue, options = {}) => {
  Vue.component('StackModal', StackModal)
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export { install, StackModal as default }