import { message } from 'antd';

export default function handleError({ status, url, data, }) {

    // 登陆
    if ( url.includes('/login')) {
      let loginError = '登陆账号或者密码错误！'
      if(status === 401) {
        loginError = '登陆账号或者密码错误！'
      } else if (status === 405) {
        loginError = '请输入账号或者密码'
      } else if (status === 422) {
        loginError = '登陆账号或者密码错误！'
      }

      message.error(loginError)
      return;
    }

  // 状态码 401
  if (status === 401) {

    message.error('账号过期请重新登录')
    setTimeout(() => {
      sessionStorage.clear();
      window.location.href = '/#/login';
    }, 1000)

    return
  }

  // 状态码 422
  if (status === 422) {

    if (data
      && typeof data === 'object'
      && Reflect.has(data, 'errors')
      && Reflect.has(data, 'name')
      && Reflect.get(data, 'name') === 'huobi response error'
    ) {
      message.error(data.errors)
      return
    }

  }

  // 状态码 405
  if (status === 405) {

    let errorText = ''
    if (data && typeof data === 'object' && Reflect.has(data, 'errors')) {
      errorText = data.errors
    }

    if (data && typeof data === 'object' && Reflect.has(data, 'errors') && Array.isArray(data.errors)) {
      errorText = data.errors.join(',')
    }

    message.error(errorText)

    return
  }

  // 状态码 500
  if (status === 500) {
    let errorText = '服务器出错了！'

    if (data && typeof data === 'object' && !Array.isArray(data) && Reflect.has(data, 'errors')) {

      if (data.errors && typeof data.errors === 'string') {

        if (data.errors.includes('connect ECONNREFUSED')) {
          errorText = '服务器出错了！'
        } else if (data.errors.includes('Response timeout for 10000ms')) {
          errorText = '请求超时,请刷新页面重新获取数据！'
        } else {
          errorText = data.errors
        }

      }

      if (data.errors && typeof data.errors === 'object' && Array.isArray(data.errors)) {
        errorText = data.errors.join(',')
      }

      if (data.errors && typeof data.errors === 'object') {
        
        if(Reflect.has(data.errors, 'name') && Reflect.get(data.errors, 'name') === 'ResponseTimeoutError') {
          errorText = '请求超时,请刷新页面重新获取数据！'
        } else  {
          errorText = data.errors.name
        }

        if(Reflect.has(data.errors, 'msg')) {
          errorText = data.errors.msg
        }
      }

    }

    message.error(errorText)

    return;
  }

}