import axios from 'axios'
import message from 'element-ui'

/**
 * 创建自定义axios实例
 */
const instance = axios.create({
  timeout: 60000,
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 设置请求头  Cookies.get('token');
    let token = ''
    token && (config.headers.Authorization = token)
    return config
  }, error => {
    Promise.reject(error.response).then(() => console.log(error.response));
  }
)
// 响应拦截器
instance.interceptors.response.use(
  response => {
    let result = response.data;
    if (result.success && result.code === 200) {
      return Promise.resolve(result.data);
    } else {
      message.Message.error(result.message)
    }
  },
  error => {
    let response = error.response
    console.log(response)
    let status = error.response.status
    switch (status) {
      case 401:
        // 做跳转页面的操作
        message.Message.error("登录失效,请重新登录")
        break;
      case 403:
        message.Message.error("403 资源不可用");
        break;
      case 404:
        message.Message.error('网络请求不存在')
        break;
      case 500:
        message.Message.error("服务器内部错误")
        break;
      default:
        message.Message.error(error.response.data.message);
    }
    return Promise.reject(response);
  }
)

const Http = {
  get(uri, params) {
    return instance({
      url: uri,
      method: 'get',
      params: params
    })
  },

  post(uri, params) {
    return instance({
      url: uri,
      method: 'post',
      data: params
    })
  },

  delete(uri, params) {
    return instance({
      url: uri,
      method: 'delete',
      params: params
    })
  },

  put(uri, params) {
    return instance({
      url: uri,
      method: 'put',
      data: params
    })
  }
}
export {instance}
export default Http
