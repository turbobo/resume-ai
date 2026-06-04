// 简历模板定义

export const TEMPLATES = {
  classic: {
    id: 'classic',
    name: '经典商务',
    description: '简洁专业的传统风格，适合金融、咨询等行业',
    colors: { primary: '#1a1a2e', accent: '#16213e', text: '#333333', bg: '#ffffff' },
    font: { heading: 'font-bold', body: 'font-normal' },
    layout: 'single-column',
  },
  modern: {
    id: 'modern',
    name: '现代简约',
    description: '清爽现代的设计，适合互联网、科技行业',
    colors: { primary: '#2563eb', accent: '#3b82f6', text: '#374151', bg: '#ffffff' },
    font: { heading: 'font-semibold', body: 'font-light' },
    layout: 'two-column',
  },
  creative: {
    id: 'creative',
    name: '创意个性',
    description: '有设计感的风格，适合设计、市场等创意岗位',
    colors: { primary: '#7c3aed', accent: '#8b5cf6', text: '#1f2937', bg: '#faf5ff' },
    font: { heading: 'font-bold', body: 'font-normal' },
    layout: 'two-column',
  },
  minimal: {
    id: 'minimal',
    name: '极简风格',
    description: '极简黑白设计，突出内容本身',
    colors: { primary: '#000000', accent: '#6b7280', text: '#111827', bg: '#ffffff' },
    font: { heading: 'font-medium', body: 'font-light' },
    layout: 'single-column',
  },
}

/**
 * 获取模板列表
 */
export function getTemplateList() {
  return Object.values(TEMPLATES)
}

/**
 * 获取模板配置
 */
export function getTemplate(id) {
  return TEMPLATES[id] || TEMPLATES.classic
}

/**
 * 默认简历数据结构
 */
export const DEFAULT_RESUME = {
  name: '',
  title: '',
  contact: {
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
  },
  summary: '',
  experience: [
    { company: '', position: '', period: '', descriptions: [''] },
  ],
  education: [
    { school: '', degree: '', major: '', period: '', gpa: '' },
  ],
  skills: {
    proficient: [],
    familiar: [],
    learning: [],
  },
  projects: [
    { name: '', role: '', period: '', description: '', techStack: '', link: '' },
  ],
  awards: '',
  languages: '',
}
