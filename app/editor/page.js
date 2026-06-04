'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import FileUploader from '../../components/FileUploader'
import ResumeForm from '../../components/ResumeForm'
import AIAnalysisPanel from '../../components/AIAnalysisPanel'
import TemplateSelector from '../../components/TemplateSelector'
import { DEFAULT_RESUME, TEMPLATES } from '../../lib/templates'

export default function EditorPage() {
  const [step, setStep] = useState(1) // 1: 上传/填写, 2: 分析, 3: 模板导出
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME)
  const [rawText, setRawText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [analyzeLoading, setAnalyzeLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [optimizeResult, setOptimizeResult] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [optimizeLoading, setOptimizeLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // PDF 上传解析回调
  const handleParsed = useCallback(({ text, parsed }) => {
    setRawText(text)
    setResumeData(prev => ({
      ...prev,
      name: parsed.name || prev.name,
      contact: { ...prev.contact, ...parsed.contact },
      summary: parsed.summary || prev.summary,
      experience: parsed.experience.length ? parsed.experience : prev.experience,
      education: parsed.education.length ? parsed.education : prev.education,
      skills: { proficient: parsed.skills, familiar: [], learning: [] },
      projects: parsed.projects.length ? parsed.projects : prev.projects,
    }))
    setStep(2)
  }, [])

  // AI 分析简历
  const handleAnalyze = async () => {
    setAnalyzeLoading(true)
    setErrorMsg('')
    try {
      const text = rawText || buildResumeText(resumeData)
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error || '分析失败'); return }
      setAnalysis(data.result)
    } catch (err) {
      setErrorMsg('网络异常，请稍后重试')
    } finally {
      setAnalyzeLoading(false)
    }
  }

  // AI 优化某段文字
  const handleOptimize = async (suggestion) => {
    setOptimizeLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: suggestion.issue, context: suggestion.category }),
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error || '优化失败'); return }
      setOptimizeResult({ category: suggestion.category, result: data.result })
    } catch (err) {
      setErrorMsg('网络异常，请稍后重试')
    } finally {
      setOptimizeLoading(false)
    }
  }

  // 生成个人简介
  const handleGenerateSummary = async () => {
    setSummaryLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      })
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error || '生成失败'); return }
      setResumeData(prev => ({ ...prev, summary: data.result }))
    } catch (err) {
      setErrorMsg('网络异常，请稍后重试')
    } finally {
      setSummaryLoading(false)
    }
  }

  // 导出 PDF
  const handleExportPDF = async () => {
    setExportLoading(true)
    try {
      const el = document.getElementById('resume-preview')
      if (!el) return
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      const canvas = await html2canvas(el, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${resumeData.name || 'resume'}_简历.pdf`)
    } catch (err) {
      setErrorMsg('PDF 导出失败，请尝试使用浏览器打印')
    } finally {
      setExportLoading(false)
    }
  }

  // 构建简历文本（用于 AI 分析）
  function buildResumeText(data) {
    let text = `${data.name}\n${data.title}\n`
    text += `${data.contact.email} ${data.contact.phone} ${data.contact.location}\n\n`
    if (data.summary) text += `个人简介：${data.summary}\n\n`
    if (data.experience?.length) {
      text += '工作经历：\n'
      data.experience.forEach(e => {
        text += `${e.company} - ${e.position} (${e.period})\n`
        e.descriptions?.forEach(d => { if (d) text += `  ${d}\n` })
      })
      text += '\n'
    }
    if (data.education?.length) {
      text += '教育背景：\n'
      data.education.forEach(e => { text += `${e.school} - ${e.degree} - ${e.major} (${e.period})\n` })
      text += '\n'
    }
    if (data.skills?.proficient?.length) text += `精通：${data.skills.proficient.join(', ')}\n`
    if (data.skills?.familiar?.length) text += `熟悉：${data.skills.familiar.join(', ')}\n`
    return text
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">✨ ResumeAI</Link>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <button key={s} onClick={() => setStep(s)}
                className={`px-3 py-1.5 text-sm rounded-lg transition
                  ${step === s ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                {s === 1 ? '① 填写' : s === 2 ? '② AI 分析' : '③ 导出'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between items-center">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-red-600 ml-4">✕</button>
          </div>
        )}

        {/* Step 1: 填写简历 */}
        {step === 1 && (
          <div className="space-y-6">
            <FileUploader onParsed={handleParsed} />
            <div className="text-center text-sm text-gray-400">—— 或者手动填写 ——</div>
            <ResumeForm data={resumeData} onChange={setResumeData} />
            <div className="flex gap-3">
              <button onClick={handleGenerateSummary} disabled={summaryLoading}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 transition text-sm">
                {summaryLoading ? '生成中...' : '✨ AI 生成个人简介'}
              </button>
              <button onClick={() => { setRawText(buildResumeText(resumeData)); setStep(2) }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                下一步：AI 分析 →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: AI 分析 */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <button onClick={handleAnalyze} disabled={analyzeLoading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium">
                  {analyzeLoading ? '🧠 AI 分析中...' : '🧠 开始 AI 分析'}
                </button>
                <button onClick={() => setStep(3)} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  跳过，直接导出 →
                </button>
              </div>

              {optimizeResult && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-medium text-purple-800 mb-2">✨ {optimizeResult.category} 优化结果</h4>
                  <p className="text-sm text-purple-700 whitespace-pre-line">{optimizeResult.result}</p>
                </div>
              )}

              <ResumeForm data={resumeData} onChange={setResumeData} />
            </div>

            <div>
              {analyzeLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-500">AI 正在分析你的简历...</p>
                </div>
              ) : analysis ? (
                <AIAnalysisPanel analysis={analysis} onOptimize={handleOptimize} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="text-4xl mb-3">🧠</div>
                  <p className="text-gray-500">点击"开始 AI 分析"获取简历评分和优化建议</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: 模板 + 导出 */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <TemplateSelector selected={selectedTemplate} onSelect={setSelectedTemplate} />
              <button onClick={handleExportPDF} disabled={exportLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium text-lg">
                {exportLoading ? '导出中...' : '📥 导出 PDF'}
              </button>
              <button onClick={() => window.print()}
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">
                或使用浏览器打印
              </button>
              <button onClick={() => setStep(2)}
                className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">
                ← 返回修改
              </button>
            </div>

            <div className="lg:col-span-2">
              <ResumePreview data={resumeData} template={selectedTemplate} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// 简历预览组件
function ResumePreview({ data, template = 'modern' }) {
  const cfg = TEMPLATES[template] || TEMPLATES.modern
  const t = { primary: cfg.colors.primary, headerBg: cfg.colors.headerBg, accent: cfg.colors.accent }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-none" id="resume-preview">
      {/* Header */}
      <div className="p-8" style={{ backgroundColor: t.headerBg }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: t.primary }}>{data.name || '你的姓名'}</h1>
        {data.title && <p className="text-lg" style={{ color: t.accent }}>{data.title}</p>}
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {data.contact?.email && <span>📧 {data.contact.email}</span>}
          {data.contact?.phone && <span>📱 {data.contact.phone}</span>}
          {data.contact?.location && <span>📍 {data.contact.location}</span>}
          {data.contact?.website && <span>🔗 {data.contact.website}</span>}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* 个人简介 */}
        {data.summary && (
          <section>
            <h2 className="text-lg font-semibold mb-2 pb-1 border-b-2" style={{ borderColor: t.primary, color: t.primary }}>个人简介</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* 工作经历 */}
        {data.experience?.some(e => e.company) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: t.primary, color: t.primary }}>工作经历</h2>
            {data.experience.filter(e => e.company).map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold">{exp.company}</span>
                    {exp.position && <span className="text-gray-500"> · {exp.position}</span>}
                  </div>
                  {exp.period && <span className="text-sm text-gray-400">{exp.period}</span>}
                </div>
                {exp.descriptions?.filter(Boolean).map((d, j) => (
                  <p key={j} className="text-sm text-gray-600 mt-1">• {d}</p>
                ))}
              </div>
            ))}
          </section>
        )}

        {/* 教育背景 */}
        {data.education?.some(e => e.school) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: t.primary, color: t.primary }}>教育背景</h2>
            {data.education.filter(e => e.school).map((edu, i) => (
              <div key={i} className="flex justify-between items-baseline mb-2">
                <div>
                  <span className="font-semibold">{edu.school}</span>
                  {edu.degree && <span className="text-gray-500"> · {edu.degree}</span>}
                  {edu.major && <span className="text-gray-500"> · {edu.major}</span>}
                </div>
                {edu.period && <span className="text-sm text-gray-400">{edu.period}</span>}
              </div>
            ))}
          </section>
        )}

        {/* 技能 */}
        {(data.skills?.proficient?.length || data.skills?.familiar?.length) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: t.primary, color: t.primary }}>专业技能</h2>
            {data.skills.proficient?.length > 0 && (
              <p className="text-sm mb-1"><span className="font-medium">精通：</span><span className="text-gray-600">{data.skills.proficient.join('、')}</span></p>
            )}
            {data.skills.familiar?.length > 0 && (
              <p className="text-sm mb-1"><span className="font-medium">熟悉：</span><span className="text-gray-600">{data.skills.familiar.join('、')}</span></p>
            )}
            {data.skills.learning?.length > 0 && (
              <p className="text-sm"><span className="font-medium">了解：</span><span className="text-gray-600">{data.skills.learning.join('、')}</span></p>
            )}
          </section>
        )}

        {/* 项目经历 */}
        {data.projects?.some(p => p.name) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 pb-1 border-b-2" style={{ borderColor: t.primary, color: t.primary }}>项目经历</h2>
            {data.projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{proj.name}</span>
                  {proj.period && <span className="text-sm text-gray-400">{proj.period}</span>}
                </div>
                {proj.role && <p className="text-sm text-gray-500">{proj.role}</p>}
                {proj.techStack && <p className="text-xs text-blue-600 mt-1">技术栈：{proj.techStack}</p>}
                {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
