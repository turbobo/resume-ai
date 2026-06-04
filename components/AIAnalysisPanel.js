'use client'

import { useState } from 'react'

export default function AIAnalysisPanel({ analysis, onOptimize }) {
  const [loading, setLoading] = useState({})

  const data = typeof analysis === 'string' ? (() => { try { return JSON.parse(analysis) } catch { return null } })() : analysis

  if (!data) return null

  const scoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const priorityBadge = (priority) => {
    const colors = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-700' }
    const labels = { high: '重要', medium: '建议', low: '可选' }
    return <span className={`text-xs px-2 py-0.5 rounded-full ${colors[priority] || colors.low}`}>{labels[priority] || '建议'}</span>
  }

  return (
    <div className="space-y-4">
      {/* 整体评分 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">简历评分</h3>
          <div className={`text-3xl font-bold ${scoreColor(data.overallScore)}`}>
            {data.overallScore}<span className="text-sm text-gray-400 font-normal">/100</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{data.summary}</p>
        
        {/* 进度条 */}
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${data.overallScore >= 80 ? 'bg-green-500' : data.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${data.overallScore}%` }} />
        </div>
      </div>

      {/* 优缺点 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <h4 className="font-medium text-green-800 mb-2">✅ 亮点</h4>
          <ul className="space-y-1">
            {(data.strengths || []).map((s, i) => (
              <li key={i} className="text-sm text-green-700">• {s}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <h4 className="font-medium text-red-800 mb-2">⚠️ 待改进</h4>
          <ul className="space-y-1">
            {(data.weaknesses || []).map((w, i) => (
              <li key={i} className="text-sm text-red-700">• {w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 优化建议 */}
      {data.suggestions?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">💡 优化建议</h3>
          <div className="space-y-3">
            {data.suggestions.map((s, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-800">{s.category}</span>
                  {priorityBadge(s.priority)}
                </div>
                <p className="text-sm text-gray-600 mb-1">{s.suggestion}</p>
                {s.example && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    示例：{s.example}
                  </div>
                )}
                {onOptimize && (
                  <button onClick={async () => {
                    setLoading(prev => ({ ...prev, [i]: true }))
                    try { await onOptimize(s) } finally { setLoading(prev => ({ ...prev, [i]: false })) }
                  }}
                    disabled={loading[i]}
                    className="mt-2 text-xs text-blue-600 hover:underline disabled:text-gray-400">
                    {loading[i] ? '优化中...' : '✨ AI 一键优化此模块'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 关键词分析 */}
      {data.keywordAnalysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">🔑 关键词分析</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-gray-500">已有：</span>
            {(data.keywordAnalysis.present || []).map((kw, i) => (
              <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{kw}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">建议补充：</span>
            {(data.keywordAnalysis.missing || []).map((kw, i) => (
              <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{kw}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
