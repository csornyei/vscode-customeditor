<template>
  <p v-if="error">{{ error }}</p>
  <Editor v-else :config="config" />
</template>

<script>
import Editor from "./components/Editor.vue";

export default {
  name: "App",
  components: {
    Editor,
  },
  data: function () {
    return {
      config: {
        elements: [],
      },
      error: null,
    };
  },
  mounted() {
    window.addEventListener("message", (event) => {
      const message = event.data;
      switch (message.type) {
        case "update":
          let text = message.text;
          let json;
          try {
            if (!text) {
              text = "{}";
            }
            json = JSON.parse(text);
          } catch (error) {
            this.error = "Not a valid JSON document!";
            return;
          }
          this.config = json;
          break;
        default:
          break;
      }
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
