export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">✨ ResumeAI</span>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">登录</a>
            <a href="/editor" className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">开始使用</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
          🤖 AI 驱动 · 免费使用
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          AI 简历优化，<br />让求职成功率翻倍
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          上传简历 PDF → AI 智能分析评分 → 一键优化工作描述 → 选择精美模板 → 导出专业简历
        </p>
        <a href="/editor" className="inline-block px-8 py-3.5 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          免费开始优化 →
        </a>
      </main>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: '📎', title: 'PDF 智能解析', desc: '上传简历自动提取内容，无需手动输入' },
            { icon: '🧠', title: 'AI 评分分析', desc: '100 分制评分，精准定位问题并给出建议' },
            { icon: '✨', title: '一键优化文案', desc: 'AI 重写工作描述，使用 STAR 法则更专业' },
            { icon: '📄', title: '模板 + PDF 导出', desc: '4 套精美模板，一键导出 PDF 发送 HR' },
          ].map((f, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">3 步搞定一份好简历</h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {[
            { step: '1', title: '上传简历', desc: '支持 PDF 上传，AI 自动提取内容；也可手动填写' },
            { step: '2', title: 'AI 分析优化', desc: '智能评分、逐条建议、一键优化工作描述和个人简介' },
            { step: '3', title: '选模板导出', desc: '4 套专业模板，实时预览，一键导出 PDF' },
          ].map((s, i) => (
            <div key={i} className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-3">{s.step}</div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing hint */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-2">免费开始，按需升级</h2>
          <p className="text-gray-500 mb-4">免费版每天 3 次 AI 分析 · Pro 版 ¥19/月无限使用</p>
          <a href="/editor" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            立即体验
          </a>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-6 text-center text-gray-400 text-sm">
        <p>© 2026 ResumeAI · AI 简历优化工具</p>
      </footer>
    </div>
  )
}
