import React, { useState, useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import Sidebar from '../components/Sidebar'

/**
 * 控制台总览
 * 数据图表（ECharts），5 分钟轮询
 */
function Dashboard() {
  const chartRef = useRef(null)
  const [orderTrendChart, setOrderTrendChart] = useState(null)
  const [executorDistChart, setExecutorDistChart] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [data, setData] = useState({
    totalOrders: 1256,
    todayOrders: 48,
    pendingReview: 12,
    pendingAppeal: 3,
    activeExecutors: 156,
    totalRevenue: 285600,
    platformRevenue: 57120
  })

  // 初始化图表
  useEffect(() => {
    if (chartRef.current) {
      const orderChart = echarts.init(chartRef.current)
      const executorChart = echarts.init(document.getElementById('executorChart'))
      
      setOrderTrendChart(orderChart)
      setExecutorDistChart(executorChart)

      return () => {
        orderChart.dispose()
        executorChart.dispose()
      }
    }
  }, [])

  // 加载数据并渲染图表
  useEffect(() => {
    if (orderTrendChart && executorDistChart) {
      loadData()
      
      // 5 分钟轮询
      const interval = setInterval(() => {
        loadData()
        setLastUpdated(new Date())
      }, 5 * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [orderTrendChart, executorDistChart])

  const loadData = () => {
    // 模拟数据（实际应调用 API）
    const mockData = {
      totalOrders: 1256,
      todayOrders: 48,
      pendingReview: 12,
      pendingAppeal: 3,
      activeExecutors: 156,
      totalRevenue: 285600,
      platformRevenue: 57120
    }
    setData(mockData)

    // 订单趋势图
    orderTrendChart.setOption({
      title: {
        text: '近 7 日订单趋势',
        left: 'center',
        textStyle: { color: '#334537', fontSize: 16 }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['12-22', '12-23', '12-24', '12-25', '12-26', '12-27', '12-28'],
        axisLine: { lineStyle: { color: '#4A5D4E' } }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#4A5D4E' } },
        splitLine: { lineStyle: { color: '#E5E7EB' } }
      },
      series: [{
        data: [42, 38, 55, 48, 62, 51, 48],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#4A5D4E' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(74, 93, 78, 0.3)' },
            { offset: 1, color: 'rgba(74, 93, 78, 0.05)' }
          ])
        }
      }]
    })

    // 执行者分布图
    executorDistChart.setOption({
      title: {
        text: '执行者等级分布',
        left: 'center',
        textStyle: { color: '#334537', fontSize: 16 }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          color: '#334537'
        },
        data: [
          { value: 45, name: '初级', itemStyle: { color: '#8A9A8B' } },
          { value: 68, name: '中级', itemStyle: { color: '#6B7D6E' } },
          { value: 35, name: '高级', itemStyle: { color: '#4A5D4E' } },
          { value: 8, name: '专家', itemStyle: { color: '#334537' } }
        ]
      }]
    })

    // 窗口大小改变时重绘
    const handleResize = () => {
      orderTrendChart.resize()
      executorDistChart.resize()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }

  // 格式化数字
  const formatNumber = (num) => {
    return num.toLocaleString('zh-CN')
  }

  const formatCurrency = (num) => {
    return `¥${num.toLocaleString('zh-CN')}`
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="dashboard" />
      
      <main className="flex-1 p-8">
        {/* 页面头部 */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">控制台总览</h1>
            <p className="text-gray-500 mt-1">
              最后更新：{lastUpdated.toLocaleTimeString('zh-CN')}
              <button 
                onClick={() => { loadData(); setLastUpdated(new Date()); }}
                className="ml-4 text-dailv hover:text-dailv-dark"
              >
                刷新
              </button>
            </p>
          </div>
        </div>

        {/* 数据卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总订单数</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(data.totalOrders)}</p>
                <p className="text-sm text-status-success mt-1">今日 +{data.todayOrders}</p>
              </div>
              <div className="w-12 h-12 bg-dailv-lighter bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待审核</p>
                <p className="text-2xl font-bold text-status-warning mt-1">{data.pendingReview}</p>
                <p className="text-sm text-gray-500 mt-1">资质审核</p>
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
                <p className="text-sm text-gray-500">待仲裁</p>
                <p className="text-2xl font-bold text-status-error mt-1">{data.pendingAppeal}</p>
                <p className="text-sm text-gray-500 mt-1">申诉案件</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">活跃执行者</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.activeExecutors}</p>
                <p className="text-sm text-status-success mt-1">在线</p>
              </div>
              <div className="w-12 h-12 bg-dailv-lighter bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 收入概览 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">收入概览</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">总流水</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">平台收入</span>
                <span className="text-xl font-bold text-dailv">{formatCurrency(data.platformRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">分成比例</span>
                <span className="text-lg text-gray-700">20%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">待处理事项</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="text-gray-700">资质审核</span>
                <span className="badge badge-warning">{data.pendingReview} 条</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="text-gray-700">申诉仲裁</span>
                <span className="badge badge-error">{data.pendingAppeal} 条</span>
              </div>
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div ref={chartRef} className="h-80"></div>
          </div>
          <div className="card">
            <div id="executorChart" className="h-80"></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
