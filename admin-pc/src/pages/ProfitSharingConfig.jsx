import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

/**
 * 分账配置页
 * 比例配置，操作留痕
 */
function ProfitSharingConfig() {
  const [config, setConfig] = useState({
    platformRate: 20, // 平台分成比例 (%)
    executorMinRate: 70, // 执行者最低比例 (%)
    executorMaxRate: 85, // 执行者最高比例 (%)
    minOrderAmount: 50, // 最低订单金额
    maxOrderAmount: 10000, // 最高订单金额
    autoWithdrawThreshold: 100, // 自动提现门槛
    withdrawFeeRate: 1 // 提现手续费率 (%)
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [changeReason, setChangeReason] = useState('')
  const [operationHistory, setOperationHistory] = useState([
    { id: 1, action: '修改平台分成比例', oldValue: '18%', newValue: '20%', operator: 'admin', time: '2026-03-25 14:30' },
    { id: 2, action: '调整提现门槛', oldValue: '¥200', newValue: '¥100', operator: 'admin', time: '2026-03-20 09:15' },
    { id: 3, action: '修改手续费率', oldValue: '2%', newValue: '1%', operator: 'admin', time: '2026-03-15 16:45' }
  ])

  const handleChange = (field, value) => {
    setConfig({
      ...config,
      [field]: Number(value)
    })
  }

  const handleSave = () => {
    setShowConfirmModal(true)
  }

  const confirmSave = () => {
    if (!changeReason.trim()) {
      alert('请填写修改原因')
      return
    }

    // 记录审计日志
    const auditLog = {
      action: 'PROFIT_SHARING_CONFIG_UPDATE',
      changes: {
        platformRate: `${config.platformRate}%`,
        executorMinRate: `${config.executorMinRate}%`,
        executorMaxRate: `${config.executorMaxRate}%`,
        minOrderAmount: `¥${config.minOrderAmount}`,
        maxOrderAmount: `¥${config.maxOrderAmount}`,
        autoWithdrawThreshold: `¥${config.autoWithdrawThreshold}`,
        withdrawFeeRate: `${config.withdrawFeeRate}%`
      },
      reason: changeReason,
      timestamp: new Date().toISOString(),
      operator: 'admin'
    }
    console.log('Audit Log:', auditLog)

    // 添加到操作历史
    const newHistory = {
      id: Date.now(),
      action: '更新分账配置',
      oldValue: '-',
      newValue: changeReason,
      operator: 'admin',
      time: new Date().toLocaleString('zh-CN')
    }
    setOperationHistory([newHistory, ...operationHistory])

    alert('配置已保存')
    setShowConfirmModal(false)
    setChangeReason('')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="profit-sharing" />
      
      <main className="flex-1 p-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">分账配置</h1>
          <p className="text-gray-500 mt-1">配置平台与执行者的分账比例，所有修改将记录审计日志</p>
        </div>

        {/* 配置表单 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 分账比例配置 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              分账比例配置
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">平台分成比例</label>
                  <span className="text-dailv font-semibold">{config.platformRate}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={config.platformRate}
                  onChange={(e) => handleChange('platformRate', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-dailv"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>30%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  执行者分成比例：{100 - config.platformRate}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    执行者最低比例 (%)
                  </label>
                  <input
                    type="number"
                    value={config.executorMinRate}
                    onChange={(e) => handleChange('executorMinRate', e.target.value)}
                    className="input-field"
                    min="50"
                    max="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    执行者最高比例 (%)
                  </label>
                  <input
                    type="number"
                    value={config.executorMaxRate}
                    onChange={(e) => handleChange('executorMaxRate', e.target.value)}
                    className="input-field"
                    min="50"
                    max="90"
                  />
                </div>
              </div>

              <div className="bg-dailv-lighter bg-opacity-10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-dailv-dark mb-3">分成示例</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">订单金额 ¥1000</span>
                    <span className="text-gray-900">平台：¥{1000 * config.platformRate / 100} | 执行者：¥{1000 * (100 - config.platformRate) / 100}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">订单金额 ¥5000</span>
                    <span className="text-gray-900">平台：¥{5000 * config.platformRate / 100} | 执行者：¥{5000 * (100 - config.platformRate) / 100}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 订单限额配置 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              订单限额配置
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最低订单金额 (元)
                </label>
                <input
                  type="number"
                  value={config.minOrderAmount}
                  onChange={(e) => handleChange('minOrderAmount', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最高订单金额 (元)
                </label>
                <input
                  type="number"
                  value={config.maxOrderAmount}
                  onChange={(e) => handleChange('maxOrderAmount', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">提现配置</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      自动提现门槛 (元)
                    </label>
                    <input
                      type="number"
                      value={config.autoWithdrawThreshold}
                      onChange={(e) => handleChange('autoWithdrawThreshold', e.target.value)}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      提现手续费率 (%)
                    </label>
                    <input
                      type="number"
                      value={config.withdrawFeeRate}
                      onChange={(e) => handleChange('withdrawFeeRate', e.target.value)}
                      className="input-field"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full btn-primary py-3"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>

        {/* 操作历史 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            操作历史记录
          </h3>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>操作</th>
                  <th>修改原因</th>
                  <th>操作人</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                {operationHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium text-gray-900">{item.action}</td>
                    <td className="text-gray-600">{item.newValue}</td>
                    <td>{item.operator}</td>
                    <td className="text-sm text-gray-500">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 确认弹窗 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">确认修改配置</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">即将修改以下配置：</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                  <p>• 平台分成比例：{config.platformRate}%</p>
                  <p>• 执行者分成范围：{config.executorMinRate}% - {config.executorMaxRate}%</p>
                  <p>• 订单金额限制：¥{config.minOrderAmount} - ¥{config.maxOrderAmount}</p>
                  <p>• 自动提现门槛：¥{config.autoWithdrawThreshold}</p>
                  <p>• 提现手续费率：{config.withdrawFeeRate}%</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  修改原因 <span className="text-status-error">*</span>
                </label>
                <textarea
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  className="input-field h-24 resize-none"
                  placeholder="请详细说明修改原因"
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm text-status-warning">
                  ⚠️ 此操作将记录审计日志，不可删除
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={confirmSave}
                  className="btn-primary flex-1"
                >
                  确认保存
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProfitSharingConfig
