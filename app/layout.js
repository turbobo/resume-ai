import './globals.css'

export const metadata = {
  title: 'ResumeAI - AI简历优化工具 | 智能分析、一键美化、PDF导出',
  description: 'AI驱动的简历优化工具。上传PDF自动解析，智能评分分析，一键优化工作描述，多套精美模板，支持PDF导出。',
  keywords: '简历优化,AI简历,简历模板,PDF简历,求职,面试',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
