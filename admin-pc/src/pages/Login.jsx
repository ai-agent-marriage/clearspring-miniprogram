import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 管理员登录页
 * 极简办公风，岱绿系配色
 */
function Login({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 模拟登录验证
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 简单的验证逻辑（实际应调用 API）
      if (formData.username && formData.password) {
        // 记录登录审计日志
        const auditLog = {
          action: 'LOGIN',
          username: formData.username,
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100', // 实际应从后端获取
          success: true
        }
        console.log('Audit Log:', auditLog)
        
        onLogin()
        navigate('/dashboard')
      } else {
        setError('请输入用户名和密码')
      }
    } catch (err) {
      setError('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-dailv rounded-lg mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dailv-dark">清如 ClearSpring</h1>
          <p className="text-gray-500 mt-2">管理后台</p>
        </div>

        {/* 登录表单 */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-status-error px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="请输入密码"
                required
              />
            </div>

            <div>
              <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-2">
                验证码
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="captcha"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  className="input-field flex-1"
                  placeholder="请输入验证码"
                  required
                />
                <div className="w-28 h-10 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                  ABCD
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2026 清如 ClearSpring. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
