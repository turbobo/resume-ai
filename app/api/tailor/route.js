import { NextResponse } from 'next/server'
import { tailorForJob } from '../../../lib/ai'

export async function POST(request) {
  try {
    const { resumeText, jobDescription } = await request.json()
    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: '缺少内容' }, { status: 400 })
    }
    const result = await tailorForJob(resumeText, jobDescription)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('岗位匹配异常:', error)
    return NextResponse.json({ error: '服务异常' }, { status: 500 })
  }
}
