'use client'

import { useState } from 'react'
import { DEFAULT_RESUME } from '../lib/templates'

export default function ResumeForm({ data = DEFAULT_RESUME, onChange }) {
  const [activeTab, setActiveTab] = useState('basic')

  const update = (path, value) => {
    const newData = { ...data }
    const keys = path.split('.')
    let obj = newData
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...obj[keys[i]] }
      obj = obj[keys[i]]
    }
    obj[keys[keys.length - 1]] = value
    onChange?.(newData)
  }

  const tabs = [
    { id: 'basic', label: '基本信息', icon: '👤' },
    { id: 'experience', label: '工作经历', icon: '💼' },
    { id: 'education', label: '教育背景', icon: '🎓' },
    { id: 'skills', label: '技能', icon: '🛠️' },
    { id: 'projects', label: '项目经历', icon: '🚀' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Tab 导航 */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition
              ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {/* 基本信息 */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input value={data.name} onChange={e => update('name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="张三" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">求职意向</label>
                <input value={data.title} onChange={e => update('title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="前端开发工程师" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input value={data.contact?.email || ''} onChange={e => update('contact.email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                <input value={data.contact?.phone || ''} onChange={e => update('contact.phone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="138xxxx8888" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所在城市</label>
                <input value={data.contact?.location || ''} onChange={e => update('contact.location', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="北京" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">个人网站</label>
                <input value={data.contact?.website || ''} onChange={e => update('contact.website', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <textarea value={data.summary} onChange={e => update('summary', e.target.value)} rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="2-3句话概括你的核心竞争力..." />
            </div>
          </div>
        )}

        {/* 工作经历 */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {(data.experience || []).map((exp, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                <button onClick={() => {
                  const list = [...data.experience]
                  list.splice(i, 1)
                  update('experience', list)
                }} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm">删除</button>
                <div className="grid grid-cols-2 gap-3">
                  <input value={exp.company} onChange={e => {
                    const list = [...data.experience]; list[i].company = e.target.value; update('experience', list)
                  }} className="px-3 py-2 border rounded-lg outline-none" placeholder="公司名称" />
                  <input value={exp.position} onChange={e => {
                    const list = [...data.experience]; list[i].position = e.target.value; update('experience', list)
                  }} className="px-3 py-2 border rounded-lg outline-none" placeholder="职位" />
                </div>
                <input value={exp.period} onChange={e => {
                  const list = [...data.experience]; list[i].period = e.target.value; update('experience', list)
                }} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="2022.06 - 至今" />
                <textarea value={(exp.descriptions || []).join('\n')} onChange={e => {
                  const list = [...data.experience]; list[i].descriptions = e.target.value.split('\n'); update('experience', list)
                }} rows={4} className="w-full px-3 py-2 border rounded-lg outline-none resize-none"
                  placeholder="每行一条工作描述，如：&#10;• 负责XX系统开发&#10;• 带领团队完成YY项目" />
              </div>
            ))}
            <button onClick={() => update('experience', [...(data.experience || []), { company: '', position: '', period: '', descriptions: [''] }])}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
              + 添加工作经历
            </button>
          </div>
        )}

        {/* 教育背景 */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            {(data.education || []).map((edu, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                <button onClick={() => {
                  const list = [...data.education]; list.splice(i, 1); update('education', list)
                }} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm">删除</button>
                <div className="grid grid-cols-2 gap-3">
                  <input value={edu.school} onChange={e => {
                    const list = [...data.education]; list[i].school = e.target.value; update('education', list)
                  }} className="px-3 py-2 border rounded-lg outline-none" placeholder="学校名称" />
                  <input value={edu.degree} onChange={e => {
                    const list = [...data.education]; list[i].degree = e.target.value; update('education', list)
                  }} className="px-3 py-2 border rounded-lg outline-none" placeholder="本科/硕士" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={edu.major} onChange={e => {
                    const list = [...data.education]; list[i].major = e.target.value; update('education', list)
                  }} className="px-3 py-2 border rounded-lg outline-none" placeholder="专业" />
                  <input value={edu.period} onChange={e => {
                    const list = [...data.education]; list[i].period = e.target.value; update('education', list)
                  }} className="px-3 py-2 border rounded-lg outline-none" placeholder="2018 - 2022" />
                </div>
              </div>
            ))}
            <button onClick={() => update('education', [...(data.education || []), { school: '', degree: '', major: '', period: '', gpa: '' }])}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
              + 添加教育背景
            </button>
          </div>
        )}

        {/* 技能 */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">精通（每行一个，逗号分隔）</label>
              <input value={(data.skills?.proficient || []).join(', ')} onChange={e => update('skills.proficient', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="React, TypeScript, Node.js" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">熟悉</label>
              <input value={(data.skills?.familiar || []).join(', ')} onChange={e => update('skills.familiar', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="Docker, AWS, PostgreSQL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">了解</label>
              <input value={(data.skills?.learning || []).join(', ')} onChange={e => update('skills.learning', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="Rust, WebAssembly" />
            </div>
          </div>
        )}

        {/* 项目经历 */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {(data.projects || []).map((proj, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-3 relative">
                <button onClick={() => {
                  const list = [...data.projects]; list.splice(i, 1); update('projects', list)
                }} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm">删除</button>
                <div className="grid grid-cols-2 gap-3">
                  <input value={proj.name} onChange={e => {
                    const list = [...data.projects]; list[i].name = e.target.value; update('projects', list)
                  }} className="px-3 py-2 border rounded-lg outline-none" placeholder="项目名称" />
                  <input value={proj.role} onChange={e => {
                    const list = [...data.projects]; list[i].role = e.target.value; update('projects', list)
                  }} className="px-3 py-2 border rounded-lg outline-none" placeholder="你的角色" />
                </div>
                <input value={proj.techStack} onChange={e => {
                  const list = [...data.projects]; list[i].techStack = e.target.value; update('projects', list)
                }} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="技术栈：React, Node.js, PostgreSQL" />
                <textarea value={proj.description} onChange={e => {
                  const list = [...data.projects]; list[i].description = e.target.value; update('projects', list)
                }} rows={3} className="w-full px-3 py-2 border rounded-lg outline-none resize-none" placeholder="项目描述和你的贡献..." />
              </div>
            ))}
            <button onClick={() => update('projects', [...(data.projects || []), { name: '', role: '', period: '', description: '', techStack: '', link: '' }])}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
              + 添加项目经历
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
