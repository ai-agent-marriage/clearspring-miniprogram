import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

/**
 * 订单管理页
 * 列表 + 筛选，执行者信息脱敏
 */
function OrderManagement() {
  const [filters, setFilters] = useState({
    orderNo: '',
    status: '',
    executorLevel: '',
    dateRange: ''
  })
  const [selectedOrders, setSelectedOrders] = useState([])

  // 模拟订单数据
  const orders = [
    { id: 1, orderNo: 'ORD202603280001', customer: '张先生', executor: '李**', executorLevel: '高级', amount: 580, status: 'completed', createTime: '2026-03-28 10:30' },
    { id: 2, orderNo: 'ORD202603280002', customer: '王女士', executor: '王**', executorLevel: '中级', amount: 320, status: 'in_progress', createTime: '2026-03-28 11:15' },
    { id: 3, orderNo: 'ORD202603280003', customer: '刘先生', executor: '张**', executorLevel: '初级', amount: 450, status: 'pending', createTime: '2026-03-28 12:00' },
    { id: 4, orderNo: 'ORD202603280004', customer: '陈女士', executor: '赵**', executorLevel: '专家', amount: 1200, status: 'completed', createTime: '2026-03-28 13:20' },
    { id: 5, orderNo: 'ORD202603280005', customer: '杨先生', executor: '刘**', executorLevel: '中级', amount: 680, status: 'appealing', createTime: '2026-03-28 14:05' },
    { id: 6, orderNo: 'ORD202603280006', customer: '周女士', executor: '陈**', executorLevel: '高级', amount: 890, status: 'in_progress', createTime: '2026-03-28 15:30' },
    { id: 7, orderNo: 'ORD202603280007', customer: '吴先生', executor: '杨**', executorLevel: '初级', amount: 260, status: 'completed', createTime: '2026-03-28 16:10' },
    { id: 8, orderNo: 'ORD202603280008', customer: '郑女士', executor: '黄**', executorLevel: '中级', amount: 540, status: 'pending', createTime: '2026-03-28 17:00' }
  ]

  const statusMap = {
    pending: { label: '待接单', class: 'badge-info' },
    in_progress: { label: '进行中', class: 'badge-warning' },
    completed: { label: '已完成', class: 'badge-success' },
    appealing: { label: '申诉中', class: 'badge-error' }
  }

  // 脱敏手机号
  const maskPhone = (phone) => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  // 脱敏身份证
  const maskIdCard = (idCard) => {
    return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (id) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleExport = () => {
    // 导出审计日志
    const auditLog = {
      action: 'EXPORT_ORDERS',
      count: selectedOrders.length || orders.length,
      timestamp: new Date().toISOString(),
      operator: 'admin'
    }
    console.log('Audit Log:', auditLog)
    alert(`已导出 ${selectedOrders.length || orders.length} 条订单记录`)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="orders" />
      
      <main className="flex-1 p-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
          <p className="text-gray-500 mt-1">查看和管理所有订单，执行者信息已脱敏</p>
        </div>

        {/* 筛选区域 */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">订单号</label>
              <input
                type="text"
                name="orderNo"
                value={filters.orderNo}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="请输入订单号"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">全部</option>
                <option value="pending">待接单</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
                <option value="appealing">申诉中</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">执行者等级</label>
              <select
                name="executorLevel"
                value={filters.executorLevel}
                onChange={handleFilterChange}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">日期范围</label>
              <input
                type="date"
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn-primary">查询</button>
            <button className="btn-secondary" onClick={() => setFilters({ orderNo: '', status: '', executorLevel: '', dateRange: '' })}>重置</button>
            <button className="btn-secondary" onClick={handleExport}>导出</button>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              共 {orders.length} 条记录
              {selectedOrders.length > 0 && (
                <span className="ml-4 text-dailv">已选择 {selectedOrders.length} 条</span>
              )}
            </div>
            {selectedOrders.length > 0 && (
              <button className="btn-danger text-sm" onClick={() => {
                if (confirm('确定要导出选中的订单吗？此操作将记录审计日志。')) {
                  handleExport()
                }
              }}>
                导出选中
              </button>
            )}
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="px-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th>订单号</th>
                  <th>客户</th>
                  <th>执行者</th>
                  <th>等级</th>
                  <th>金额</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="font-mono text-sm">{order.orderNo}</td>
                    <td>{order.customer}</td>
                    <td className="masked-text">{order.executor}</td>
                    <td>
                      <span className={`badge ${
                        order.executorLevel === '专家' ? 'badge-error' :
                        order.executorLevel === '高级' ? 'badge-info' :
                        order.executorLevel === '中级' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {order.executorLevel}
                      </span>
                    </td>
                    <td className="font-medium">¥{order.amount}</td>
                    <td>
                      <span className={`badge ${statusMap[order.status].class}`}>
                        {statusMap[order.status].label}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">{order.createTime}</td>
                    <td>
                      <button className="text-dailv hover:text-dailv-dark text-sm font-medium">
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              显示 1 到 {orders.length} 条，共 {orders.length} 条
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-sm" disabled>上一页</button>
              <button className="btn-primary text-sm">1</button>
              <button className="btn-secondary text-sm">2</button>
              <button className="btn-secondary text-sm">3</button>
              <button className="btn-secondary text-sm">下一页</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OrderManagement
