import { NextResponse } from 'next/server'
import { optimizeText } from '../../../lib/ai'
import { checkRateLimit } from '../../../lib/rate-limit'

export async function POST(request) {
  try {
    const { allowed, remaining } = await checkRateLimit(request, 'optimize')
    if (!allowed) {
      return NextResponse.json({ error: '今日优化次数已用完，请明天再试' }, { status: 429 })
    }

    const { text, context } = await request.json()
    if (!text) {
      return NextResponse.json({ error: '缺少文字内容' }, { status: 400 })
    }
    const result = await optimizeText(text, context)
    return NextResponse.json({ result }, { headers: { 'X-RateLimit-Remaining': String(remaining) } })
  } catch (error) {
    console.error('优化接口异常:', error)
    return NextResponse.json({ error: '服务异常' }, { status: 500 })
  }
}
