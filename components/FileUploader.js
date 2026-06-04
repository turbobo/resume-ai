'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { extractTextFromPDF, parseResumeText } from '../lib/pdf-parser'

export default function FileUploader({ onParsed }) {
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (files) => {
    const file = files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setStatus('❌ 请上传 PDF 格式文件')
      return
    }

    try {
      setStatus('📄 正在解析 PDF...')
      setProgress(30)

      const text = await extractTextFromPDF(file)
      setProgress(70)
      setStatus('🔍 正在识别简历结构...')

      const parsed = parseResumeText(text)
      setProgress(100)
      setStatus(`✅ 解析完成！提取了 ${file.name} 的内容`)

      onParsed?.({ text, parsed, fileName: file.name })
    } catch (error) {
      console.error('PDF 解析失败:', error)
      setStatus('❌ 解析失败，请手动填写简历内容')
      setProgress(0)
    }
  }, [onParsed])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">📎</div>
        {isDragActive ? (
          <p className="text-blue-600 font-medium">松开以上传文件</p>
        ) : (
          <div>
            <p className="text-gray-700 font-medium mb-1">拖拽 PDF 到此处，或点击上传</p>
            <p className="text-sm text-gray-400">支持 PDF 格式，AI 自动提取简历内容</p>
          </div>
        )}
      </div>

      {status && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">{status}</p>
          {progress > 0 && (
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
