import axios from "axios";
import qs from "qs";

axios.defaults.baseURL = 'http://127.0.0.1:3000//' //本地后台地址

//post请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
//设置超时
axios.defaults.timeout = 10000;

//axios请求拦截
axios.interceptors.request.use(
  //config中有一个header参数，是前端向后端发请求时携带的
  config => {
    config.headers.Authorization = window.localStorage.getItem('token')
    Toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true,
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    Toast.clear();
    return response;
  },
  error => {
    Toast.clear();
    Dialog.alert({
      title: "提示",
      message: "网络请求失败，反馈给客服"
    });
  }
);

export default function axiosApi(type, params, method) {
  let sign = process.env.VUE_APP_SIGN
  if (process.env.NODE_ENV === 'production') {
    sign = localStorage.getItem("wx_sign")
  } else {
    sign = 'crm:user:sign:f0c8cbe468f6a34463d198268290903f'
  }
  var value = {
    sign: sign
  }
  var data = method == "post" ? qs.stringify(Object.assign(value, params)) : Object.assign(value, params)
  return new Promise((resolve, reject) => {
    axios({
        method: method,
        url: type,
        data: data
      })
      .then(res => {
        if (res.data.errcode == 0) {
          resolve(res.data)
        } else {
          // 接口错误提示
          Toast.fail(res.data.msg);
        }
      })
      .catch(err => {
        reject(err)
      });
  })
};