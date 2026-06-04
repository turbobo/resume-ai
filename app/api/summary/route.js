import { NextResponse } from 'next/server'
import { generateSummary } from '../../../lib/ai'
import { checkRateLimit } from '../../../lib/rate-limit'

export async function POST(request) {
  try {
    const { allowed, remaining } = await checkRateLimit(request, 'summary')
    if (!allowed) {
      return NextResponse.json({ error: '今日生成次数已用完，请明天再试' }, { status: 429 })
    }

    const { resumeData, targetJob } = await request.json()
    const result = await generateSummary(resumeData, targetJob)
    return NextResponse.json({ result }, { headers: { 'X-RateLimit-Remaining': String(remaining) } })
  } catch (error) {
    console.error('摘要生成异常:', error)
    return NextResponse.json({ error: '服务异常' }, { status: 500 })
  }
}
