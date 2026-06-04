import { NextResponse } from 'next/server'
import { generateSummary } from '../../../lib/ai'

export async function POST(request) {
  try {
    const { resumeData, targetJob } = await request.json()
    const result = await generateSummary(resumeData, targetJob)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('摘要生成异常:', error)
    return NextResponse.json({ error: '服务异常' }, { status: 500 })
  }
}
