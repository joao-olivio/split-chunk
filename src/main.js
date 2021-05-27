import Vue from "vue";
import ComponentA from './Project/OAP/code/scripts/ComponentA/componentA.vue';

Vue.config.productionTip = false;

Vue.component(ComponentA.name, ComponentA);

new Vue({
  components: {
    ComponentA,
    ComponentB: () => import(/* webpackChunkName: 'ComponentB' */'./Project/OAP/code/scripts/ComponentB/componentB.vue'),
    ComponentC: () => import(/* webpackChunkName: 'ComponentC' */'./Project/OAP/code/scripts/ComponentC/componentC.vue'),
  }
}).$mount("#main-container");
