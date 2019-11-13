import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'cash-flow',
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    report:{
      incomes: [],
      expenses: [],
      assets: [],
      liabilities: [],
    }
  },
  mutations: {
    addIncome(state, income){
      state.report.incomes.push(income)
    },
    addExpense(state, expense){
      state.report.expenses.push(expense)
    },
    setExpense(state, expense){
      let { index, flow } = expense
      let item = state.report.expenses[index]
      if(!item)return
      for(let key in flow){
        item[key] = flow[key]
      }
    },
    addAsset(state, asset){
      state.report.assets.push(asset)
    },
    setAsset(state, asset){
      let { index, flow } = asset
      let item = state.report.assets[index]
      if(!item)return
      for(let key in flow){
        item[key] = flow[key]
      }
    },
    clearFlows(state){
      state.report = {
        incomes: [],
        expenses: [],
        assets: [],
        liabilities: [],
      }
    }
  },
  actions: {
  },
  modules: {},
  plugins: [vuexPersist.plugin]
})