import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "cash-flow",
  storage: window.localStorage
});

export default new Vuex.Store({
  state: {
    report: {
      step: 0,
      lastFlowType: null,
      lastStepFlows: [],
      incomes: [],
      expenses: [],
      assets: [],
      liabilities: []
    }
  },
  mutations: {
    setLastFlow(state, type) {
      state.report.lastFlowType = type;
      state.report.lastStepFlows.push(type);
    },
    resetLastStepFlows(state) {
      state.report.lastStepFlows = [];
    },
    incStep(state) {
      state.report.step++;
    },
    resetStep(state) {
      state.report.step = 0;
    },
    addIncome(state, income) {
      state.report.incomes.push(income);
    },
    addExpense(state, expense) {
      state.report.expenses.push(expense);
    },
    setExpense(state, expense) {
      let { index, flow } = expense;
      let item = state.report.expenses[index];
      if (!item) return;
      for (let key in flow) {
        item[key] = flow[key];
      }
    },
    addAsset(state, asset) {
      state.report.assets.push(asset);
    },
    setAsset(state, asset) {
      let { index, flow } = asset;
      let item = state.report.assets[index];
      if (!item) return;
      for (let key in flow) {
        item[key] = flow[key];
      }
    },
    clearFlows(state) {
      state.report = {
        step: 0,
        lastFlowType: null,
        lastStepFlows: [],
        incomes: [],
        expenses: [],
        assets: [],
        liabilities: []
      };
    }
  },
  actions: {},
  modules: {},
  plugins: [vuexPersist.plugin]
});
