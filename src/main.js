import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import enums from './enums'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.mixin({ data: () => enums })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
