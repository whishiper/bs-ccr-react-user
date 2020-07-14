/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import { extend } from 'umi-request';

import handleError from './handleError'

/**
 * 异常处理程序
 */

const errorHandler = async error => {

  const { new_response = {}, new_data } = error;

  const { status = '', url = '', } = new_response;

  try {
    handleError({ status, url, data: new_data })
  } catch (error) {
    console.log(error, '---')
  }

};



/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {

  let { data, params } = options
  const robotId = sessionStorage.getItem('robotId');
  const tradePlatformApiBindProductComboId = sessionStorage.getItem('tradePlatformApiBindProductComboId');
  const tradePatformApi = JSON.parse(sessionStorage.getItem('tradePatformApi')) || {};
  const { tradePlatform } = tradePatformApi

  if (!url.includes('/getIp')) {

    if (robotId && data) {
      Object.assign(data, { robotId })
    }
    if (robotId && params) {
      Object.assign(params, { robotId })
    }

    if (tradePlatformApiBindProductComboId && data) {
      Object.assign(data, { tradePlatformApiBindProductComboId })
    }
    if (tradePlatformApiBindProductComboId && params) {
      Object.assign(params, { tradePlatformApiBindProductComboId })
    }

    if (tradePlatform && data) {

      Object.assign(data, { plantFormName: tradePlatform.name })
    }

    if (tradePlatform && params) {
      Object.assign(params, { plantFormName: tradePlatform.name })
    }

  }

  let new_options = {
    ...options,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Set-Cookie': 'Set-Cookie: CookieName=CookieValue; SameSite=Lax;'
    },
    params,
    data,
    interceptors: true
  }

  if (url.includes('market/detail/merged') || url.includes('/market/tickers')) {
    params = {}
    new_options = {
      ...options,
      params,
      interceptors: true,
    }
  }


  return ({ options: new_options });
});

class ResponseError extends Error {
  constructor(response, data) {
    super()
    this.name = data.name || ''
    this.new_data = data
    this.new_response = response
  }
}

// 响应后拦截器
request.interceptors.response.use(async response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const data = await response.json()
    throw new ResponseError(response, data)
  }
})



export default request;
