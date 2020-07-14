/* global window */

import cloneDeep from 'lodash.clonedeep'

export classnames from 'classnames'
export config from './config'
export request from './request'

// 连字符转驼峰
// eslint-disable-next-line no-extend-native
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
// eslint-disable-next-line no-extend-native
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
// eslint-disable-next-line no-extend-native
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param  name {String}
 * @return  {String}
 */
export function queryURL(name) {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray(array, key, keyAlias = 'key') {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree(array, id = 'id', pid = 'pid', children = 'children') {
  let data = cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

export const coin_base_four_num = (value, activeItem) => {
  let n = 4;

  const is_true = activeItem
    && typeof activeItem === 'object'
    && Reflect.has(activeItem, 'coin')
    && Reflect.has(activeItem.coin, 'name')

  n = is_true && (activeItem.coin.name === 'btc' || activeItem.coin.name === 'eth') ? 8 : 4

  return Number(value) === 0 ? value : Number(value).toFixed(n)
}

export const coin_base_two_num = (value = 0, activeItem) => {
  let n = 2;

  const is_true = activeItem
    && typeof activeItem === 'object'
    && Reflect.has(activeItem, 'coin')
    && Reflect.has(activeItem.coin, 'name')

  n = is_true && (activeItem.coin.name === 'btc' || activeItem.coin.name === 'eth') ? 8 : 2

  return Number(value) === 0 ? 0 : Number(value).toFixed(n)
}
const NodeRSA = require('node-rsa');

const rsa_key = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQAnyIGFx4Kwr2/XhMQLH/6onp
u6cS3ed2AEWOHkmAPfbHZGWmr7h43ooPQFH4fFB32lYPxIXkGzAlikaGV6fktBJp
ALbP0rtfRbeJe2pOYRx9bsuBRBI1NafSOsui62Pb8OvYqa5T+g5XxMvCi7OZ0a3e
/S5rCkaQMcOytF+guQIDAQAB
-----END PUBLIC KEY-----`;
const publicKey = new NodeRSA(rsa_key, {
  encryptionScheme: 'pkcs1',
});

export const encrypt = (value) => {
  return publicKey.encrypt(value, 'base64');
}

// 阿拉伯数字转中文数字
export function numberToChinese(num) {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    alert("Number is wrong!");
    return "Number is wrong!";
  }
  var AA = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var BB = ["", "十", "百", "千", "万", "亿", "点", ""];
  var a = ("" + num).replace(/(^0*)/g, "").split("."),
    k = 0,
    re = "";
  for (var i = a[0].length - 1; i >= 0; i--) {
    // eslint-disable-next-line default-case
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
          re = BB[4] + re;
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 === 2 && a[0].charAt(i + 2) !== 0 && a[0].charAt(i + 1) === 0) re = AA[0] + re;
    if (a[0].charAt(i) !== 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }
  if (a.length > 1) //加上小数部分(如果有小数部分) 
  {
    re += BB[6];
    for (let i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
  }
  return re;
};


export function twoNumber(value) {

  let new_value = value ? Number(value) : 0

  return Math.floor(new_value * 100) / 100
}

export function isNumber(val) {

  return val === "" || val == null ? false : !isNaN(val)
}

export const realTimeEarningRatio = ({
  deep_bids,
  positionNum,
  positionCost,
}) => {
  let priceSum = 0;
  for (const item of deep_bids) {
    const [price, num] = item;
    if (positionNum - 0 - num >= 0) {
      priceSum += price * num;
      positionNum -= num;
    } else {
      priceSum += price * positionNum;
      break;
    }
  }
  return priceSum / positionCost;
}