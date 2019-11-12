<template>
  <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <div style="flex-grow: 1;">
      Рождение ребенка
      Количество: {{ currentFlow.count }}
      Расход: {{ currentFlow.value }}
    </div>
    <div>
      <button @click="submit">Ok</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BirthChildPanel",
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