import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save, 
  Play, 
  Sliders, 
  MapPin, 
  MessageSquare, 
  Layers, 
  Clock, 
  Activity, 
  Sparkles,
  CheckCircle2,
  Eye,
  CornerDownRight
} from 'lucide-react';
import { TutorialStep, BackdropType, ActionType, CalloutType } from '../types/gamatutor';
import { GamaAnimationPlayer } from './GamaAnimationPlayer';

interface GamaAnimationEditorProps {
  steps: TutorialStep[];
  setSteps: React.Dispatch<React.SetStateAction<TutorialStep[]>>;
  tutorialTitle: string;
  onSaveAndProceed: () => void;
  onBackToScript?: () => void;
}

export const GamaAnimationEditor: React.FC<GamaAnimationEditorProps> = ({
  steps,
  setSteps,
  tutorialTitle,
  onSaveAndProceed,
  onBackToScript
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [editorMode, setEditorMode] = useState<'editor' | 'preview'>('editor');

  const currentStep = steps[activeStepIndex] || steps[0];

  // Helper to update current step property
  const updateCurrentStep = (updater: (prev: TutorialStep) => TutorialStep) => {
    setSteps(prevSteps => {
      const updated = [...prevSteps];
      if (updated[activeStepIndex]) {
        updated[activeStepIndex] = updater(updated[activeStepIndex]);
      }
      return updated;
    });
  };

  const handleAddStep = () => {
    const newStepNumber = steps.length + 1;
    const newStep: TutorialStep = {
      id: `step-${Date.now()}`,
      stepNumber: newStepNumber,
      title: `Langkah ${newStepNumber}: Prosedur Tambahan`,
      duration: 5,
      narration: 'Jelaskan aksi yang harus dilakukan pembelajar pada langkah ini.',
      backdrop: currentStep?.backdrop || 'rme_hospital',
      actionType: 'click',
      targetElement: 'Elemen UI Target',
      callout: {
        title: 'Petunjuk Penting',
        text: 'Instruksi spesifik agar pengguna tidak salah memasukkan data.',
        x: 40,
        y: 40,
        type: 'instruction'
      },
      hotspot: {
        x: 50,
        y: 50,
        label: 'Tombol Aksi',
        interactiveHint: 'Klik di sini'
      },
      cursorAnimation: {
        startX: 20,
        startY: 70,
        endX: 50,
        endY: 50
      },
      interactivePrompt: 'Klik untuk memproses langkah ini'
    };

    setSteps(prev => [...prev, newStep]);
    setActiveStepIndex(steps.length);
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) return; // Keep at least one step
    const filtered = steps.filter((_, idx) => idx !== index).map((s, idx) => ({
      ...s,
      stepNumber: idx + 1
    }));
    setSteps(filtered);
    setActiveStepIndex(prev => Math.min(prev, filtered.length - 1));
  };

  const handleMoveStep = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= steps.length) return;

    const newSteps = [...steps];
    const temp = newSteps[fromIndex];
    newSteps[fromIndex] = newSteps[toIndex];
    newSteps[toIndex] = temp;

    // renumber
    const reordered = newSteps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setSteps(reordered);
    setActiveStepIndex(toIndex);
  };

  return (
    <div className="space-y-6">
      {/* Editor Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
              Gama Animation Studio (GAE)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Tahap 4: Studio Editor &amp; Visual Tweaking
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Penyunting Visual: {tutorialTitle}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Sesuaikan urutan adegan, posisi balon instruksi (callout), letak hotspot interaktif, dan naskah audio sebelum memasuki tahap Teach-Back Check.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setEditorMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                editorMode === 'editor'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Editor Properti
            </button>
            <button
              onClick={() => setEditorMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                editorMode === 'preview'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Pratinjau Interaktif
            </button>
          </div>

          <button
            onClick={onSaveAndProceed}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30 transition-all hover:scale-102"
          >
            <span>Lanjut ke Teach-Back Check</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {editorMode === 'preview' ? (
        /* Preview Player Mode */
        <div className="space-y-4">
          <GamaAnimationPlayer
            steps={steps}
            tutorialTitle={tutorialTitle}
            isInteractiveMode={true}
          />
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-600">
              Pratinjau ini mensimulasikan bagaimana tutorial Anda dijalankan oleh pengguna lain di Community Hub.
            </span>
            <button
              onClick={() => setEditorMode('editor')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
            >
              Kembali ke Mode Edit
            </button>
          </div>
        </div>
      ) : (
        /* Editor Mode */
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Timeline Steps List */}
          <div className="col-span-12 lg:col-span-4 space-y-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  Alur Adegan ({steps.length} Langkah)
                </h4>
                <button
                  onClick={handleAddStep}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>

              {/* Step cards list */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      idx === activeStepIndex
                        ? 'bg-teal-50/70 border-teal-400 ring-2 ring-teal-400/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border text-slate-700 shadow-2xs">
                        Langkah {step.stepNumber}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStep(idx, 'up');
                          }}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Geser ke Atas"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveStep(idx, 'down');
                          }}
                          disabled={idx === steps.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Geser ke Bawah"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStep(idx);
                          }}
                          disabled={steps.length <= 1}
                          className="p-1 rounded text-red-400 hover:text-red-600 disabled:opacity-30"
                          title="Hapus Langkah"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h5 className="font-bold text-xs text-slate-800 line-clamp-1">
                      {step.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {step.narration}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-600">
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {step.backdrop.toUpperCase()}
                      </span>
                      <span>⏱ {step.duration}s</span>
                      <span className="text-teal-700 font-bold">🎯 {step.actionType}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Step Property Inspector & Visual Tweaker */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {currentStep && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-600" />
                    Properti Langkah {currentStep.stepNumber}: {currentStep.title}
                  </h4>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">
                    ID: {currentStep.id}
                  </span>
                </div>

                {/* Title & Target Element */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Judul Langkah Aksi:
                    </label>
                    <input
                      type="text"
                      value={currentStep.title}
                      onChange={e => {
                        const val = e.target.value;
                        updateCurrentStep(prev => ({ ...prev, title: val }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Elemen UI Target:
                    </label>
                    <input
                      type="text"
                      value={currentStep.targetElement}
                      onChange={e => {
                        const val = e.target.value;
                        updateCurrentStep(prev => ({ ...prev, targetElement: val }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Narration Script */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                      Naskah Narasi Suara (Voiceover Audio Script):
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Dibacakan otomatis oleh GAE Player
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={currentStep.narration}
                    onChange={e => {
                      const val = e.target.value;
                      updateCurrentStep(prev => ({ ...prev, narration: val }));
                    }}
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Backdrop & Action Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Latar Visual (Backdrop):
                    </label>
                    <select
                      value={currentStep.backdrop}
                      onChange={e => {
                        const val = e.target.value as BackdropType;
                        updateCurrentStep(prev => ({ ...prev, backdrop: val }));
                      }}
                      className="w-full p-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="rme_hospital">SIMRS Admisi Rumah Sakit</option>
                      <option value="rme_triage">Triase Gawat Darurat (IGD)</option>
                      <option value="pharmacy_system">Instalasi Farmasi &amp; Resep</option>
                      <option value="laboratory_lims">Laboratorium Medis LIMS</option>
                      <option value="flowchart_logic">Diagram Logika &amp; Konsep</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tipe Interaksi Aksi:
                    </label>
                    <select
                      value={currentStep.actionType}
                      onChange={e => {
                        const val = e.target.value as ActionType;
                        updateCurrentStep(prev => ({ ...prev, actionType: val }));
                      }}
                      className="w-full p-2 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="click">Klik Tombol (Click)</option>
                      <option value="type">Pengetikan Teks (Type)</option>
                      <option value="verify">Verifikasi Data (Verify)</option>
                      <option value="select">Pilih Dropdown (Select)</option>
                      <option value="alert">Pemicu Peringatan (Alert)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Durasi Adegan (Detik):
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={20}
                      value={currentStep.duration}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 5;
                        updateCurrentStep(prev => ({ ...prev, duration: val }));
                      }}
                      className="w-full p-2 text-xs rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                {/* Hotspot & Callout Coordinate Tweaking */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  {/* Hotspot Config */}
                  <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-200/80 space-y-3">
                    <h5 className="font-bold text-xs text-teal-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      Target Hotspot Interaktif
                    </h5>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        Label Hotspot:
                      </label>
                      <input
                        type="text"
                        value={currentStep.hotspot.label}
                        onChange={e => {
                          const val = e.target.value;
                          updateCurrentStep(prev => ({
                            ...prev,
                            hotspot: { ...prev.hotspot, label: val }
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600">
                          Posisi X: {currentStep.hotspot.x}%
                        </label>
                        <input
                          type="range"
                          min={5}
                          max={95}
                          value={currentStep.hotspot.x}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            updateCurrentStep(prev => ({
                              ...prev,
                              hotspot: { ...prev.hotspot, x: val },
                              cursorAnimation: { ...prev.cursorAnimation, endX: val }
                            }));
                          }}
                          className="w-full accent-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600">
                          Posisi Y: {currentStep.hotspot.y}%
                        </label>
                        <input
                          type="range"
                          min={10}
                          max={90}
                          value={currentStep.hotspot.y}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            updateCurrentStep(prev => ({
                              ...prev,
                              hotspot: { ...prev.hotspot, y: val },
                              cursorAnimation: { ...prev.cursorAnimation, endY: val }
                            }));
                          }}
                          className="w-full accent-teal-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Callout Config */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Balon Instruksi (Callout Balloon)
                    </h5>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                        Judul &amp; Teks Callout:
                      </label>
                      <input
                        type="text"
                        value={currentStep.callout.title}
                        onChange={e => {
                          const val = e.target.value;
                          updateCurrentStep(prev => ({
                            ...prev,
                            callout: { ...prev.callout, title: val }
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white mb-1.5"
                      />
                      <input
                        type="text"
                        value={currentStep.callout.text}
                        onChange={e => {
                          const val = e.target.value;
                          updateCurrentStep(prev => ({
                            ...prev,
                            callout: { ...prev.callout, text: val }
                          }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600">
                          Posisi X: {currentStep.callout.x}%
                        </label>
                        <input
                          type="range"
                          min={5}
                          max={90}
                          value={currentStep.callout.x}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            updateCurrentStep(prev => ({
                              ...prev,
                              callout: { ...prev.callout, x: val }
                            }));
                          }}
                          className="w-full accent-teal-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600">
                          Posisi Y: {currentStep.callout.y}%
                        </label>
                        <input
                          type="range"
                          min={10}
                          max={90}
                          value={currentStep.callout.y}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            updateCurrentStep(prev => ({
                              ...prev,
                              callout: { ...prev.callout, y: val }
                            }));
                          }}
                          className="w-full accent-teal-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
