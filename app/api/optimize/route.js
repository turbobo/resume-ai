import { NextResponse } from 'next/server'
import { optimizeText } from '../../../lib/ai'

export async function POST(request) {
  try {
    const { text, context } = await request.json()
    if (!text) {
      return NextResponse.json({ error: '缺少文字内容' }, { status: 400 })
    }
    const result = await optimizeText(text, context)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('优化接口异常:', error)
    return NextResponse.json({ error: '服务异常' }, { status: 500 })
  }
}
