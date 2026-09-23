import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  FileText, 
  AlertTriangle, 
  Pill, 
  Cpu, 
  Activity, 
  Eye, 
  Layers,
  GraduationCap
} from 'lucide-react';
import { TemplateStarterKit } from '../types/gamatutor';
import { STARTER_TEMPLATES } from '../data/mockData';
import { GamaAnimationPlayer } from './GamaAnimationPlayer';

interface TemplatesViewProps {
  onSelectTemplate: (template: TemplateStarterKit) => void;
  onOpenQuickStart: () => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectTemplate,
  onOpenQuickStart
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateStarterKit | null>(null);

  const categories = [
    'Semua',
    'Rekam Medis Elektronik',
    'Kedokteran & Farmasi',
    'Sains Data & AI'
  ];

  const filteredTemplates = STARTER_TEMPLATES.filter(tpl => {
    return selectedCategory === 'Semua' || tpl.category === selectedCategory;
  });

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'AlertTriangle': return AlertTriangle;
      case 'Pill': return Pill;
      case 'Cpu': return Cpu;
      case 'Activity': return Activity;
      default: return LayoutTemplate;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5" />
              Beginner Starter Kits
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Templates &amp; Starter Kits
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Tidak perlu bingung memulai dari kanvas kosong! Pilih template siap pakai berbasis alur Rekam Medis Elektronik (RME) atau konsep sains data. Anda dapat mengganti naskah dengan penjelasan Anda sendiri saat belajar.
          </p>
        </div>

        <button
          onClick={onOpenQuickStart}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-colors"
        >
          <GraduationCap className="w-4 h-4 text-teal-300" />
          <span>Lihat Panduan Quick Start</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map(tpl => {
          const Icon = getTemplateIcon(tpl.iconName);

          return (
            <div
              key={tpl.id}
              className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm hover:border-teal-600 hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100/80 border border-teal-300 flex items-center justify-center text-teal-800 shrink-0 shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-teal-800 text-teal-100 border border-teal-700">
                      {tpl.category}
                    </span>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                      {tpl.badge}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {tpl.title}
                </h3>
                <p className="text-xs font-bold text-teal-800 mt-0.5 mb-2">
                  {tpl.subtitle}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed mb-4 font-medium">
                  {tpl.description}
                </p>

                {/* Learning Objectives */}
                <div className="bg-slate-100/80 p-3.5 rounded-xl border border-slate-200 mb-4 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block mb-1">
                    Fokus Pembelajaran / Objectives:
                  </span>
                  {tpl.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-200 hover:bg-slate-300 border border-slate-300 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>Pratinjau Animasi</span>
                </button>

                <button
                  onClick={() => onSelectTemplate(tpl)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all hover:scale-102"
                >
                  <span>Gunakan Starter Kit Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm truncate max-w-md">
                  Pratinjau Template: {previewTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Tutup
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <GamaAnimationPlayer
                steps={previewTemplate.sampleScenes}
                tutorialTitle={previewTemplate.title}
                category={previewTemplate.category}
                isInteractiveMode={true}
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const chosen = previewTemplate;
                    setPreviewTemplate(null);
                    onSelectTemplate(chosen);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  Pilih Template Ini &amp; Mulai TeachBack
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
