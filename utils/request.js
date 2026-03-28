/**
 * 清如 ClearSpring - 网络请求封装
 * 基于 V4.0 规范：统一错误处理、Token 注入、限流
 */

const BASE_URL = getApp().globalData.apiBase || 'https://api.clearspring.com'

// 错误码映射表
const ERROR_CODES = {
  // 通用错误
  1000: '系统繁忙，请稍后重试',
  1001: '订单不存在',
  1002: '需要资质认证',
  1003: '抢单失败，已被他人抢占',
  1004: '网络异常，请检查网络连接',
  1005: '请求超时',
  
  // 认证错误
  2001: '登录已过期，请重新登录',
  2002: '权限不足',
  2003: 'Token 无效',
  
  // 业务错误
  3001: '余额不足',
  3002: '订单状态异常',
  3003: '超出操作限制',
  3004: '参数错误',
  
  // 限流错误
  429: '操作过于频繁，请稍后再试'
}

// 请求限流（简单实现）
const rateLimit = {
  requests: {},
  
  check(userId, action, limit = 10, window = 60000) {
    const key = `${userId}:${action}`
    const now = Date.now()
    
    if (!this.requests[key]) {
      this.requests[key] = []
    }
    
    // 清理过期记录
    this.requests[key] = this.requests[key].filter(time => now - time < window)
    
    if (this.requests[key].length >= limit) {
      return false
    }
    
    this.requests[key].push(now)
    return true
  }
}

/**
 * 统一网络请求
 * @param {Object} options - 请求配置
 * @returns {Promise} 请求结果
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    // 限流检查
    if (userInfo && userInfo.openid) {
      const action = options.url.split('?')[0]
      if (!rateLimit.check(userInfo.openid, action, 10, 60000)) {
        wx.showToast({
          title: ERROR_CODES[429],
          icon: 'none'
        })
        reject({ errorCode: 429, message: ERROR_CODES[429] })
        return
      }
    }
    
    // 显示全局 loading
    if (options.loading !== false) {
      wx.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }
    
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'X-User-Id': userInfo?.openid || '',
        'X-Request-Id': generateRequestId()
      },
      timeout: options.timeout || 30000,
      
      success: (res) => {
        hideLoading()
        
        // HTTP 状态码处理
        if (res.statusCode >= 500) {
          handleError({ errorCode: 1000, message: '服务器错误' })
          reject({ errorCode: 1000, message: '服务器错误' })
          return
        }
        
        if (res.statusCode === 401) {
          // Token 过期，跳转登录
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          wx.navigateTo({ url: '/pages/login/login' })
          handleError({ errorCode: 2001, message: ERROR_CODES[2001] })
          reject({ errorCode: 2001, message: ERROR_CODES[2001] })
          return
        }
        
        if (res.statusCode === 429) {
          handleError({ errorCode: 429, message: ERROR_CODES[429] })
          reject({ errorCode: 429, message: ERROR_CODES[429] })
          return
        }
        
        // 业务错误处理
        const data = res.data
        if (data && data.errorCode && data.errorCode !== 0) {
          const message = ERROR_CODES[data.errorCode] || data.message || '请求失败'
          handleError({ errorCode: data.errorCode, message })
          reject({ errorCode: data.errorCode, message })
          return
        }
        
        // 成功响应
        resolve(data)
      },
      
      fail: (err) => {
        hideLoading()
        console.error('[请求失败]', err)
        
        let message = ERROR_CODES[1004]
        if (err.errMsg.includes('timeout')) {
          message = ERROR_CODES[1005]
        }
        
        handleError({ errorCode: 1004, message })
        reject({ errorCode: 1004, message })
      }
    })
  })
}

/**
 * 隐藏 loading
 */
function hideLoading() {
  wx.hideLoading({
    success: () => {}
  })
}

/**
 * 统一错误处理
 * @param {Object} error - 错误信息
 */
function handleError(error) {
  console.error('[业务错误]', error)
  
  // 记录错误日志（可接入监控系统）
  logError(error)
  
  // 非用户主动操作才显示错误提示
  if (!error.silent) {
    wx.showToast({
      title: error.message || '操作失败',
      icon: 'none',
      duration: 2000
    })
  }
}

/**
 * 错误日志记录
 * @param {Object} error - 错误信息
 */
function logError(error) {
  const userInfo = wx.getStorageSync('userInfo')
  const logs = wx.getStorageSync('errorLogs') || []
  
  logs.push({
    timestamp: Date.now(),
    errorCode: error.errorCode,
    message: error.message,
    page: getCurrentPage(),
    userId: userInfo?.openid || 'anonymous',
    userAgent: wx.getSystemInfoSync().model
  })
  
  // 只保留最近 100 条
  if (logs.length > 100) {
    logs.splice(0, logs.length - 100)
  }
  
  wx.setStorageSync('errorLogs', logs)
  
  // TODO: 上报到服务端日志系统
  // request({ url: '/log/error', method: 'POST', data: error, loading: false })
}

/**
 * 获取当前页面
 */
function getCurrentPage() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage ? currentPage.route : 'unknown'
}

/**
 * 生成请求 ID
 */
function generateRequestId() {
  return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * GET 请求快捷方法
 */
function get(url, data = {}, options = {}) {
  return request({ url, method: 'GET', data, ...options })
}

/**
 * POST 请求快捷方法
 */
function post(url, data = {}, options = {}) {
  return request({ url, method: 'POST', data, ...options })
}

/**
 * 文件上传（支持断点续传）
 */
function uploadFile(options) {
  const { url, filePath, name = 'file', formData = {}, onProgress } = options
  
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    
    const uploadTask = wx.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      
      success: (res) => {
        wx.hideLoading()
        try {
          const data = JSON.parse(res.data)
          if (data.errorCode && data.errorCode !== 0) {
            handleError({ errorCode: data.errorCode, message: data.message })
            reject(data)
          } else {
            resolve(data)
          }
        } catch (e) {
          reject({ message: '解析响应失败' })
        }
      },
      
      fail: (err) => {
        wx.hideLoading()
        handleError({ errorCode: 1004, message: '上传失败' })
        reject(err)
      }
    })
    
    // 监听上传进度
    if (onProgress && uploadTask.onProgressUpdate) {
      uploadTask.onProgressUpdate((progressEvent) => {
        onProgress(progressEvent.progress)
      })
    }
  })
}

/**
 * 下载文件
 */
function downloadFile(url, options = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    
    wx.showLoading({
      title: '下载中...',
      mask: true
    })
    
    wx.downloadFile({
      url: BASE_URL + url,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject({ message: '下载失败' })
        }
      },
      
      fail: (err) => {
        wx.hideLoading()
        reject(err)
      }
    })
  })
}

export default {
  request,
  get,
  post,
  uploadFile,
  downloadFile,
  handleError,
  logError
}
