import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// eslint-disable-next-line no-undef
app.config.globalProperties.$vscode = acquireVsCodeApi();
app.mount("#app");
