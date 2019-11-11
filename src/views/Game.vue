<template>
  <div class="about">
    <h1>Game</h1>
    <a href="#" @click="startGame" v-if="!isStarted">Start</a>
    <template v-else>
      <a href="#" @click="restartGame" >Restart</a>
      <a href="#" @click="clear" >Stop</a>
    </template>
    
    <div style="display: flex;">
      <div style="flex: 33%;">
        <div style="border: 1px dashed blue;">
          <p>Incomes Total: {{ incomesTotal }}</p>
          <ul>
            <li
              v-for="(item, index) of state.report.incomes"
              :key="`incomes-${index}`"
            >{{ JSON.stringify(item) }}</li>
          </ul>
        </div>
        <div style="border: 1px dashed blue;">
          <p>Expenses Total: {{ expensesTotal }}</p>
          <ul>
            <li
              v-for="(item, index) of state.report.expenses"
              :key="`expenses-${index}`"
            >{{ JSON.stringify(item) }}</li>
          </ul>
        </div>
        <div style="border: 1px dashed blue;">
          <p>Essets Total: {{ assetsTotal }}</p>
          <ul>
            <li
              v-for="(item, index) of state.report.assets"
              :key="`assets-${index}`"
            >{{ JSON.stringify(item) }}</li>
          </ul>
        </div>
        <div style="border: 1px dashed blue;">
          <p>Liabilities Total: {{ liabilitiesTotal }}</p>
          <ul>
            <li
              v-for="(item, index) of state.report.liabilities"
              :key="`liabilities-${index}`"
            >{{ JSON.stringify(item) }}</li>
          </ul>
        </div>
      </div>
      <div style="flex: 33%; border: 1px dashed green; display: flex; flex-direction: column;">
        <template v-if="currentFlow">
          <h4>{{ currentFlow.flowType }}</h4>
          <div
            v-if="currentFlow.flowType === FlowType.BIRTH_CHILD"
            style="display: flex; flex-direction: column; flex-grow: 1;"
          >
            <div style="flex-grow: 1;">
              Рождение ребенка
              Количество: {{ currentFlow.count }}
              Расход: {{ currentFlow.value }}
            </div>
            <div>
              <button @click="next">Ok</button>
            </div>
          </div>
          <div
            v-if="currentFlow.flowType === FlowType.RECEIVING_SALARY"
            style="display: flex; flex-direction: column; flex-grow: 1;"
          >
            <div style="flex-grow: 1;">
              Получение зарплаты
              Зарплата: {{ incomesTotal - expensesTotal }}
              Премия: {{ currentFlow.premiumValue }}
              --------------------------
              Итого: {{ amount(currentFlow.premiumValue) + incomesTotal - expensesTotal }}
            </div>
            <div>
              <button @click="next">Ok</button>
            </div>
          </div>
        </template>
      </div>
      <div style="flex: 33%; border: 1px dashed green; display: flex; flex-direction: column;">test</div>
    </div>

    <button @click="initStartFlow">Add</button>
    <button @click="next">next</button>
    <button @click="clear">Clear</button>
  </div>
</template>
<script>
export default {
  name: "Game",
  data() {
    return {
      test: "lorem ipsum",
      currentFlow: null,
      flowList: [
        // { flowType: "JOB", value: 1000 },
        { flowType: "BIRTH_CHILD", value: 700, count: 1 },
        { flowType: "RECEIVING_SALARY", premiumValue: 100 },
        { flowType: "RECEIVING_SALARY", premiumValue: 900 },
        { flowType: "RECEIVING_SALARY", premiumValue: 1500 }
      ]
    };
  },
  methods: {
    initStartFlow() {
      let { FlowType } = this;
      this.addFlow({ flowType: FlowType.JOB, value: 4500 });
      this.addFlow({ flowType: FlowType.GENERAL_EXPENSES, value: 2500 });
    },
    generateNextFlow() {
      let items = this.flowList;
      this.currentFlow = items[Math.floor(Math.random() * items.length)];
    },
    cancel() {
      this.generateNextFlow();
    },
    next() {
      if (this.currentFlow) this.addFlow(this.currentFlow);
      this.generateNextFlow();
    },
    clear() {
      this.$store.commit("clearFlows");
    },
    addFlow(flow) {
      let { flowType } = flow;
      let { FlowType } = this;

      switch (flowType) {
        case FlowType.RECEIVING_SALARY:
          {
            let { premiumValue } = flow;
            let { assets } = this.state.report;
            let value = this.incomesTotal - this.expensesTotal;
            let total = value + this.amount(premiumValue);

            let assetIndex = assets.findIndex(
              x => x.flowType === FlowType.CASH
            );
            if (assetIndex > -1) {
              let totalExternal = assets[assetIndex].value + total;
              this.$store.commit("setAsset", {
                index: assetIndex,
                flow: { flowType: FlowType.CASH, value: totalExternal }
              });
            } else {
              this.$store.commit("addAsset", {
                flowType: FlowType.CASH,
                value: total
              });
            }
          }
          break;
        case FlowType.JOB:
          {
            let { incomes } = this.state.report;
            let incomeIndex = incomes.findIndex(
              x => x.flowType === FlowType.JOB
            );
            if (incomeIndex > -1) {
              alert("FlowType.JOB found in the incomes!");
              break;
            }
            let { value } = flow;
            let total = this.amount(value);
            this.$store.commit("addIncome", { flowType, value: total });
          }
          break;
        case FlowType.GENERAL_EXPENSES:
          {
            let { expenses } = this.state.report;
            let expenseIndex = expenses.findIndex(
              x => x.flowType === FlowType.GENERAL_EXPENSES
            );
            let { value } = flow;
            if (expenseIndex > -1) {
              let total = value + expenses[expenseIndex].value;
              this.$store.commit("setExpense", {
                index: expenseIndex,
                flow: { flowType, value: total }
              });
            } else {
              this.$store.commit("addExpense", { flowType, value });
            }
          }
          break;
        case FlowType.BIRTH_CHILD:
          {
            let { expenses } = this.state.report;
            let expenseIndex = expenses.findIndex(
              x => x.flowType === FlowType.BIRTH_CHILD
            );
            let { value, count } = flow;
            if (expenseIndex > -1) {
              let { value: eValue, count: eCount } = expenses[expenseIndex];
              let totalValue = value + eValue;
              let totalCount = count + eCount;
              this.$store.commit("setExpense", {
                index: expenseIndex,
                flow: { flowType, value: totalValue, count: totalCount }
              });
            } else {
              this.$store.commit("addExpense", { flowType, value, count });
            }
          }
          break;
      }
    },
    amount(value) {
      return value && typeof value === "number" ? value : 0;
    },
    totalAmount(list, key) {
      let total = 0;
      for (let item of list) {
        let value = item[key];
        if (value && value !== 0) total += value;
      }
      return total;
    },
    startGame() {
      let { incomes } = this.state.report;
      if (incomes.length === 0) this.initStartFlow();

      this.generateNextFlow();
    },
    restartGame(){
      this.clear()
      this.startGame()
    }
  },
  computed: {
    incomesTotal() {
      let { incomes } = this.state.report;
      return this.totalAmount(incomes, "value");
    },
    expensesTotal() {
      let { expenses } = this.state.report;
      return this.totalAmount(expenses, "value");
    },
    assetsTotal() {
      let { assets } = this.state.report;
      return this.totalAmount(assets, "value");
    },
    liabilitiesTotal() {
      let { liabilities } = this.state.report;
      return this.totalAmount(liabilities, "value");
    },
    isStarted() {
      let { incomes } = this.state.report;
      return incomes.length > 0;
    }
  },
  mounted() {
    this.startGame();
  }
};
</script>
