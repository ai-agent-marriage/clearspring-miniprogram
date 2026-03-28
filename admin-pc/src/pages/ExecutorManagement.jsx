import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

/**
 * 执行者管理页
 * 列表 + 详情，敏感信息脱敏
 */
function ExecutorManagement() {
  const [selectedExecutor, setSelectedExecutor] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filters, setFilters] = useState({
    name: '',
    level: '',
    status: '',
    skillType: ''
  })

  // 模拟执行者数据
  const executors = [
    {
      id: 1,
      name: '李**',
      phone: '138****5678',
      idCard: '110101********1234',
      email: 'li***@example.com',
      level: '高级',
      status: 'active',
      skillType: '心理咨询',
      certificates: ['心理咨询师三级', '心理健康教育'],
      experience: '5 年',
      totalOrders: 156,
      completionRate: 98.5,
      rating: 4.8,
      joinDate: '2025-06-15',
      lastActive: '2026-03-28 10:30'
    },
    {
      id: 2,
      name: '王**',
      phone: '139****1234',
      idCard: '310101********5678',
      email: 'wang***@example.com',
      level: '中级',
      status: 'active',
      skillType: '法律咨询',
      certificates: ['法律职业资格证书', '律师执业证'],
      experience: '8 年',
      totalOrders: 203,
      completionRate: 99.2,
      rating: 4.9,
      joinDate: '2025-03-20',
      lastActive: '2026-03-28 11:15'
    },
    {
      id: 3,
      name: '张**',
      phone: '137****9012',
      idCard: '440101********9012',
      email: 'zhang***@example.com',
      level: '初级',
      status: 'inactive',
      skillType: '财务规划',
      certificates: ['注册会计师', '理财规划师'],
      experience: '10 年',
      totalOrders: 89,
      completionRate: 96.8,
      rating: 4.6,
      joinDate: '2025-09-10',
      lastActive: '2026-03-25 16:20'
    },
    {
      id: 4,
      name: '赵**',
      phone: '136****3456',
      idCard: '330101********3456',
      email: 'zhao***@example.com',
      level: '专家',
      status: 'active',
      skillType: '健康管理',
      certificates: ['健康管理师', '营养师', '运动康复师'],
      experience: '12 年',
      totalOrders: 342,
      completionRate: 99.8,
      rating: 5.0,
      joinDate: '2024-11-05',
      lastActive: '2026-03-28 14:00'
    },
    {
      id: 5,
      name: '刘**',
      phone: '135****7890',
      idCard: '510101********7890',
      email: 'liu***@example.com',
      level: '中级',
      status: 'banned',
      skillType: '心理咨询',
      certificates: ['心理咨询师二级'],
      experience: '6 年',
      totalOrders: 178,
      completionRate: 94.2,
      rating: 4.3,
      joinDate: '2025-04-18',
      lastActive: '2026-03-20 09:30',
      banReason: '多次被客户投诉服务态度问题'
    }
  ]

  const levelMap = {
    '初级': 'badge-success',
    '中级': 'badge-warning',
    '高级': 'badge-info',
    '专家': 'badge-error'
  }

  const statusMap = {
    active: { label: '活跃', class: 'badge-success' },
    inactive: { label: '未激活', class: 'badge-info' },
    banned: { label: '已封禁', class: 'badge-error' }
  }

  const handleViewDetail = (executor) => {
    setSelectedExecutor(executor)
    setShowDetailModal(true)
  }

  const handleBan = (executor) => {
    const reason = prompt('请输入封禁原因：')
    if (reason) {
      // 记录审计日志
      const auditLog = {
        action: 'EXECUTOR_BAN',
        executorId: executor.id,
        executorName: executor.name,
        reason: reason,
        timestamp: new Date().toISOString(),
        operator: 'admin'
      }
      console.log('Audit Log:', auditLog)
      alert('执行者已封禁')
    }
  }

  const handleUnban = (executor) => {
    if (confirm(`确定要解封执行者 ${executor.name} 吗？`)) {
      // 记录审计日志
      const auditLog = {
        action: 'EXECUTOR_UNBAN',
        executorId: executor.id,
        executorName: executor.name,
        timestamp: new Date().toISOString(),
        operator: 'admin'
      }
      console.log('Audit Log:', auditLog)
      alert('执行者已解封')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="executors" />
      
      <main className="flex-1 p-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">执行者管理</h1>
          <p className="text-gray-500 mt-1">查看和管理执行者信息，敏感信息已脱敏</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总执行者</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{executors.length}</p>
              </div>
              <div className="w-12 h-12 bg-dailv-lighter bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">活跃</p>
                <p className="text-2xl font-bold text-status-success mt-1">
                  {executors.filter(e => e.status === 'active').length}
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
                <p className="text-sm text-gray-500">未激活</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {executors.filter(e => e.status === 'inactive').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-status-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已封禁</p>
                <p className="text-2xl font-bold text-status-error mt-1">
                  {executors.filter(e => e.status === 'banned').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选区域 */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="input-field"
                placeholder="请输入姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">等级</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                className="input-field"
              >
                <option value="">全部</option>
                <option value="初级">初级</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
                <option value="专家">专家</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">全部</option>
                <option value="active">活跃</option>
                <option value="inactive">未激活</option>
                <option value="banned">已封禁</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">技能类型</label>
              <input
                type="text"
                value={filters.skillType}
                onChange={(e) => setFilters({ ...filters, skillType: e.target.value })}
                className="input-field"
                placeholder="请输入技能类型"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn-primary">查询</button>
            <button className="btn-secondary" onClick={() => setFilters({ name: '', level: '', status: '', skillType: '' })}>重置</button>
          </div>
        </div>

        {/* 执行者列表 */}
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>手机</th>
                  <th>等级</th>
                  <th>技能类型</th>
                  <th>订单数</th>
                  <th>完成率</th>
                  <th>评分</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {executors.map((executor) => (
                  <tr key={executor.id}>
                    <td className="font-medium">{executor.name}</td>
                    <td className="masked-text">{executor.phone}</td>
                    <td>
                      <span className={`badge ${levelMap[executor.level]}`}>
                        {executor.level}
                      </span>
                    </td>
                    <td>{executor.skillType}</td>
                    <td>{executor.totalOrders}</td>
                    <td>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-dailv h-2 rounded-full"
                            style={{ width: `${executor.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{executor.completionRate}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center text-yellow-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="ml-1 text-gray-900">{executor.rating}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${statusMap[executor.status].class}`}>
                        {statusMap[executor.status].label}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewDetail(executor)}
                        className="text-dailv hover:text-dailv-dark text-sm font-medium mr-3"
                      >
                        详情
                      </button>
                      {executor.status === 'active' && (
                        <button
                          onClick={() => handleBan(executor)}
                          className="text-status-error hover:text-red-700 text-sm font-medium"
                        >
                          封禁
                        </button>
                      )}
                      {executor.status === 'banned' && (
                        <button
                          onClick={() => handleUnban(executor)}
                          className="text-status-success hover:text-green-700 text-sm font-medium"
                        >
                          解封
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 详情弹窗 */}
        {showDetailModal && selectedExecutor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">执行者详情</h3>
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
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">基本信息</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">姓名：</span>
                        <span className="text-gray-900">{selectedExecutor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">手机：</span>
                        <span className="masked-text">{selectedExecutor.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">身份证：</span>
                        <span className="masked-text">{selectedExecutor.idCard}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">邮箱：</span>
                        <span className="text-gray-900">{selectedExecutor.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">等级：</span>
                        <span className={`badge ${levelMap[selectedExecutor.level]}`}>
                          {selectedExecutor.level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">状态：</span>
                        <span className={`badge ${statusMap[selectedExecutor.status].class}`}>
                          {statusMap[selectedExecutor.status].label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">执业信息</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">技能类型：</span>
                        <span className="text-gray-900">{selectedExecutor.skillType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">从业经验：</span>
                        <span className="text-gray-900">{selectedExecutor.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">加入日期：</span>
                        <span className="text-gray-900">{selectedExecutor.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">最后活跃：</span>
                        <span className="text-gray-900">{selectedExecutor.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">资质证书</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExecutor.certificates.map((cert, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-dailv-lighter bg-opacity-20 text-dailv">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">数据统计</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{selectedExecutor.totalOrders}</p>
                      <p className="text-sm text-gray-500 mt-1">总订单数</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-dailv">{selectedExecutor.completionRate}%</p>
                      <p className="text-sm text-gray-500 mt-1">完成率</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-500">{selectedExecutor.rating}</p>
                      <p className="text-sm text-gray-500 mt-1">评分</p>
                    </div>
                  </div>
                </div>

                {selectedExecutor.status === 'banned' && selectedExecutor.banReason && (
                  <div className="border-t border-gray-200 mt-6 pt-6">
                    <h4 className="font-semibold text-status-error mb-2">封禁原因</h4>
                    <p className="text-gray-700 bg-red-50 rounded-lg p-4">{selectedExecutor.banReason}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full btn-primary py-3"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ExecutorManagement
