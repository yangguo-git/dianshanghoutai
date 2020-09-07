import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import Base64 from './assets/js/base64.js'
import { getHttp, postHttp,postHttpForm } from './http/index'
Vue.prototype.$get = getHttp;
Vue.prototype.$post = postHttp;
Vue.prototype.$postHttpForm = postHttpForm;
Vue.prototype.$baseURL='https://tchopshop.weein.cn';
Vue.prototype.$Base64 = Base64;
Vue.config.productionTip = false;
Vue.use(VueCookies);
Vue.use(ElementUI);
//事件监听 防连点
Vue.directive('throttle', {
  inserted(el, binding) {
    el.addEventListener('click', () => {
      el.style.pointerEvents = 'none';
      if (!el.disabled) {
        setTimeout(() => {
          el.style.pointerEvents = 'auto';
        }, binding.value || 2000);
      }
    });
  }
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

