<template>
  <div class="about">
    <h1>{{ $t("game.title") }}</h1>
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
            >
              {{ JSON.stringify(item) }}
            </li>
          </ul>
        </div>
        <div style="border: 1px dashed blue;">
          <p>Expenses Total: {{ expensesTotal }}</p>
          <ul>
            <li
              v-for="(item, index) of state.report.expenses"
              :key="`expenses-${index}`"
            >
              {{ JSON.stringify(item) }}
            </li>
          </ul>
        </div>
        <div style="border: 1px dashed blue;">
          <p>Assets Total: {{ assetsTotal }}</p>
          <ul>
            <li
              v-for="(item, index) of state.report.assets"
              :key="`assets-${index}`"
            >
              {{ JSON.stringify(item) }}
            </li>
          </ul>
        </div>
        <div style="border: 1px dashed blue;">
          <p>Liabilities Total: {{ liabilitiesTotal }}</p>
          <ul>
            <li
              v-for="(item, index) of state.report.liabilities"
              :key="`liabilities-${index}`"
            >
              {{ JSON.stringify(item) }}
            </li>
          </ul>
        </div>
      </div>
      <div
        style="flex: 33%; border: 1px dashed green; display: flex; flex-direction: column;"
      >
        <template v-if="currentFlow">
          <div>
            <span>{{ cashFlowTotal }}</span
            >, <span>{{ cashTotal }}</span
            >,
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
      <div
        style="flex: 33%; border: 1px dashed green; display: flex; flex-direction: column;"
      >
        test
      </div>
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
import SaleBusinessPanel from "./panel/SaleBusinessPanel";
import SaleHousePanel from "./panel/SaleHousePanel";
export default {
  name: "Game",
  components: {
    BirthChildPanel,
    ReceivingSalary,
    StockFundMetalIndustry,
    SaleBusinessPanel,
    SaleHousePanel
  },
  data() {
    return {
      test: "lorem ipsum",
      actionComponent: null,
      currentFlow: null,
      categories: {
        salary: ["JOB", "RECEIVING_SALARY"],
        life: [
          "BIRTH_CHILD",
          "STOCK_FUND_METAL_INDUSTRY",
          "SALE_BUSINESS",
          "SALE_HOUSE"
        ]
      },
      flowList: [
        // { flowType: "JOB", value: 1000 },
        { flowType: "BIRTH_CHILD", value: 700, count: 1 },
        { flowType: "RECEIVING_SALARY", premiumValue: 100 },
        { flowType: "RECEIVING_SALARY", premiumValue: 900 },
        { flowType: "RECEIVING_SALARY", premiumValue: 1500 },
        { flowType: "SALE_BUSINESS", value: 80000, type: "buy" },
        { flowType: "SALE_HOUSE", value: 16000, type: "cell" },
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
      if (this.currentFlow) this.addFlow(this.currentFlow, value);
      this.generateNextFlow();
    },
    onActionCancel() {
      this.generateNextFlow();
    },
    initStartFlow() {
      let { FlowType } = this;
      this.addFlow({ flowType: FlowType.JOB, value: 4500 });
      this.addFlow({ flowType: FlowType.GENERAL_EXPENSES, value: 2500 });
    },
    next(value) {
      if (this.currentFlow) this.addFlow(this.currentFlow, value);
      this.generateNextFlow();
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
            let { type, buyCount, cellCount } = value;
            let { value: currentValue, companyName } = flow;
            let { assets } = this.state.report;
            let assetIndex = assets.findIndex(
              x =>
                x.flowType === FlowType.STOCK_FUND_METAL_INDUSTRY &&
                x.companyName === companyName
            );
            let stockCount =
              type === "buy" ? buyCount : type === "cell" ? -cellCount : 0;
            let cashIndex = assets.findIndex(x => x.flowType === FlowType.CASH);
            if (type === "buy" && cashIndex < 0) {
              alert("some error");
              break;
            }
            if (assetIndex > -1) {
              let { value: eValue, count: eCount } = assets[assetIndex];
              let totalValue = eValue + currentValue * stockCount;
              let totalCount = eCount + stockCount;
              this.$store.commit("setAsset", {
                index: assetIndex,
                flow: {
                  flowType,
                  value: totalValue,
                  count: totalCount,
                  currentValue,
                  companyName
                }
              });
            } else {
              this.$store.commit("addAsset", {
                flowType,
                value: currentValue * stockCount,
                count: buyCount,
                currentValue,
                companyName
              });
            }

            let cash = assets[cashIndex];
            this.$store.commit("setAsset", {
              index: cashIndex,
              flow: {
                flowType: FlowType.CASH,
                value: cash.value - currentValue * stockCount
              }
            });
          }
          break;
      }
    },
    generateNextFlow() {
      let { step, lastFlowType, lastStepFlows } = this.state.report;
      let { FlowType } = this;
      let items =
        step % 4 === 0
          ? this.flowList.filter(x =>
              this.categories.salary.includes(x.flowType)
            )
          : this.flowList.filter(x =>
              this.categories.life.includes(x.flowType)
            );

      if (step % 4 === 0) {
        this.$store.commit("resetLastStepFlows");
      }

      this.currentFlow = items[Math.floor(Math.random() * items.length)];
      let count = 0;
      while (
        (this.currentFlow.flowType === lastFlowType ||
          lastStepFlows.includes(this.currentFlow.flowType)) &&
        count < 100
      ) {
        this.currentFlow = items[Math.floor(Math.random() * items.length)];
        count++;
      }

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
        case FlowType.SALE_BUSINESS:
          this.actionComponent = "SaleBusinessPanel";
          break;
        case FlowType.SALE_HOUSE:
          this.actionComponent = "SaleHousePanel";
          break;
        default:
          this.actionComponent = null;
      }
      this.$store.commit("incStep");
      this.$store.commit("setLastFlow", this.currentFlow.flowType);
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
    cashFlowTotal() {
      return this.incomesTotal - this.expensesTotal;
    },
    cashTotal() {
      let { FlowType } = this;
      let { assets } = this.state.report;
      return assets.reduce(
        (value, x) => value + (x.flowType === FlowType.CASH ? x.value : 0),
        0
      );
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
