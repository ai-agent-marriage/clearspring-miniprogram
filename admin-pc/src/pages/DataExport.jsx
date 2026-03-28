import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

/**
 * 数据导出页
 * 审计日志导出
 */
function DataExport() {
  const [exportConfig, setExportConfig] = useState({
    type: 'audit_log',
    startDate: '2026-03-01',
    endDate: '2026-03-28',
    format: 'xlsx',
    includeSensitive: false
  })
  const [exporting, setExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState([
    { id: 1, type: '审计日志', dateRange: '2026-03-01 ~ 2026-03-25', format: 'xlsx', records: 1256, operator: 'admin', time: '2026-03-25 16:30', status: 'completed' },
    { id: 2, type: '订单数据', dateRange: '2026-03-01 ~ 2026-03-20', format: 'csv', records: 892, operator: 'admin', time: '2026-03-20 10:15', status: 'completed' },
    { id: 3, type: '执行者数据', dateRange: '2026-03-01 ~ 2026-03-15', format: 'xlsx', records: 156, operator: 'admin', time: '2026-03-15 14:45', status: 'completed' }
  ])

  const exportTypes = [
    { value: 'audit_log', label: '审计日志', description: '所有系统操作的审计记录' },
    { value: 'orders', label: '订单数据', description: '订单列表及详细信息' },
    { value: 'executors', label: '执行者数据', description: '执行者信息及统计' },
    { value: 'qualifications', label: '资质审核记录', description: '资质审核历史' },
    { value: 'appeals', label: '申诉仲裁记录', description: '申诉案件及仲裁结果' },
    { value: 'profit_sharing', label: '分账记录', description: '平台与执行者分账明细' }
  ]

  const handleExport = () => {
    setExporting(true)

    // 模拟导出过程
    setTimeout(() => {
      // 记录审计日志
      const auditLog = {
        action: 'DATA_EXPORT',
        exportType: exportConfig.type,
        dateRange: `${exportConfig.startDate} ~ ${exportConfig.endDate}`,
        format: exportConfig.format,
        includeSensitive: exportConfig.includeSensitive,
        timestamp: new Date().toISOString(),
        operator: 'admin'
      }
      console.log('Audit Log:', auditLog)

      // 添加到导出历史
      const newHistory = {
        id: Date.now(),
        type: exportTypes.find(t => t.value === exportConfig.type)?.label,
        dateRange: `${exportConfig.startDate} ~ ${exportConfig.endDate}`,
        format: exportConfig.format,
        records: Math.floor(Math.random() * 1000) + 100,
        operator: 'admin',
        time: new Date().toLocaleString('zh-CN'),
        status: 'completed'
      }
      setExportHistory([newHistory, ...exportHistory])

      setExporting(false)
      alert('数据导出成功，文件已下载到本地')
    }, 2000)
  }

  const handleDownload = (record) => {
    alert(`开始下载：${record.type}_${record.dateRange.replace(/ ~ /g, '_')}.${record.format}`)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage="export" />
      
      <main className="flex-1 p-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">数据导出</h1>
          <p className="text-gray-500 mt-1">导出审计日志和系统数据，所有导出操作将记录审计日志</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 导出配置 */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出配置
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">数据类型</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {exportTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-colors ${
                          exportConfig.type === type.value
                            ? 'border-dailv bg-dailv-lighter bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="exportType"
                          value={type.value}
                          checked={exportConfig.type === type.value}
                          onChange={(e) => setExportConfig({ ...exportConfig, type: e.target.value })}
                          className="sr-only"
                        />
                        <span className="font-medium text-gray-900">{type.label}</span>
                        <span className="text-xs text-gray-500 mt-1">{type.description}</span>
                        {exportConfig.type === type.value && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-dailv rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
                    <input
                      type="date"
                      value={exportConfig.startDate}
                      onChange={(e) => setExportConfig({ ...exportConfig, startDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                    <input
                      type="date"
                      value={exportConfig.endDate}
                      onChange={(e) => setExportConfig({ ...exportConfig, endDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="xlsx"
                        checked={exportConfig.format === 'xlsx'}
                        onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value })}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Excel (.xlsx)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value="csv"
                        checked={exportConfig.format === 'csv'}
                        onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value })}
                        className="mr-2"
                      />
                      <span className="text-gray-700">CSV (.csv)</span>
                    </label>
                  </div>
                </div>

                {exportConfig.type === 'audit_log' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-status-warning mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-status-warning">敏感数据说明</p>
                        <p className="text-xs text-gray-600 mt-1">
                          导出的审计日志包含系统操作记录，默认对敏感信息（手机号、身份证等）进行脱敏处理。
                          如需导出完整数据，请勾选下方选项并确保有相应权限。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeSensitive"
                    checked={exportConfig.includeSensitive}
                    onChange={(e) => setExportConfig({ ...exportConfig, includeSensitive: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="includeSensitive" className="ml-2 text-sm text-gray-700">
                    包含敏感信息（需要管理员权限）
                  </label>
                </div>

                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      正在导出...
                    </span>
                  ) : (
                    '导出数据'
                  )}
                </button>
              </div>
            </div>

            {/* 导出说明 */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">导出说明</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-dailv-lighter bg-opacity-20 text-dailv rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">1</span>
                  <p>选择需要导出的数据类型和日期范围</p>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-dailv-lighter bg-opacity-20 text-dailv rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">2</span>
                  <p>选择导出格式（Excel 或 CSV）</p>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-dailv-lighter bg-opacity-20 text-dailv rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">3</span>
                  <p>敏感数据默认脱敏，如需完整数据请勾选相应选项</p>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-dailv-lighter bg-opacity-20 text-dailv rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">4</span>
                  <p>所有导出操作将记录审计日志，确保可追溯</p>
                </div>
              </div>
            </div>
          </div>

          {/* 导出历史 */}
          <div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-dailv" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                导出历史
              </h3>

              <div className="space-y-4">
                {exportHistory.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{record.type}</span>
                      <span className="badge badge-success">完成</span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>日期：{record.dateRange}</p>
                      <p>格式：{record.format.toUpperCase()}</p>
                      <p>记录数：{record.records}</p>
                      <p>时间：{record.time}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(record)}
                      className="mt-3 w-full btn-secondary text-sm py-2"
                    >
                      下载文件
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DataExport
