import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

/**
 * 系统设置页
 * 权限配置
 */
function SystemSettings() {
  const [activeTab, setActiveTab] = useState('permissions')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  // 模拟角色数据
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: '超级管理员',
      description: '拥有系统所有权限',
      permissions: ['all'],
      userCount: 2,
      editable: false
    },
    {
      id: 2,
      name: '运营管理员',
      description: '负责日常运营和审核',
      permissions: ['orders_view', 'qualifications_review', 'appeals_arbitrate', 'executors_view', 'export_data'],
      userCount: 5,
      editable: true
    },
    {
      id: 3,
      name: '财务管理员',
      description: '负责分账配置和财务数据',
      permissions: ['profit_sharing_config', 'export_data', 'orders_view'],
      userCount: 3,
      editable: true
    },
    {
      id: 4,
      name: '审核员',
      description: '仅负责资质审核',
      permissions: ['qualifications_review', 'executors_view'],
      userCount: 8,
      editable: true
    }
  ])

  const [permissionList] = useState([
    { id: 'dashboard_view', name: '查看控制台', category: '基础权限' },
    { id: 'orders_view', name: '查看订单', category: '订单管理' },
    { id: 'orders_export', name: '导出订单', category: '订单管理' },
    { id: 'qualifications_review', name: '资质审核', category: '资质管理' },
    { id: 'appeals_arbitrate', name: '申诉仲裁', category: '申诉管理' },
    { id: 'profit_sharing_config', name: '分账配置', category: '财务管理' },
    { id: 'executors_view', name: '查看执行者', category: '执行者管理' },
    { id: 'executors_manage', name: '管理执行者', category: '执行者管理' },
    { id: 'export_data', name: '数据导出', category: '数据管理' },
    { id: 'system_settings', name: '系统设置', category: '系统管理' },
    { id: 'role_manage', name: '角色管理', category: '系统管理' },
    { id: 'audit_log_view', name: '查看审计日志', category: '系统管理' }
  ])

  const handleTogglePermission = (roleId, permissionId) => {
    setRoles(roles.map(role => {
      if (role.id === roleId && role.editable) {
        const newPermissions = role.permissions.includes(permissionId)
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId]
        return { ...role, permissions: newPermissions }
      }
      return role
    }))
  }

  const handleSaveRole = (role) => {
    setPendingAction({ type: 'save_role', role })
    setShowConfirmModal(true)
  }

  const handleDeleteRole = (role) => {
    setPendingAction({ type: 'delete_role', role })
    setShowConfirmModal(true)
  }

  const confirmAction = () => {
    if (pendingAction.type === 'save_role') {
      // 记录审计日志
      const auditLog = {
        action: 'ROLE_UPDATE',
        roleId: pendingAction.role.id,
        roleName: pendingAction.role.name,
        permissions: pendingAction.role.permissions,
        timestamp: new Date().toISOString(),
        operator: 'admin'
      }
      console.log('Audit Log:', auditLog)
      alert('角色权限已更新')
    } else if (pendingAction.type === 'delete_role') {
      setRoles(roles.filter(r => r.id !== pendingAction.role.id))
      // 记录审计日志
      const auditLog = {
        action: 'ROLE_DELETE',
        roleId: pendingAction.role.id,
        roleName: pendingAction.role.name,
        timestamp: new Date().toISOString(),
        operator: 'admin'
      }
      console.log('Audit Log:', auditLog)
      alert('角色已删除')
    }
    setShowConfirmModal(false)
    setPendingAction(null)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="settings" />
      
      <main className="flex-1 p-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-500 mt-1">配置系统权限和角色，所有修改将记录审计日志</p>
        </div>

        {/* 标签页 */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-dailv text-dailv'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              角色权限
            </button>
            <button
              onClick={() => setActiveTab('admin_list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admin_list'
                  ? 'border-dailv text-dailv'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              管理员列表
            </button>
            <button
              onClick={() => setActiveTab('audit_log')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audit_log'
                  ? 'border-dailv text-dailv'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              审计日志
            </button>
          </nav>
        </div>

        {activeTab === 'permissions' && (
          <div className="space-y-8">
            {/* 角色列表 */}
            {roles.map((role) => (
              <div key={role.id} className="card">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      <span className="badge badge-info">{role.userCount} 人</span>
                      {!role.editable && (
                        <span className="badge badge-warning">系统角色</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{role.description}</p>
                  </div>
                  {role.editable && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveRole(role)}
                        className="btn-primary text-sm"
                      >
                        保存修改
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role)}
                        className="btn-danger text-sm"
                      >
                        删除角色
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">权限配置</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {permissionList.map((permission) => (
                      <label
                        key={permission.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          role.permissions.includes(permission.id) || role.permissions.includes('all')
                            ? 'border-dailv bg-dailv-lighter bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${!role.editable ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={role.permissions.includes(permission.id) || role.permissions.includes('all')}
                          onChange={() => handleTogglePermission(role.id, permission.id)}
                          disabled={!role.editable}
                          className="rounded border-gray-300 text-dailv focus:ring-dailv"
                        />
                        <span className="ml-3 text-sm text-gray-700">{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* 添加新角色 */}
            <div className="card">
              <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-dailv hover:text-dailv transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加新角色
              </button>
            </div>
          </div>
        )}

        {activeTab === 'admin_list' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">管理员列表</h3>
              <button className="btn-primary text-sm">
                <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加管理员
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>角色</th>
                    <th>最后登录</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>admin</td>
                    <td>admin@clearspring.com</td>
                    <td><span className="badge badge-error">超级管理员</span></td>
                    <td className="text-sm text-gray-500">2026-03-28 22:00</td>
                    <td><span className="badge badge-success">活跃</span></td>
                    <td>
                      <button className="text-dailv hover:text-dailv-dark text-sm font-medium">编辑</button>
                    </td>
                  </tr>
                  <tr>
                    <td>operator1</td>
                    <td>op1@clearspring.com</td>
                    <td><span className="badge badge-info">运营管理员</span></td>
                    <td className="text-sm text-gray-500">2026-03-28 18:30</td>
                    <td><span className="badge badge-success">活跃</span></td>
                    <td>
                      <button className="text-dailv hover:text-dailv-dark text-sm font-medium">编辑</button>
                    </td>
                  </tr>
                  <tr>
                    <td>finance1</td>
                    <td>fin1@clearspring.com</td>
                    <td><span className="badge badge-info">财务管理员</span></td>
                    <td className="text-sm text-gray-500">2026-03-28 15:20</td>
                    <td><span className="badge badge-success">活跃</span></td>
                    <td>
                      <button className="text-dailv hover:text-dailv-dark text-sm font-medium">编辑</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit_log' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">审计日志</h3>
              <div className="flex gap-3">
                <input
                  type="date"
                  className="input-field w-40"
                  placeholder="开始日期"
                />
                <input
                  type="date"
                  className="input-field w-40"
                  placeholder="结束日期"
                />
                <button className="btn-secondary text-sm">查询</button>
                <button className="btn-primary text-sm">导出日志</button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>操作人</th>
                    <th>操作类型</th>
                    <th>详情</th>
                    <th>IP 地址</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-sm text-gray-500">2026-03-28 22:00:00</td>
                    <td>admin</td>
                    <td><span className="badge badge-success">LOGIN</span></td>
                    <td>管理员登录</td>
                    <td className="font-mono text-sm">192.168.1.100</td>
                  </tr>
                  <tr>
                    <td className="text-sm text-gray-500">2026-03-28 16:30:00</td>
                    <td>admin</td>
                    <td><span className="badge badge-info">DATA_EXPORT</span></td>
                    <td>导出审计日志 (1256 条)</td>
                    <td className="font-mono text-sm">192.168.1.100</td>
                  </tr>
                  <tr>
                    <td className="text-sm text-gray-500">2026-03-28 14:30:00</td>
                    <td>admin</td>
                    <td><span className="badge badge-warning">QUALIFICATION_APPROVE</span></td>
                    <td>通过资质审核 - 李**</td>
                    <td className="font-mono text-sm">192.168.1.100</td>
                  </tr>
                  <tr>
                    <td className="text-sm text-gray-500">2026-03-28 10:15:00</td>
                    <td>operator1</td>
                    <td><span className="badge badge-warning">QUALIFICATION_REJECT</span></td>
                    <td>驳回资质审核 - 张**</td>
                    <td className="font-mono text-sm">192.168.1.105</td>
                  </tr>
                  <tr>
                    <td className="text-sm text-gray-500">2026-03-27 18:20:00</td>
                    <td>admin</td>
                    <td><span className="badge badge-error">APPEAL_ARBITRATION</span></td>
                    <td>仲裁申诉 - ORD202603270012</td>
                    <td className="font-mono text-sm">192.168.1.100</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                显示 1 到 5 条，共 1256 条
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-sm" disabled>上一页</button>
                <button className="btn-primary text-sm">1</button>
                <button className="btn-secondary text-sm">2</button>
                <button className="btn-secondary text-sm">3</button>
                <span className="text-gray-400">...</span>
                <button className="btn-secondary text-sm">252</button>
                <button className="btn-secondary text-sm">下一页</button>
              </div>
            </div>
          </div>
        )}

        {/* 确认弹窗 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {pendingAction?.type === 'save_role' ? '确认保存' : '确认删除'}
              </h3>
              
              {pendingAction?.type === 'save_role' ? (
                <p className="text-gray-600 mb-4">
                  确定要保存角色 <span className="font-medium">{pendingAction.role.name}</span> 的权限配置吗？
                </p>
              ) : (
                <div className="mb-4">
                  <p className="text-gray-600">
                    确定要删除角色 <span className="font-medium text-status-error">{pendingAction?.role.name}</span> 吗？
                  </p>
                  <p className="text-sm text-status-warning mt-2">
                    ⚠️ 此操作不可恢复，该角色下的用户将被移除权限
                  </p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-sm text-status-warning">
                  ⚠️ 此操作将记录审计日志
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
                  onClick={confirmAction}
                  className={pendingAction?.type === 'save_role' ? 'btn-primary flex-1' : 'btn-danger flex-1'}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SystemSettings
