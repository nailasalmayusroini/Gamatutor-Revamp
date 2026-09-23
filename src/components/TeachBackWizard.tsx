import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Clapperboard, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  RefreshCw, 
  BookOpen, 
  Check, 
  Share2, 
  Trophy,
  Award,
  Layers,
  ChevronRight,
  Flame,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  TutorialStep, 
  GapDetectionResult, 
  TeachBackAssessment, 
  Tutorial, 
  TemplateStarterKit,
  UserProfile 
} from '../types/gamatutor';
import { STARTER_TEMPLATES } from '../data/mockData';
import { GamaAnimationEditor } from './GamaAnimationEditor';
import { GamaAnimationPlayer } from './GamaAnimationPlayer';

interface TeachBackWizardProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onTutorialPublished: (tutorial: Tutorial) => void;
  onBrowseTemplates: () => void;
  initialTemplate?: TemplateStarterKit | null;
}

export const TeachBackWizard: React.FC<TeachBackWizardProps> = ({
  userProfile,
  setUserProfile,
  onTutorialPublished,
  onBrowseTemplates,
  initialTemplate
}) => {
  // Wizard Phase: 1 (Topic & Initial Explanation) -> 2 (Knowledge Gap) -> 3 (Script Generation) -> 4 (Studio Editor) -> 5 (Teach-Back Check)
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [topic, setTopic] = useState(initialTemplate ? initialTemplate.title : 'Alur Pendaftaran Pasien Rawat Jalan & Validasi NIK BPJS');
  const [category, setCategory] = useState(initialTemplate ? initialTemplate.category : 'Rekam Medis Elektronik');
  const [targetAudience, setTargetAudience] = useState('Petugas Admisi & Mahasiswa RMIK');
  const [initialExplanation, setInitialExplanation] = useState(
    initialTemplate ? initialTemplate.defaultExplanation : 
    'Pasien datang ke loket admisi membawa KTP dan kartu BPJS. Petugas memasukkan NIK 16 digit pada sistem SIMRS untuk mencari nomor rekam medis. Jika data ditemukan, petugas melakukan bridging BPJS untuk mencetak Surat Eligibilitas Peserta (SEP) dan memilih poliklinik tujuan.'
  );

  // Voice recording simulation
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Phase 2 State: AI Knowledge Gap Detection
  const [isAnalyzingGaps, setIsAnalyzingGaps] = useState(false);
  const [gapResult, setGapResult] = useState<GapDetectionResult | null>(null);
  const [refinedExplanation, setRefinedExplanation] = useState('');

  // Phase 3 & 4 State: Script-to-Animation & Studio Editor
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scenes, setScenes] = useState<TutorialStep[]>(
    initialTemplate?.sampleScenes || STARTER_TEMPLATES[0].sampleScenes
  );

  // Phase 5 State: Teach-Back Check
  const [finalExplanation, setFinalExplanation] = useState('');
  const [isEvaluatingTeachBack, setIsEvaluatingTeachBack] = useState(false);
  const [teachBackResult, setTeachBackResult] = useState<TeachBackAssessment | null>(null);

  // Voice simulation
  const toggleVoiceRecording = (isInitial: boolean) => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        const speechSnippet = ' ' + (isInitial 
          ? 'Tambahan: Petugas juga harus melakukan bridging VClaim BPJS agar Surat Eligibilitas Peserta (SEP) dapat langsung diterbitkan secara online.'
          : 'Setelah merancang animasi, saya memahami bahwa verifikasi NIK 16 digit sangat krusial untuk mencegah nomor rekam medis ganda. Kemudian dilakukan bridging BPJS VClaim untuk menerbitkan SEP otomatis, memilih poliklinik dan DPJP, serta mencetak gelang identitas pasien.');
        
        if (isInitial) {
          setInitialExplanation(prev => prev + speechSnippet);
        } else {
          setFinalExplanation(prev => prev + speechSnippet);
        }
      }, 2500);
    } else {
      setIsRecordingVoice(false);
    }
  };

  // Run AI Knowledge Gap Detection
  const handleRunGapDetection = async () => {
    if (!topic || !initialExplanation) return;
    setIsAnalyzingGaps(true);

    try {
      const res = await fetch('/api/gap-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          explanation: initialExplanation,
          targetAudience,
          category
        })
      });

      if (!res.ok) throw new Error('Gagal memproses AI Gap Detection');
      const data: GapDetectionResult = await res.json();
      setGapResult(data);
      setRefinedExplanation(initialExplanation);
      setCurrentPhase(2);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingGaps(false);
    }
  };

  // Run AI Script-to-Animation
  const handleGenerateAnimationScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/script-to-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          explanation: refinedExplanation || initialExplanation,
          gaps: gapResult?.detectedGaps || [],
          category
        })
      });

      if (!res.ok) throw new Error('Gagal menghasilkan naskah animasi');
      const data = await res.json();
      if (data.scenes && data.scenes.length > 0) {
        setScenes(data.scenes);
      }
      setCurrentPhase(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Run Teach-Back Check
  const handleEvaluateTeachBack = async () => {
    if (!finalExplanation) return;
    setIsEvaluatingTeachBack(true);

    try {
      const res = await fetch('/api/teach-back-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          initialExplanation,
          finalExplanation,
          initialGaps: gapResult?.detectedGaps || []
        })
      });

      if (!res.ok) throw new Error('Gagal mengevaluasi Teach-Back');
      const assessment: TeachBackAssessment = await res.json();
      setTeachBackResult(assessment);

      // Award XP to user profile
      setUserProfile(prev => ({
        ...prev,
        xp: prev.xp + assessment.earnedXP,
        tutorialsCreated: prev.tutorialsCreated + 1,
        completedChallenges: prev.completedChallenges + 1
      }));

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluatingTeachBack(false);
    }
  };

  // Publish to Community Hub
  const handlePublishTutorial = () => {
    const newTutorial: Tutorial = {
      id: `tut-${Date.now()}`,
      title: topic,
      description: `Tutorial interaktif GamaTutor hasil TeachBack mode: "${topic}".`,
      category: category,
      difficulty: 'Menengah',
      scenes: scenes,
      author: {
        name: userProfile.name,
        role: userProfile.role,
        avatar: userProfile.avatar,
        badge: teachBackResult?.masteryBadge || 'Feynman Explainer'
      },
      views: 1,
      likes: 1,
      peerFeedbackCount: 0,
      createdAt: 'Baru saja',
      tags: [category, 'GamaTutor', 'TeachBack', 'GAE'],
      teachBackScores: {
        before: teachBackResult?.beforeScore || 60,
        after: teachBackResult?.afterScore || 90,
        delta: teachBackResult?.improvementDelta || 30
      }
    };

    onTutorialPublished(newTutorial);
  };

  // Step names
  const stepsMeta = [
    { num: 1, title: 'Pemahaman Awal', icon: BrainCircuit },
    { num: 2, title: 'Celah Konsep AI', icon: Sparkles },
    { num: 3, title: 'Adegan Animasi', icon: Clapperboard },
    { num: 4, title: 'Editor Visual', icon: Sliders },
    { num: 5, title: 'Teach-Back Check', icon: CheckCircle2 }
  ];

  // Quick suggestion chips for phase 1
  const quickTopics = [
    { title: 'RME Pendaftaran Rawat Jalan', cat: 'Rekam Medis Elektronik' },
    { title: 'Triase Gawat Darurat IGD', cat: 'Rekam Medis Elektronik' },
    { title: 'Resep Elektronik & Skrining 7 Benar', cat: 'Kedokteran & Farmasi' },
    { title: 'Backpropagation Neural Network', cat: 'Sains Data & AI' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* High-Contrast Stepper Header Bar */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Mode TeachBack
              </h1>
              <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-800">
                Learning-by-Teaching
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Fase Aktif {currentPhase} dari 5: <strong className="text-teal-400">{stepsMeta[currentPhase - 1].title}</strong>
            </p>
          </div>

          <button
            onClick={onBrowseTemplates}
            className="text-xs font-bold text-teal-300 hover:text-white bg-teal-950/80 hover:bg-teal-900 border border-teal-700/80 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto shadow-xs"
          >
            Pilih dari Starter Templates
          </button>
        </div>

        {/* High-Contrast Step Progress Buttons */}
        <div className="pt-4 flex items-center justify-between gap-1.5 sm:gap-2">
          {stepsMeta.map((s) => {
            const Icon = s.icon;
            const isCurrent = currentPhase === s.num;
            const isCompleted = currentPhase > s.num;

            return (
              <button
                key={s.num}
                onClick={() => {
                  if (isCompleted || (s.num === 2 && gapResult) || (s.num === 3 && scenes) || s.num === 4) {
                    setCurrentPhase(s.num as any);
                  }
                }}
                disabled={s.num > currentPhase && !gapResult}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all ${
                  isCurrent
                    ? 'bg-teal-400 text-slate-950 shadow-md ring-2 ring-teal-300'
                    : isCompleted
                    ? 'bg-teal-950/80 text-teal-300 border border-teal-700/80 hover:bg-teal-900'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-800 opacity-60 cursor-not-allowed'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-slate-950' : isCompleted ? 'text-teal-300' : 'text-slate-400'}`} />
                <span className="hidden sm:inline truncate">{s.title}</span>
                <span className="sm:hidden">{s.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PHASE 1: TOPIK & PEMAHAMAN AWAL (HIGH CONTRAST)           */}
      {/* ========================================================= */}
      {currentPhase === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm space-y-6 animate-in fade-in duration-200">
          {/* Section 1: Topic Input */}
          <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-300 border-l-4 border-l-teal-600 space-y-3">
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-1">
                Topik yang Sedang Anda Pelajari:
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Contoh: Alur Pendaftaran Pasien Rawat Jalan di SIMRS"
                className="w-full px-4 py-3 text-sm rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none bg-white transition-all font-bold text-slate-900 shadow-2xs"
              />
            </div>

            {/* Quick Topic Chips with Crisp Tint */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-xs text-slate-700 font-bold">Rekomendasi Topik:</span>
              {quickTopics.map((qt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(qt.title);
                    setCategory(qt.cat);
                  }}
                  className="text-xs px-3 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold border border-teal-300 transition-colors shadow-2xs"
                >
                  {qt.title}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Explanation Input */}
          <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-300 border-l-4 border-l-cyan-600 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label className="block text-sm font-extrabold text-slate-900">
                  Apa yang Anda Pahami Saat Ini?
                </label>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tuliskan alur atau konsepnya dengan bahasa lugas Anda sendiri. AI akan membantu menemukan celah pemahaman.
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleVoiceRecording(true)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 shadow-2xs ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
                <span>{isRecordingVoice ? 'Merekam...' : 'Gunakan Suara'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={initialExplanation}
              onChange={e => setInitialExplanation(e.target.value)}
              placeholder="Ceritakan urutan langkah-langkahnya: apa yang dilakukan pertama kali, data apa yang dimasukkan, tombol apa yang diklik, dan apa hasil akhirnya..."
              className="w-full p-4 text-sm rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none leading-relaxed text-slate-900 bg-white font-medium shadow-2xs"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRunGapDetection}
              disabled={isAnalyzingGaps || !topic.trim() || !initialExplanation.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-extrabold bg-teal-700 hover:bg-teal-800 text-white shadow-md shadow-teal-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isAnalyzingGaps ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Sedang Menganalisis Celah...</span>
                </>
              ) : (
                <>
                  <span>Analisis Celah Pengetahuan dengan AI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 2: AI KNOWLEDGE GAP DETECTION (HIGH CONTRAST)       */}
      {/* ========================================================= */}
      {currentPhase === 2 && gapResult && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm space-y-6 animate-in fade-in duration-200">
          {/* High Contrast Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
            <div>
              <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider block">
                Evaluasi Awal Konsep (AI Knowledge Gap)
              </span>
              <p className="text-sm text-slate-200 font-medium mt-1 leading-relaxed">
                {gapResult.overallSummary}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/20 text-center">
                <span className="text-[10px] text-slate-300 block font-semibold uppercase">Kelengkapan</span>
                <span className="text-lg font-black text-teal-300">{gapResult.completenessScore}%</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/20 text-center">
                <span className="text-[10px] text-slate-300 block font-semibold uppercase">Kejelasan</span>
                <span className="text-lg font-black text-teal-300">{gapResult.clarityScore}%</span>
              </div>
            </div>
          </div>

          {/* Two-Zone Layout: Gaps List (Left) & Refinement (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Zone: Detected Gaps with Bold Warning Borders */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Konsep Kritis yang Perlu Ditambahkan:
                </h4>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {gapResult.detectedGaps.length} Celah
                </span>
              </div>

              <div className="space-y-3">
                {gapResult.detectedGaps.map(gap => (
                  <div 
                    key={gap.id}
                    className={`p-4 rounded-xl border-2 transition-colors space-y-2 text-xs shadow-2xs ${
                      gap.severity === 'high'
                        ? 'bg-rose-50/90 border-rose-300 border-l-4 border-l-rose-600 text-rose-950'
                        : 'bg-amber-50/90 border-amber-300 border-l-4 border-l-amber-600 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-slate-900 text-xs">{gap.title}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded text-white shadow-2xs ${
                        gap.severity === 'high'
                          ? 'bg-rose-600'
                          : 'bg-amber-600'
                      }`}>
                        {gap.severity === 'high' ? 'PENTING' : 'SARAN'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {gap.description}
                    </p>

                    {/* Quick Button to Insert into explanation */}
                    <button
                      type="button"
                      onClick={() => {
                        setRefinedExplanation(prev => 
                          prev + `\n\nCatatan Tambahan: Terkait ${gap.title}, ${gap.description}`
                        );
                      }}
                      className="text-xs font-bold text-teal-800 hover:text-teal-950 bg-white hover:bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-300 flex items-center gap-1.5 mt-2 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-teal-600" />
                      Sisipkan Catatan Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Zone: Interactive Refinement Box */}
            <div className="lg:col-span-7 space-y-2 p-5 bg-slate-50/80 rounded-2xl border border-slate-300">
              <label className="block text-xs font-extrabold text-slate-900">
                Sempurnakan Penjelasan Anda:
              </label>
              <textarea
                rows={9}
                value={refinedExplanation}
                onChange={e => setRefinedExplanation(e.target.value)}
                className="w-full p-4 text-xs sm:text-sm rounded-xl border-2 border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-none leading-relaxed text-slate-900 bg-white font-medium shadow-2xs"
                placeholder="Perbarui penjelasan Anda agar mencakup celah di sebelah kiri..."
              />
              <p className="text-xs text-slate-600 font-medium">
                💡 Penjelasan ini akan langsung diterjemahkan oleh AI menjadi naskah animasi langkah-demi-langkah.
              </p>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPhase(1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <button
              onClick={handleGenerateAnimationScript}
              disabled={isGeneratingScript}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-teal-700 hover:bg-teal-800 text-white shadow-md transition-colors"
            >
              {isGeneratingScript ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Merancang Animasi...</span>
                </>
              ) : (
                <>
                  <span>Lanjut: Rancang Adegan Animasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 3: AI SCRIPT-TO-ANIMATION (PLAYER AS VISUAL ANCHOR)  */}
      {/* ========================================================= */}
      {currentPhase === 3 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Draf Animasi Interaktif
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                AI telah menyusun penjelasan Anda menjadi {scenes.length} adegan interaktif.
              </p>
            </div>
            <span className="text-xs font-extrabold text-teal-900 bg-teal-100 px-3 py-1 rounded-lg border border-teal-300">
              {scenes.length} Langkah Terangkai
            </span>
          </div>

          {/* The Player Preview */}
          <GamaAnimationPlayer
            steps={scenes}
            tutorialTitle={topic}
            isInteractiveMode={true}
          />

          {/* High-Contrast Step Cards Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {scenes.map(s => (
              <div key={s.id} className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xs text-xs space-y-1">
                <span className="text-[10px] font-black text-slate-950 bg-teal-400 px-2 py-0.5 rounded block w-fit">
                  Langkah {s.stepNumber}
                </span>
                <span className="font-bold text-white line-clamp-1 block">
                  {s.title}
                </span>
                <span className="text-[10px] text-teal-300 font-mono block">
                  {s.duration}s • {s.actionType}
                </span>
              </div>
            ))}
          </div>

          {/* Navigation Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPhase(2)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>

            <button
              onClick={() => setCurrentPhase(4)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-teal-700 hover:bg-teal-800 text-white shadow-md transition-colors"
            >
              <span>Buka Studio Editor Visual</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 4: GAMA ANIMATION STUDIO VISUAL EDITOR              */}
      {/* ========================================================= */}
      {currentPhase === 4 && (
        <div className="animate-in fade-in duration-200">
          <GamaAnimationEditor
            steps={scenes}
            setSteps={setScenes}
            tutorialTitle={topic}
            onSaveAndProceed={() => setCurrentPhase(5)}
            onBackToScript={() => setCurrentPhase(3)}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASE 5: TEACH-BACK CHECK (HIGH CONTRAST FEYNMAN RECALL)  */}
      {/* ========================================================= */}
      {currentPhase === 5 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
            <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider block">
              Uji Retensi Feynman: Teach-Back Check
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              Jelaskan Kembali Alur Ini dari Memori Anda
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Jelaskan kembali dengan kata-kata Anda sendiri <strong>tanpa melihat naskah animasi</strong> untuk membuktikan penguasaan konsep yang mendalam.
            </p>
          </div>

          {/* Textarea Input Container */}
          <div className="p-5 bg-slate-50/90 rounded-2xl border border-slate-300 border-l-4 border-l-emerald-600 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="block text-sm font-extrabold text-slate-900">
                Penjelasan Akhir Anda:
              </label>

              <button
                type="button"
                onClick={() => toggleVoiceRecording(false)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800'
                }`}
              >
                {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
                <span>{isRecordingVoice ? 'Merekam...' : 'Gunakan Suara'}</span>
              </button>
            </div>

            <textarea
              rows={6}
              value={finalExplanation}
              onChange={e => setFinalExplanation(e.target.value)}
              placeholder="Jelaskan secara runtut apa saja langkah kritis yang harus dilakukan dan mengapa langkah tersebut penting..."
              className="w-full p-4 text-xs sm:text-sm rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none leading-relaxed text-slate-900 bg-white font-medium shadow-2xs"
            />
          </div>

          {/* Action Bar before results */}
          {!teachBackResult && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setCurrentPhase(4)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Editor
              </button>

              <button
                onClick={handleEvaluateTeachBack}
                disabled={isEvaluatingTeachBack || !finalExplanation.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors disabled:opacity-50"
              >
                {isEvaluatingTeachBack ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengevaluasi Penguasaan...</span>
                  </>
                ) : (
                  <>
                    <span>Evaluasi Penguasaan Pemahaman</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Clean Results Scorecard */}
          {teachBackResult && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white space-y-5 shadow-lg animate-in zoom-in-95">
              {/* Header with Jump Scores */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-teal-800">
                <div>
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                    Peningkatan Pemahaman Anda:
                  </span>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    {teachBackResult.masteryBadge}
                  </h4>
                </div>

                <div className="flex items-center gap-3 bg-teal-950/80 px-4 py-2 rounded-xl border border-teal-800">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block">Awal</span>
                    <span className="text-base font-bold text-slate-300">{teachBackResult.beforeScore}%</span>
                  </div>
                  <span className="text-teal-500">➔</span>
                  <div className="text-center">
                    <span className="text-[10px] text-teal-300 block">Akhir</span>
                    <span className="text-xl font-extrabold text-teal-300">{teachBackResult.afterScore}%</span>
                  </div>
                  <div className="pl-3 border-l border-teal-800 text-center">
                    <span className="text-[10px] text-emerald-400 block font-bold">Kenaikan</span>
                    <span className="text-sm font-extrabold text-emerald-300">+{teachBackResult.improvementDelta}%</span>
                  </div>
                </div>
              </div>

              {/* Concise Feedback Text */}
              <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                {teachBackResult.pedagogicalVerdict}
              </p>

              {/* Mastered Concepts */}
              <div className="p-3.5 bg-teal-950/60 rounded-xl border border-teal-800">
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block mb-2">
                  Konsep yang Berhasil Dikuasai:
                </span>
                <ul className="space-y-1 text-xs text-slate-200">
                  {teachBackResult.resolvedGaps.map((g, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Publish Action */}
              <div className="pt-3 border-t border-teal-800 flex items-center justify-between">
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  +{teachBackResult.earnedXP} XP Diperoleh!
                </span>

                <button
                  onClick={handlePublishTutorial}
                  className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform hover:scale-102"
                >
                  <Share2 className="w-4 h-4" />
                  Publikasikan ke Community Hub
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
