<template>
  <h1>Editor</h1>
  <input type="text" v-model="elementName" />
  <button @click="addElement">Add element</button>
  <div v-if="elements.length > 0">
    <Element
      v-for="element in elements"
      v-bind:key="element.id"
      :name="element.name"
      :models="element.models"
    />
  </div>
</template>

<script>
import Element from "./Element.vue";

export default {
  name: "Editor",
  components: {
    Element,
  },
  props: ["config"],
  data: function () {
    return {
      elementName: "",
      elements: [],
    };
  },
  methods: {
    addElement: function () {
      const elements = [...this.elements, { name: this.elementName }];
      this.$vscode.postMessage({
        type: "add-element",
        payload: {
          name: this.elementName,
        },
      });
      this.elements = elements;
      this.elementName = "";
    },
  },
  watch: {
    config: function (newConfig) {
      console.log("newConfig", newConfig);
      if (newConfig.elements) {
        this.elements = newConfig.elements;
      }
    },
  },
};
</script>
