// PDF 解析工具 - 从 PDF 文件中提取文本内容

/**
 * 从 PDF 文件中提取所有文本
 * @param {File} file - PDF 文件对象
 * @returns {Promise<string>} 提取的文本内容
 */
export async function extractTextFromPDF(file) {
  // 动态导入 pdfjs-dist（只在客户端使用）
  const pdfjsLib = await import('pdfjs-dist')
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map(item => item.str)
      .join(' ')
      .replace(/\s+/g, ' ')
    
    fullText += pageText + '\n\n'
  }

  return fullText.trim()
}

/**
 * 尝试从提取的文本中识别简历结构
 * @param {string} text - PDF 提取的文本
 * @returns {object} 结构化的简历数据
 */
export function parseResumeText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  
  const result = {
    name: '',
    contact: { email: '', phone: '', location: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    rawText: text,
  }

  // 提取邮箱
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)
  if (emailMatch) result.contact.email = emailMatch[0]

  // 提取手机号（中国格式）
  const phoneMatch = text.match(/1[3-9]\d{9}/)
  if (phoneMatch) result.contact.phone = phoneMatch[0]

  // 提取姓名（通常是第一行非空内容）
  for (const line of lines) {
    if (line.length >= 2 && line.length <= 6 && /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(line)) {
      result.name = line
      break
    }
  }

  // 识别各模块
  const sectionKeywords = {
    experience: ['工作经历', '工作经验', '实习经历', 'Work Experience', 'Experience'],
    education: ['教育背景', '教育经历', 'Education'],
    skills: ['技能', '专业技能', '技术栈', 'Skills', 'Technical Skills'],
    projects: ['项目经历', '项目经验', 'Projects'],
    summary: ['个人简介', '自我评价', 'Summary', 'About'],
  }

  let currentSection = null
  let sectionContent = []

  for (const line of lines) {
    const matchedSection = Object.entries(sectionKeywords).find(
      ([, keywords]) => keywords.some(kw => line.includes(kw))
    )

    if (matchedSection) {
      // 保存上一个模块的内容
      if (currentSection && sectionContent.length > 0) {
        assignSection(result, currentSection, sectionContent)
      }
      currentSection = matchedSection[0]
      sectionContent = []
    } else if (currentSection) {
      sectionContent.push(line)
    }
  }

  // 保存最后一个模块
  if (currentSection && sectionContent.length > 0) {
    assignSection(result, currentSection, sectionContent)
  }

  return result
}

function assignSection(result, section, lines) {
  const content = lines.join('\n')
  
  switch (section) {
    case 'summary':
      result.summary = content
      break
    case 'experience':
      result.experience = lines.filter(l => l.length > 5).map(l => ({ description: l }))
      break
    case 'education':
      result.education = lines.filter(l => l.length > 3).map(l => ({ description: l }))
      break
    case 'skills':
      result.skills = lines.flatMap(l => l.split(/[,，、;；\s]+/)).filter(Boolean)
      break
    case 'projects':
      result.projects = lines.filter(l => l.length > 5).map(l => ({ description: l }))
      break
  }
}
