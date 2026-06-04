// AI 简历分析与优化核心逻辑
// 支持通义千问（DashScope）和 OpenAI 兼容接口

const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'

/**
 * 调用 AI 模型
 * @param {string} prompt - 系统提示词
 * @param {string} content - 用户内容
 * @returns {Promise<string>} AI 回复
 */
async function callAI(prompt, content) {
  const apiKey = process.env.DASHSCOPE_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn('⚠️ AI API Key 未配置，使用模拟数据')
    return getMockResponse(prompt, content)
  }

  try {
    const res = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-plus',  // 通义千问 Plus，性价比高
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('AI API 调用失败:', err)
      return getMockResponse(prompt, content)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content || getMockResponse(prompt, content)
  } catch (error) {
    console.error('AI 调用异常:', error)
    return getMockResponse(prompt, content)
  }
}

/**
 * 分析简历整体质量
 */
export async function analyzeResume(resumeText) {
  const prompt = `你是一位资深的HR和简历优化专家，拥有10年以上的招聘经验。请对以下简历进行全面分析。

请按以下格式输出 JSON（不要输出其他内容）：
{
  "overallScore": 0-100的整体评分,
  "summary": "一句话总结简历质量",
  "strengths": ["优点1", "优点2", "优点3"],
  "weaknesses": ["缺点1", "缺点2", "缺点3"],
  "suggestions": [
    {
      "category": "模块名（如：工作经历/教育背景/技能等）",
      "issue": "具体问题描述",
      "suggestion": "改进建议",
      "priority": "high/medium/low",
      "example": "改进示例（如果适用）"
    }
  ],
  "missingSections": ["缺失的重要模块"],
  "keywordAnalysis": {
    "present": ["已包含的关键词"],
    "missing": ["建议补充的关键词"]
  }
}`

  return await callAI(prompt, resumeText)
}

/**
 * 优化某段文字（如工作经历描述）
 */
export async function optimizeText(text, context = '') {
  const prompt = `你是一位简历文案优化专家。请优化以下文字，使其更加专业、量化、有说服力。

要求：
1. 使用 STAR 法则（情境-任务-行动-结果）
2. 加入具体数据和成果
3. 使用强动词开头
4. 保持简洁，每条不超过2行
5. 直接输出优化后的文字，不要其他说明

${context ? `求职目标/岗位方向：${context}` : ''}`

  return await callAI(prompt, text)
}

/**
 * 生成简历摘要/个人简介
 */
export async function generateSummary(resumeData, targetJob = '') {
  const prompt = `你是一位简历撰写专家。请根据以下信息，生成一段200字以内的个人简介/职业摘要。

要求：
1. 突出核心竞争力和亮点
2. 与目标岗位匹配
3. 专业、简洁、有吸引力
4. 直接输出文字，不要其他说明

${targetJob ? `目标岗位：${targetJob}` : ''}`

  return await callAI(prompt, JSON.stringify(resumeData, null, 2))
}

/**
 * 针对特定岗位优化简历
 */
export async function tailorForJob(resumeText, jobDescription) {
  const prompt = `你是一位资深职业顾问。请根据目标岗位的职位描述，分析简历的匹配度并给出优化建议。

请按以下格式输出 JSON：
{
  "matchScore": 0-100的匹配度,
  "matchedSkills": ["匹配的技能和经验"],
  "gapSkills": ["需要补充或强调的技能"],
  "tailoredSuggestions": [
    {
      "section": "简历模块",
      "action": "具体调整建议"
    }
  ],
  "keywordOptimization": {
    "mustInclude": ["必须包含的JD关键词"],
    "niceToHave": ["建议包含的关键词"]
  }
}`

  const content = `简历内容：\n${resumeText}\n\n目标岗位描述：\n${jobDescription}`
  return await callAI(prompt, content)
}

/**
 * 模拟响应（API Key 未配置时使用）
 */
function getMockResponse(prompt, content) {
  // 简历分析
  if (prompt.includes('overallScore')) {
    return JSON.stringify({
      overallScore: 65,
      summary: '简历结构基本完整，但在量化成果和关键词优化方面有较大提升空间。',
      strengths: ['教育背景清晰', '基本信息完整', '有工作经历描述'],
      weaknesses: ['缺少量化数据（如业绩提升百分比）', '工作描述过于笼统', '缺少技能清单模块'],
      suggestions: [
        {
          category: '工作经历',
          issue: '描述缺乏具体成果和数据',
          suggestion: '使用 STAR 法则重写每条经历，加入具体数据',
          priority: 'high',
          example: '原："负责项目管理" → 优化："主导3个百万级项目，按时交付率100%，团队规模15人"'
        },
        {
          category: '技能',
          issue: '缺少独立的技能清单',
          suggestion: '添加技能模块，按熟练度分类列出核心技能',
          priority: 'high',
          example: '精通：Python, React | 熟悉：Docker, AWS | 了解：K8s'
        },
        {
          category: '个人简介',
          issue: '缺少职业摘要',
          suggestion: '在简历顶部添加2-3句职业摘要，突出核心竞争力',
          priority: 'medium',
          example: '5年全栈开发经验，主导过3个从0到1的产品开发，精通React生态和Python后端开发'
        },
      ],
      missingSections: ['技能清单', '职业摘要', '项目亮点'],
      keywordAnalysis: {
        present: ['开发', '项目'],
        missing: ['团队协作', '技术方案', '性能优化', '用户增长']
      }
    })
  }

  // 文字优化
  if (prompt.includes('优化以下文字')) {
    return '• 主导XX系统架构重构，将核心模块响应时间从2s优化至200ms，性能提升10倍\n• 带领5人团队完成微服务拆分，支撑日均100万+请求，系统可用性达99.9%\n• 设计并实现自动化部署流程，将发布时间从30分钟缩短至5分钟，效率提升6倍'
  }

  // 摘要生成
  if (prompt.includes('个人简介')) {
    return '5年全栈开发工程师，精通React/Next.js前端开发和Python/Node.js后端开发。曾主导3个从0到1的互联网产品开发，带领团队完成百万级用户系统的架构设计与性能优化。擅长将复杂业务需求转化为高质量的技术方案，具备优秀的跨团队协作能力和项目管理经验。'
  }

  // 岗位匹配
  if (prompt.includes('匹配度')) {
    return JSON.stringify({
      matchScore: 72,
      matchedSkills: ['前端开发', 'React', '团队协作'],
      gapSkills: ['系统设计', '性能优化经验', '开源贡献'],
      tailoredSuggestions: [
        { section: '工作经历', action: '强调与岗位相关的技术栈和项目经验' },
        { section: '技能清单', action: '将JD中提到的关键词放在技能列表前列' },
        { section: '项目经历', action: '突出与目标岗位最相关的项目成果' },
      ],
      keywordOptimization: {
        mustInclude: ['React', 'TypeScript', '微服务'],
        niceToHave: ['Docker', 'CI/CD', '敏捷开发']
      }
    })
  }

  return '{}'
}

/**
 * 解析 AI 返回的 JSON 字符串
 */
export function parseAIResponse(text) {
  try {
    // 尝试提取 JSON 部分（AI 可能包裹在 markdown code block 中）
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim()
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('解析 AI 响应失败:', e)
    return null
  }
}
