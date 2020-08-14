import Vue from 'vue'
import App from './App.vue'
// 引入router.js
import router from './router/router.js'
// 引入echarts
import echarts from 'echarts'
// 引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);  //使用ElementUI

// 创造一个全局bus -- 跨级传值
Vue.prototype.$bus = new Vue();

Vue.prototype.$echarts = echarts;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
