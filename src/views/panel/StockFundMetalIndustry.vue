<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <div style="flex-grow: 1;">
      Текущая цена: {{ currentFlow.value }}
      Наименование: {{ currentFlow.companyName }}
      <!-- Справедливая цена: 100 i -->
      В наличии: 0
      Введите количество
      <input
        v-model="currentFlowCount"
        :min="1"
        :max="currentFlow.maxCount"
      />
    </div>
    <div>
      <button @click="cancel">Cancel</button>
      <button @click="submit">Ok</button>
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
    submit() {
      this.$emit("submit", this.currentFlowCount);
    },
    cancel() {
      this.$emit("cancel");
    }
  },
  computed: {
    currentFlow() {
      return this.details.currentFlow;
    }
  }
};
</script>>