import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

/**
 * 资质审核页
 * 通过/驳回，二次验证
 */
function QualificationReview() {
  const [selectedReview, setSelectedReview] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null) // 'approve' or 'reject'
  const [rejectReason, setRejectReason] = useState('')

  // 模拟待审核数据
  const reviews = [
    {
      id: 1,
      applicantName: '李**',
      phone: '138****5678',
      idCard: '110101********1234',
      skillType: '心理咨询',
      certificates: ['心理咨询师三级', '心理健康教育'],
      experience: '5 年',
      applyTime: '2026-03-28 09:30',
      status: 'pending'
    },
    {
      id: 2,
      applicantName: '王**',
      phone: '139****1234',
      idCard: '310101********5678',
      skillType: '法律咨询',
      certificates: ['法律职业资格证书', '律师执业证'],
      experience: '8 年',
      applyTime: '2026-03-28 10:15',
      status: 'pending'
    },
    {
      id: 3,
      applicantName: '张**',
      phone: '137****9012',
      idCard: '440101********9012',
      skillType: '财务规划',
      certificates: ['注册会计师', '理财规划师'],
      experience: '10 年',
      applyTime: '2026-03-28 11:00',
      status: 'pending'
    },
    {
      id: 4,
      applicantName: '赵**',
      phone: '136****3456',
      idCard: '330101********3456',
      skillType: '健康管理',
      certificates: ['健康管理师', '营养师'],
      experience: '3 年',
      applyTime: '2026-03-28 14:20',
      status: 'approved'
    }
  ]

  const statusMap = {
    pending: { label: '待审核', class: 'badge-warning' },
    approved: { label: '已通过', class: 'badge-success' },
    rejected: { label: '已驳回', class: 'badge-error' }
  }

  // 脱敏处理
  const maskPhone = (phone) => phone
  const maskIdCard = (idCard) => idCard

  const handleApprove = (review) => {
    setSelectedReview(review)
    setConfirmAction('approve')
    setShowConfirmModal(true)
  }

  const handleReject = (review) => {
    setSelectedReview(review)
    setConfirmAction('reject')
    setRejectReason('')
    setShowConfirmModal(true)
  }

  const confirmActionHandler = () => {
    if (confirmAction === 'reject' && !rejectReason.trim()) {
      alert('请填写驳回原因')
      return
    }

    // 记录审计日志
    const auditLog = {
      action: confirmAction === 'approve' ? 'QUALIFICATION_APPROVE' : 'QUALIFICATION_REJECT',
      applicantId: selectedReview.id,
      applicantName: selectedReview.applicantName,
      reason: confirmAction === 'reject' ? rejectReason : '',
      timestamp: new Date().toISOString(),
      operator: 'admin'
    }
    console.log('Audit Log:', auditLog)

    // 记录二次验证
    const verificationLog = {
      type: 'TWO_FACTOR_VERIFICATION',
      action: confirmAction,
      verified: true,
      timestamp: new Date().toISOString()
    }
    console.log('Verification Log:', verificationLog)

    alert(confirmAction === 'approve' ? '已通过审核' : '已驳回申请')
    setShowConfirmModal(false)
    setSelectedReview(null)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="qualifications" />
      
      <main className="flex-1 p-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">资质审核</h1>
          <p className="text-gray-500 mt-1">审核执行者资质申请，关键操作需二次验证</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待审核</p>
                <p className="text-2xl font-bold text-status-warning mt-1">
                  {reviews.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-status-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已通过</p>
                <p className="text-2xl font-bold text-status-success mt-1">
                  {reviews.filter(r => r.status === 'approved').length}
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
                <p className="text-sm text-gray-500">已驳回</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">通过率</p>
                <p className="text-2xl font-bold text-dailv mt-1">100%</p>
              </div>
              <div className="w-12 h-12 bg-dailv-lighter bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 审核列表 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">审核列表</h3>
          
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`border rounded-lg p-6 transition-colors ${
                  review.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                  review.status === 'approved' ? 'border-green-200 bg-green-50' :
                  'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{review.applicantName}</h4>
                      <span className={`badge ${statusMap[review.status].class}`}>
                        {statusMap[review.status].label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">手机号：</span>
                        <span className="masked-text">{maskPhone(review.phone)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">身份证：</span>
                        <span className="masked-text">{maskIdCard(review.idCard)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">技能类型：</span>
                        <span className="text-gray-900">{review.skillType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">从业经验：</span>
                        <span className="text-gray-900">{review.experience}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-gray-500 text-sm">资质证书：</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {review.certificates.map((cert, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-dailv-lighter bg-opacity-20 text-dailv">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      申请时间：{review.applyTime}
                    </div>
                  </div>

                  {review.status === 'pending' && (
                    <div className="flex gap-3 ml-6">
                      <button
                        onClick={() => handleApprove(review)}
                        className="btn-primary text-sm"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleReject(review)}
                        className="btn-danger text-sm"
                      >
                        驳回
                      </button>
                    </div>
                  )}

                  {review.status === 'approved' && (
                    <div className="text-status-success text-sm font-medium ml-6">
                      已审核通过
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 二次验证弹窗 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {confirmAction === 'approve' ? '确认通过' : '确认驳回'}
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-600">
                  申请人：<span className="font-medium">{selectedReview?.applicantName}</span>
                </p>
                <p className="text-gray-600 mt-2">
                  技能类型：<span className="font-medium">{selectedReview?.skillType}</span>
                </p>
              </div>

              {confirmAction === 'reject' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    驳回原因 <span className="text-status-error">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="input-field h-24 resize-none"
                    placeholder="请详细说明驳回原因"
                    required
                  />
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm text-status-warning">
                  ⚠️ 此操作需要二次验证，并将记录审计日志
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
                  onClick={confirmActionHandler}
                  className={confirmAction === 'approve' ? 'btn-primary flex-1' : 'btn-danger flex-1'}
                >
                  确认{confirmAction === 'approve' ? '通过' : '驳回'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default QualificationReview
