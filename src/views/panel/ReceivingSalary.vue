<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <div style="flex-grow: 1;">
      Получение зарплаты
      Зарплата: {{ incomesTotal - expensesTotal }}
      Премия: {{ currentFlow.premiumValue }}
      --------------------------
      Итого: {{ amount(currentFlow.premiumValue) + incomesTotal - expensesTotal }}
    </div>
    <div>
      <button @click="submit">Ok</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReceivingSalary",
  props: {
    details: {
      type: Object,
      required: false
    }
  },
  methods: {
    submit() {
      this.$emit("submit");
    },
    amount(value) {
      return value && typeof value === "number" ? value : 0;
    }
  },
  computed: {
    currentFlow() {
      return this.details.currentFlow;
    },
    incomesTotal() {
      return this.details.incomesTotal;
    },
    expensesTotal() {
      return this.details.expensesTotal;
    },
    assetsTotal() {
      return this.details.assetsTotal;
    },
    liabilitiesTotal() {
      return this.details.liabilitiesTotal;
    }
  }
};
</script>>