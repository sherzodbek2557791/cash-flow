<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <div style="flex-grow: 1;">
      Продается дом
      Предложенная цена: 87 000 i
      Средняя рыночная цена:	100 000 i
      Первый взнос:	17 100 i
      Долг:	69 900 i
      Пассивный доход за месяц:	-400 i
      ROI за год:	-28,1%
      Вероятность продажи:	14%

      {{ currentFlow }}

    </div>
    <div>
      <button @click="submit">Ok</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SaleHousePanel",
  props: {
    details: {
      type: Object,
      required: false
    }
  },
  methods: {
    submit() {
      this.$emit("submit");
    }
  },
  computed: {
    currentFlow() {
      return this.details.currentFlow;
    }
  }
};
</script>>