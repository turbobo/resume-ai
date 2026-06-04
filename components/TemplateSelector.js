'use client'

import { getTemplateList } from '../lib/templates'

export default function TemplateSelector({ selected, onSelect }) {
  const templates = getTemplateList()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-3">📄 选择简历模板</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`p-3 rounded-lg border-2 text-left transition
              ${selected === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors.primary }} />
              <span className="font-medium text-sm">{t.name}</span>
            </div>
            <p className="text-xs text-gray-500">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
