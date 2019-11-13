import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import enums from './enums'
import router from './router'
import store from './store'
import i18n from './i18n'

Vue.config.productionTip = false

Vue.mixin({ data: () => enums })
Vue.mixin({ data() { return { state: this.$store.state } } })

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
