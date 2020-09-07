import axios from 'axios'
import qs from 'qs';
import VueCookies from 'vue-cookies'
import Vue from 'vue'

// 获取token
function gettoken() {
    let token = VueCookies.get('accessToken');
    return token || ''
}

let instance = axios.create({
    baseURL: 'https://tchopshop.weein.cn',
    timeout: 30000,
    withCredentials:true,
});
//instance.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
// 添加请求拦截器
instance.interceptors.request.use(config => {
    //console.log(config);
    //config.headers.accessToken = gettoken();
    return config
}, error => {
    alert('请求报错,请稍后刷新再试');
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(response => {
    //console.log(response);
    return response.data;
}, error => {
    alert('响应报错,请稍后刷新再试');
    return Promise.reject(error);
});

function getHttp(url, params) {
    return instance.get(url, {params})
}

function postHttp(url, params) {
    let newParams =qs.parse(qs.stringify(params)) ;//数据是json data ['Content-Type'] = 'application/json;charset=UTF-8';
    return instance.post(url, newParams)
}
function postHttpForm(url, params) {
   //let newParams =qs.stringify(params) ;  //数据是 form data
    //return instance.post(url, newParams)
    return instance.post(url, params)
}
export { getHttp, postHttp, postHttpForm }



