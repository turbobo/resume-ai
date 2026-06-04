'use client'

import { useState, useEffect } from 'react'
import { auth } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    auth.getUser().then(({ user }) => {
      if (!user) router.push('/login')
      else setUser(user)
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">✨ ResumeAI</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <button onClick={() => auth.signOut().then(() => router.push('/'))}
              className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition">退出</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">我的简历</h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-4xl mb-4">📄</div>
          <h2 className="text-lg font-semibold mb-2">开始创建你的第一份简历</h2>
          <p className="text-gray-500 mb-6">AI 帮你分析优化，一键导出专业 PDF</p>
          <Link href="/editor" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            创建简历 →
          </Link>
        </div>

        <div className="mt-8 bg-blue-50 p-5 rounded-xl border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">💡 Pro 功能预告</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 针对特定岗位 JD 优化简历匹配度</li>
            <li>• 无限次 AI 分析和优化</li>
            <li>• 历史版本对比</li>
            <li>• 更多专业模板</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
