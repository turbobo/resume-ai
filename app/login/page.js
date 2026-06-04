'use client'

import { Suspense, useState } from 'react'
import { auth } from '../../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState(initialMode)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (mode === 'signup') {
      const { error } = await auth.signUp(email, password)
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await auth.signIn(email, password)
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">✨ ResumeAI</Link>
          <h1 className="text-xl font-semibold mt-4">{mode === 'login' ? '欢迎回来' : '创建免费账号'}</h1>
          <p className="text-gray-500 text-sm mt-1">{mode === 'login' ? '登录以管理你的简历' : '保存简历，随时修改导出'}</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="至少 6 位" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium">
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <p className="text-gray-600">还没有账号？ <button onClick={() => { setMode('signup'); setError('') }} className="text-blue-600 hover:underline font-medium">免费注册</button></p>
          ) : (
            <p className="text-gray-600">已有账号？ <button onClick={() => { setMode('login'); setError('') }} className="text-blue-600 hover:underline font-medium">去登录</button></p>
          )}
        </div>
      </div>
      <div className="mt-4 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← 返回首页</Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
