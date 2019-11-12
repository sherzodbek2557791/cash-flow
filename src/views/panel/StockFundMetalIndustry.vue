<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <div style="flex-grow: 1;">
      Текущая цена: {{ currentFlow.value }}
      Наименование: {{ currentFlow.companyName }}
      <!-- Справедливая цена: 100 i -->
      В наличии: {{ cellCount }}
      Введите количество
      <input
        v-model="currentFlowCount"
        :min="1"
        :max="currentFlow.maxCount"
      />
      Сумма {{ currentFlowCount * currentFlow.value }}
    </div>
    <div>
      <button @click="cancel">Cancel</button>
      <button @click="buy">Buy</button>
      <button @click="cell" :disabled="cellCount === 0">Cell</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StockFundMetalIndustry",
  props: {
    details: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      currentFlowCount: 1
    };
  },
  methods: {
    buy() {
      let total = +this.currentFlowCount * this.currentFlow.value
      if(total > this.cashTotal){
        alert('To buy need cash!');
        return;
      }

      this.$emit("submit", { type: "buy", buyCount: +this.currentFlowCount });
    },
    cell() {
      if(+this.currentFlowCount > this.cellCount){
        alert('To cell need stocks!');
        return;
      }

      this.$emit("submit", { type: "cell", cellCount: +this.currentFlowCount });
    },
    cancel() {
      this.$emit("cancel");
    }
  },
  computed: {
    currentFlow() {
      return this.details.currentFlow;
    },
    cellCount() {
      let { FlowType } = this;
      let { assets } = this.state.report,
        total = 0,
        { flowType, companyName } = this.currentFlow;
      return assets.reduce(
        (count, x) =>
          count +
          (x.flowType === flowType && x.companyName === companyName
            ? x.count
            : 0),
        0
      );
      //{"flowType":"STOCK_FUND_METAL_INDUSTRY","value":700,"count":"20","currentValue":35
    },
    cashTotal() {
      let { FlowType } = this;
      let { assets } = this.state.report,
        total = 0;
      return assets.reduce(
        (value, x) => value + (x.flowType === FlowType.CASH ? x.value : 0),
        0
      );
    },
  }
};
</script>>