<template>
  <h1>Editor</h1>
  <input type="text" v-model="elementName" />
  <button @click="addElement">Add element</button>
  <Element
    v-for="(element, idx) in elements"
    v-bind:key="idx"
    :name="element.name"
  />
</template>

<script>
import Element from "./Element.vue";

export default {
  name: "Editor",
  components: {
    Element,
  },
  data: function () {
    return {
      elementName: "",
      elements: [],
    };
  },
  methods: {
    addElement: function () {
      const elements = [...this.elements, { name: this.elementName }];
      this.elements = elements;
      this.elementName = "";
    },
  },
};
</script>
