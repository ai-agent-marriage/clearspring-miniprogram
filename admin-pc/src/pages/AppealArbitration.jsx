import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

/**
 * 申诉仲裁页
 * 双方证据对比，仲裁决定
 */
function AppealArbitration() {
  const [selectedAppeal, setSelectedAppeal] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [arbitrationResult, setArbitrationResult] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // 模拟申诉数据
  const appeals = [
    {
      id: 1,
      orderNo: 'ORD202603280005',
      customer: {
        name: '杨先生',
        phone: '138****1234',
        claim: '服务未完成，要求全额退款',
        evidence: [
          { type: 'image', name: '聊天记录截图 1.png', url: '#' },
          { type: 'image', name: '服务过程录音.mp3', url: '#' }
        ]
      },
      executor: {
        name: '刘**',
        phone: '139****5678',
        defense: '已完成服务，客户无理要求退款',
        evidence: [
          { type: 'image', name: '服务完成证明.jpg', url: '#' },
          { type: 'image', name: '客户确认截图.png', url: '#' }
        ]
      },
      amount: 680,
      applyTime: '2026-03-28 14:30',
      status: 'pending'
    },
    {
      id: 2,
      orderNo: 'ORD202603270012',
      customer: {
        name: '周女士',
        phone: '137****9012',
        claim: '服务质量不达标，要求部分退款',
        evidence: [
          { type: 'image', name: '问题截图.png', url: '#' }
        ]
      },
      executor: {
        name: '陈**',
        phone: '136****3456',
        defense: '服务符合标准，客户期望过高',
        evidence: [
          { type: 'image', name: '服务报告.pdf', url: '#' },
          { type: 'document', name: '资质证明.pdf', url: '#' }
        ]
      },
      amount: 450,
      applyTime: '2026-03-27 16:20',
      status: 'pending'
    },
    {
      id: 3,
      orderNo: 'ORD202603260008',
      customer: {
        name: '吴先生',
        phone: '135****7890',
        claim: '执行者迟到超过 1 小时',
        evidence: [
          { type: 'image', name: '时间记录截图.png', url: '#' }
        ]
      },
      executor: {
        name: '杨**',
        phone: '134****2345',
        defense: '因交通意外迟到，已提前告知客户',
        evidence: [
          { type: 'image', name: '聊天记录.png', url: '#' }
        ]
      },
      amount: 320,
      applyTime: '2026-03-26 10:15',
      status: 'arbitrated',
      result: 'partial_refund',
      arbitrationNote: '执行者确有迟到，但已提前告知。建议退还 20% 费用。'
    }
  ]

  const statusMap = {
    pending: { label: '待仲裁', class: 'badge-error' },
    arbitrated: { label: '已仲裁', class: 'badge-success' }
  }

  const resultMap = {
    full_refund: '全额退款',
    partial_refund: '部分退款',
    no_refund: '不予退款',
    compensate: '额外补偿'
  }

  const handleViewDetail = (appeal) => {
    setSelectedAppeal(appeal)
    setArbitrationResult('')
    setShowDetailModal(true)
  }

  const handleArbitrate = () => {
    if (!arbitrationResult.trim()) {
      alert('请填写仲裁结果')
      return
    }
    setShowConfirmModal(true)
  }

  const confirmArbitration = () => {
    // 记录审计日志
    const auditLog = {
      action: 'APPEAL_ARBITRATION',
      appealId: selectedAppeal.id,
      orderNo: selectedAppeal.orderNo,
      result: arbitrationResult,
      timestamp: new Date().toISOString(),
      operator: 'admin'
    }
    console.log('Audit Log:', auditLog)

    // 记录二次验证
    const verificationLog = {
      type: 'TWO_FACTOR_VERIFICATION',
      action: 'ARBITRATION',
      verified: true,
      timestamp: new Date().toISOString()
    }
    console.log('Verification Log:', verificationLog)

    alert('仲裁决定已提交')
    setShowConfirmModal(false)
    setShowDetailModal(false)
    setSelectedAppeal(null)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="appeals" />
      
      <main className="flex-1 p-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">申诉仲裁</h1>
          <p className="text-gray-500 mt-1">查看双方证据，做出公平仲裁决定</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待仲裁</p>
                <p className="text-2xl font-bold text-status-error mt-1">
                  {appeals.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已仲裁</p>
                <p className="text-2xl font-bold text-status-success mt-1">
                  {appeals.filter(a => a.status === 'arbitrated').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">涉及金额</p>
                <p className="text-2xl font-bold text-dailv mt-1">
                  ¥{appeals.filter(a => a.status === 'pending').reduce((sum, a) => sum + a.amount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-dailv-lighter bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 申诉列表 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">申诉列表</h3>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>订单号</th>
                  <th>客户</th>
                  <th>执行者</th>
                  <th>金额</th>
                  <th>申请时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {appeals.map((appeal) => (
                  <tr key={appeal.id}>
                    <td className="font-mono text-sm">{appeal.orderNo}</td>
                    <td>{appeal.customer.name}</td>
                    <td className="masked-text">{appeal.executor.name}</td>
                    <td className="font-medium">¥{appeal.amount}</td>
                    <td className="text-sm text-gray-500">{appeal.applyTime}</td>
                    <td>
                      <span className={`badge ${statusMap[appeal.status].class}`}>
                        {statusMap[appeal.status].label}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewDetail(appeal)}
                        className="text-dailv hover:text-dailv-dark text-sm font-medium"
                      >
                        {appeal.status === 'pending' ? '仲裁' : '查看'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 详情弹窗 */}
        {showDetailModal && selectedAppeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    申诉详情 - {selectedAppeal.orderNo}
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* 双方证据对比 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* 客户方 */}
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-status-error rounded-full mr-2"></span>
                      客户方
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">姓名：</span>
                        <span className="text-gray-900">{selectedAppeal.customer.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">手机：</span>
                        <span className="masked-text">{selectedAppeal.customer.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">申诉主张：</span>
                        <p className="text-gray-900 mt-1">{selectedAppeal.customer.claim}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">证据材料：</span>
                        <div className="mt-1 space-y-1">
                          {selectedAppeal.customer.evidence.map((item, idx) => (
                            <div key={idx} className="flex items-center text-dailv">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 执行者方 */}
                  <div className="border border-dailv-lighter rounded-lg p-4 bg-dailv-lighter bg-opacity-10">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-dailv rounded-full mr-2"></span>
                      执行者方
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-500">姓名：</span>
                        <span className="masked-text">{selectedAppeal.executor.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">手机：</span>
                        <span className="masked-text">{selectedAppeal.executor.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">申辩说明：</span>
                        <p className="text-gray-900 mt-1">{selectedAppeal.executor.defense}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">证据材料：</span>
                        <div className="mt-1 space-y-1">
                          {selectedAppeal.executor.evidence.map((item, idx) => (
                            <div key={idx} className="flex items-center text-dailv">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 仲裁决定 */}
                {selectedAppeal.status === 'pending' ? (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">仲裁决定</h4>
                    <textarea
                      value={arbitrationResult}
                      onChange={(e) => setArbitrationResult(e.target.value)}
                      className="input-field h-32 resize-none"
                      placeholder="请输入仲裁结果和说明..."
                    />
                    <div className="mt-4 flex gap-3">
                      <select className="input-field w-48">
                        <option value="">选择仲裁结果</option>
                        <option value="full_refund">全额退款</option>
                        <option value="partial_refund">部分退款</option>
                        <option value="no_refund">不予退款</option>
                        <option value="compensate">额外补偿</option>
                      </select>
                      <button onClick={handleArbitrate} className="btn-primary">
                        提交仲裁决定
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">仲裁结果</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-success">已仲裁</span>
                        <span className="text-dailv font-medium">{resultMap[selectedAppeal.result]}</span>
                      </div>
                      <p className="text-gray-700">{selectedAppeal.arbitrationNote}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 确认弹窗 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">确认仲裁决定</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm text-status-warning">
                  ⚠️ 仲裁决定提交后不可更改，将记录审计日志
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn-secondary flex-1"
                >
                  返回修改
                </button>
                <button
                  onClick={confirmArbitration}
                  className="btn-primary flex-1"
                >
                  确认提交
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AppealArbitration
