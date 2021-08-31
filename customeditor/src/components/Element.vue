<template>
  <div class="element">
    <div class="header">
      <h4>{{ name }}</h4>
      <button @click="addModel">Add model</button>
    </div>
    <ul>
      <li v-for="m in models" v-bind:key="m.mid">
        <span> {{ m.mid }} </span> <span> {{ m.name }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Element",
  props: ["name", "models"],
  data: function () {
    return {};
  },
  methods: {
    addModel: function () {
      const newModel = {
        mid: this.generateKey(),
        name: "Vendor model",
      };
      this.$vscode.postMessage({
        type: "add-model",
        payload: {
          name: this.name,
          model: newModel,
        },
      });
    },
    generateKey: function () {
      const n = Math.floor(Math.random() * 65536);
      return n.toString(16);
    },
  },
};
</script>

<style scoped>
h4 {
  margin: 6px 4px;
}
button {
  width: 20%;
}
.element {
  width: 80%;
  margin: 6px auto;
  border: 1px solid #666;
  border-radius: 16px;
  padding: 4px 8px;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
