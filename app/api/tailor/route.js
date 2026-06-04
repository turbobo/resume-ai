import { NextResponse } from 'next/server'
import { tailorForJob, parseAIResponse } from '../../../lib/ai'
import { checkRateLimit } from '../../../lib/rate-limit'

export async function POST(request) {
  try {
    const { allowed, remaining } = await checkRateLimit(request, 'tailor')
    if (!allowed) {
      return NextResponse.json({ error: '今日岗位匹配次数已用完，请明天再试' }, { status: 429 })
    }

    const { resumeText, jobDescription } = await request.json()
    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: '缺少内容' }, { status: 400 })
    }
    const raw = await tailorForJob(resumeText, jobDescription)
    const result = parseAIResponse(raw) || raw
    return NextResponse.json({ result }, { headers: { 'X-RateLimit-Remaining': String(remaining) } })
  } catch (error) {
    console.error('岗位匹配异常:', error)
    return NextResponse.json({ error: '服务异常' }, { status: 500 })
  }
}
