import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
//从 @tsparticles/vue3 包中导入 Particles 组件。
import Particles from "@tsparticles/vue3";
// 导入完整版函数
import { loadFull } from "tsparticles"; 

createApp(App).use(router).use(Particles,{
    init:async(instance: any)=>{
        await loadFull(instance);
    }
}).mount("#app");

// import type { App } from "vue";
// import particles from "../src/views/login/vue-particles.vue";
// import { type Engine, tsParticles } from "@tsparticles/engine";

// const VueParticles = (app: App, options: { init: (engine: Engine) => Promise<void> }) => {
//     app.component("vue-particles", particles);

//     (async () => {
//         tsParticles.init();

//         if (options.init) {
//             await options.init(tsParticles);
//         }

//         dispatchEvent(new CustomEvent("particlesInit", { detail: tsParticles }));
//     })();
// };

// export default VueParticles;