import { NextResponse } from 'next/server'
import { analyzeResume } from '../../../lib/ai'

export async function POST(request) {
  try {
    const { resumeText } = await request.json()
    if (!resumeText) {
      return NextResponse.json({ error: '缺少简历内容' }, { status: 400 })
    }
    const result = await analyzeResume(resumeText)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('分析接口异常:', error)
    return NextResponse.json({ error: '服务异常' }, { status: 500 })
  }
}
