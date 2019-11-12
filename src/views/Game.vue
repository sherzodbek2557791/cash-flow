<template>
  <div class="about">
    <h1>Game</h1>
    <a href="#" @click="startGame" v-if="!isStarted">Start</a>
    <template v-else>
      <a href="#" @click="restartGame">Restart</a>
      <br />
      <a href="#" @click="clear">Stop</a>
    </template>

    <div style="display: flex;" v-if="isStarted">
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
          <div>
            <span>{{ cashflowTotal }}</span>
            <span>{{ cashTotal }}</span>
            <span>{{ creditTotal }}</span>
          </div>
          <h4>{{ currentFlow.flowType }}</h4>
          <component
            ref="dynamicComponent"
            :is="actionComponent"
            :details="actionDetails"
            @submit="onActionSubmit"
            @cancel="onActionCancel"
          ></component>
        </template>
      </div>
      <div style="flex: 33%; border: 1px dashed green; display: flex; flex-direction: column;">test</div>
    </div>

    <!-- <button @click="initStartFlow">Add</button>
    <button @click="next">next</button>
    <button @click="clear">Clear</button>-->
  </div>
</template>
<script>
import BirthChildPanel from "./panel/BirthChildPanel";
import ReceivingSalary from "./panel/ReceivingSalary";
import StockFundMetalIndustry from "./panel/StockFundMetalIndustry";
export default {
  name: "Game",
  components: {
    BirthChildPanel,
    ReceivingSalary,
    StockFundMetalIndustry
  },
  data() {
    return {
      test: "lorem ipsum",
      actionComponent: null,
      currentFlow: null,
      flowList: [
        // { flowType: "JOB", value: 1000 },
        { flowType: "BIRTH_CHILD", value: 700, count: 1 },
        { flowType: "RECEIVING_SALARY", premiumValue: 100 },
        { flowType: "RECEIVING_SALARY", premiumValue: 900 },
        { flowType: "RECEIVING_SALARY", premiumValue: 1500 },
        {
          flowType: "STOCK_FUND_METAL_INDUSTRY",
          value: 35,
          maxCount: 1000,
          companyName: "акции «Связьком»"
        }
      ]
    };
  },
  methods: {
    onActionSubmit(value) {
      this.next(value);
    },
    onActionCancel() {},
    initStartFlow() {
      let { FlowType } = this;
      this.addFlow({ flowType: FlowType.JOB, value: 4500 });
      this.addFlow({ flowType: FlowType.GENERAL_EXPENSES, value: 2500 });
    },
    next(value) {
      if (this.currentFlow) this.addFlow(this.currentFlow, value);
      this.generateNextFlow(value);
    },
    clear() {
      this.$store.commit("clearFlows");
    },
    addFlow(flow, value) {
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
        case FlowType.STOCK_FUND_METAL_INDUSTRY:
          {
            console.log(value);
          }
          break;
      }
    },
    generateNextFlow(value) {
      let { FlowType } = this;
      let items = this.flowList;
      this.currentFlow = items[Math.floor(Math.random() * items.length)];

      switch (this.currentFlow.flowType) {
        case FlowType.BIRTH_CHILD:
          this.actionComponent = "BirthChildPanel";
          break;
        case FlowType.RECEIVING_SALARY:
          this.actionComponent = "ReceivingSalary";
          break;
        case FlowType.STOCK_FUND_METAL_INDUSTRY:
          this.actionComponent = "StockFundMetalIndustry";
          break;
        default:
          this.actionComponent = null;
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
    restartGame() {
      this.clear();
      this.startGame();
    }
  },
  computed: {
    cashflowTotal() {
      return this.incomesTotal - this.expensesTotal;
    },
    cashTotal() {
      return this.assetsTotal - this.liabilitiesTotal;
    },
    creditTotal() {
      return 0;
    },
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
    },
    actionDetails() {
      let {
        currentFlow,
        incomesTotal,
        expensesTotal,
        assetsTotal,
        liabilitiesTotal
      } = this;
      return {
        currentFlow,
        incomesTotal,
        expensesTotal,
        assetsTotal,
        liabilitiesTotal
      };
    }
  },
  mounted() {
    //this.startGame();
  },
  watch: {
    cashTotal(newVal) {
      if (newVal < 0) {
        alert("You are a Bankrot!");
        this.restartGame();
      }
    }
  }
};
</script>
