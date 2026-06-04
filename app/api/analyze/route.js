import { NextResponse } from 'next/server'
import { analyzeResume, parseAIResponse } from '../../../lib/ai'
import { checkRateLimit } from '../../../lib/rate-limit'

export async function POST(request) {
  try {
    const { allowed, remaining } = await checkRateLimit(request, 'analyze')
    if (!allowed) {
      return NextResponse.json({ error: '今日 AI 分析次数已用完，请明天再试' }, { status: 429 })
    }

    const { resumeText } = await request.json()
    if (!resumeText) {
      return NextResponse.json({ error: '缺少简历内容' }, { status: 400 })
    }
    const raw = await analyzeResume(resumeText)
    const result = parseAIResponse(raw) || raw
    return NextResponse.json({ result }, { headers: { 'X-RateLimit-Remaining': String(remaining) } })
  } catch (error) {
    console.error('分析接口异常:', error)
    return NextResponse.json({ error: '服务异常' }, { status: 500 })
  }
}
