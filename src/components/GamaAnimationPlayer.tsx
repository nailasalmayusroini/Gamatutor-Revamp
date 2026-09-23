import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  MousePointer, 
  Sparkles, 
  CheckCircle, 
  Activity, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Maximize2,
  FileText,
  Search,
  Check,
  ShieldCheck,
  Stethoscope,
  Pill,
  Fingerprint
} from 'lucide-react';
import { TutorialStep, BackdropType } from '../types/gamatutor';

interface GamaAnimationPlayerProps {
  steps: TutorialStep[];
  tutorialTitle: string;
  category?: string;
  isInteractiveMode?: boolean; // Try-it mode vs Auto-demo
  setIsInteractiveMode?: (interactive: boolean) => void;
  audioNarrationEnabled?: boolean;
  onStepComplete?: (stepNumber: number) => void;
  onTutorialFinish?: () => void;
  className?: string;
}

export const GamaAnimationPlayer: React.FC<GamaAnimationPlayerProps> = ({
  steps,
  tutorialTitle,
  category = 'Rekam Medis Elektronik',
  isInteractiveMode = true,
  setIsInteractiveMode,
  audioNarrationEnabled = true,
  onStepComplete,
  onTutorialFinish,
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [stepTimer, setStepTimer] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: 15, y: 80 });
  const [hasInteractedCurrentStep, setHasInteractedCurrentStep] = useState(false);
  const [soundMuted, setSoundMuted] = useState(!audioNarrationEnabled);
  const [simulatedInputValue, setSimulatedInputValue] = useState('');
  const [successFlash, setSuccessFlash] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentStep = steps[currentStepIndex] || steps[0];

  // Sync mute with external setting
  useEffect(() => {
    setSoundMuted(!audioNarrationEnabled);
  }, [audioNarrationEnabled]);

  // Voice narration using Web Speech API
  const speakNarration = (text: string) => {
    if (soundMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = playbackSpeed;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore speech failure
    }
  };

  // Reset or initialize step
  useEffect(() => {
    if (!currentStep) return;
    setStepTimer(0);
    setHasInteractedCurrentStep(false);
    setSimulatedInputValue('');

    // Animate cursor from start to end over 800ms
    if (currentStep.cursorAnimation) {
      setCursorPos({
        x: currentStep.cursorAnimation.startX,
        y: currentStep.cursorAnimation.startY,
      });

      const timer = setTimeout(() => {
        setCursorPos({
          x: currentStep.cursorAnimation.endX,
          y: currentStep.cursorAnimation.endY,
        });
      }, 350);

      // Trigger narration
      speakNarration(currentStep.narration);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, currentStep, soundMuted]);

  // Timer loop for auto playback
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setStepTimer(prev => {
        const nextTime = prev + 0.1 * playbackSpeed;
        const targetDuration = currentStep?.duration || 5;

        // In interactive mode, wait for user click to advance if they haven't interacted
        if (isInteractiveMode && !hasInteractedCurrentStep && nextTime >= targetDuration - 0.5) {
          return targetDuration - 0.5; // hold waiting for action
        }

        if (nextTime >= targetDuration) {
          // Advance to next step
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(curr => curr + 1);
            if (onStepComplete) onStepComplete(currentStepIndex + 1);
            return 0;
          } else {
            setIsPlaying(false);
            if (onTutorialFinish) onTutorialFinish();
            return targetDuration;
          }
        }
        return nextTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed, isInteractiveMode, hasInteractedCurrentStep, currentStep]);

  // Handle user interaction on the hotspot
  const handleHotspotClick = () => {
    setHasInteractedCurrentStep(true);
    setSuccessFlash(true);
    setTimeout(() => setSuccessFlash(false), 800);

    if (currentStep.actionType === 'type') {
      setSimulatedInputValue('3374020101980003');
    }

    if (onStepComplete) {
      onStepComplete(currentStepIndex + 1);
    }

    // Auto advance in interactive mode
    if (isInteractiveMode) {
      setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
          if (onTutorialFinish) onTutorialFinish();
        }
      }, 700);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      if (onTutorialFinish) onTutorialFinish();
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setStepTimer(0);
    setHasInteractedCurrentStep(false);
    setIsPlaying(true);
  };

  if (!currentStep) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-100 rounded-2xl">
        Tidak ada adegan tutorial yang dimuat.
      </div>
    );
  }

  const stepProgress = Math.min(100, (stepTimer / (currentStep.duration || 5)) * 100);

  // Render Simulated Realistic Backdrops
  const renderBackdropUI = (backdrop: BackdropType) => {
    switch (backdrop) {
      case 'rme_hospital':
        return (
          <div className="w-full h-full bg-slate-50 flex flex-col font-sans select-none overflow-hidden text-slate-800">
            {/* SIMRS Header Bar */}
            <div className="bg-teal-800 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-300" />
                <span className="font-bold tracking-wide">SIMRS GAMA-MEDIKA v4.2 • UGM Healthcare System</span>
                <span className="bg-teal-700 text-teal-100 px-2 py-0.5 rounded-xs text-[10px]">Loket Admisi 03</span>
              </div>
              <div className="flex items-center gap-3 text-teal-100 text-[11px]">
                <span>Petugas: Naila (NIP: 19980421)</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Bridging BPJS Aktif
                </span>
              </div>
            </div>

            {/* SIMRS Content Workspace */}
            <div className="flex-1 p-4 grid grid-cols-12 gap-3 bg-slate-100/60 overflow-hidden text-xs">
              {/* Left Column: Form Pendaftaran Pasien */}
              <div className="col-span-8 bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      Pendaftaran Pasien Rawat Jalan (Outpatient Registry)
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">No. Antrean: A-042</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Search NIK Field */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <Fingerprint className="w-3.5 h-3.5 text-teal-600" />
                        Pindai / Masukkan NIK (KTP / KIS)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={simulatedInputValue || (currentStepIndex > 0 ? '3374020101980003' : '')}
                          placeholder="Masukkan 16 digit NIK..."
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border font-mono tracking-wider transition-all ${
                            currentStep.targetElement.includes('NIK')
                              ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-400/20'
                              : 'border-slate-300 bg-slate-50'
                          }`}
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2" />
                      </div>
                    </div>

                    {/* No. Rekam Medis */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nomor Rekam Medis (RM Tunggal)
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={currentStepIndex >= 1 ? 'RM-2026-089421' : 'Menunggu NIK...'}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-100 font-mono font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Pasien Info Card */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3 grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Nama Lengkap:</span>
                      <strong className="text-slate-800">Bpk. Haryono Pratama</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tgl Lahir / Umur:</span>
                      <span className="text-slate-700">14 Mei 1978 (48 Th)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Jenis Pasien:</span>
                      <span className="text-teal-700 font-bold">BPJS PBI (Kelas 3)</span>
                    </div>
                  </div>

                  {/* BPJS Bridging & Poli Selection Row */}
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-teal-50/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-teal-900 text-[11px]">Integrasi BPJS VClaim</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                          currentStepIndex >= 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {currentStepIndex >= 2 ? 'SEP Terbit: 0301R00126V001' : 'Perlu Bridging'}
                        </span>
                      </div>
                      <button 
                        className={`w-full py-1.5 px-2 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          currentStep.targetElement.includes('BPJS')
                            ? 'bg-teal-600 text-white shadow-xs animate-pulse ring-2 ring-teal-400'
                            : 'bg-white border border-slate-300 text-slate-700'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Bridging BPJS &amp; Generate SEP
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Poliklinik Tujuan &amp; DPJP
                      </label>
                      <select 
                        disabled 
                        className={`w-full p-1.5 rounded-md border text-xs bg-white text-slate-800 font-medium ${
                          currentStep.targetElement.includes('Poli')
                            ? 'border-teal-500 ring-2 ring-teal-400/30 font-bold text-teal-800'
                            : 'border-slate-300'
                        }`}
                      >
                        <option>Poli Penyakit Dalam - dr. Sulistyo, Sp.PD</option>
                        <option>Poli Jantung &amp; Pembuluh Darah</option>
                        <option>Poli Bedah Umum</option>
                      </select>
                      <p className="text-[10px] text-slate-500 mt-1">Sisa Kuota Dokter: 6 Pasien</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                  <span className="text-[10px] text-slate-500">
                    Standar Keselamatan Pasien: Permenkes 24/2022
                  </span>
                  <button 
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                      currentStep.targetElement.includes('Simpan')
                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 animate-pulse'
                        : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Simpan &amp; Cetak Gelang Identitas
                  </button>
                </div>
              </div>

              {/* Right Column: Antrean & Status Rawat Jalan */}
              <div className="col-span-4 bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex flex-col">
                <h5 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  Live Monitor Poliklinik
                </h5>

                <div className="space-y-2 flex-1">
                  <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-[11px]">
                    <div className="flex justify-between items-center font-bold text-teal-900">
                      <span>Poli Penyakit Dalam</span>
                      <span className="text-teal-600">Ruang 102</span>
                    </div>
                    <p className="text-slate-600 text-[10px]">Sedang Diperiksa: A-041</p>
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-teal-600 h-1 w-3/4"></div>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>Poli Saraf</span>
                      <span className="text-slate-500">Ruang 105</span>
                    </div>
                    <p className="text-slate-500 text-[10px]">Sedang Diperiksa: B-018</p>
                  </div>

                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px]">
                    <span className="font-bold text-amber-900 block">Status Rekam Medis:</span>
                    <p className="text-[10px] text-amber-800">
                      Sinkronisasi SatuSehat Kemenkes: Terhubung
                    </p>
                  </div>
                </div>

                <div className="mt-auto p-2 bg-slate-100 rounded-lg text-[10px] text-slate-600 text-center font-medium">
                  GamaTutor Interactive Simulator
                </div>
              </div>
            </div>
          </div>
        );

      case 'rme_triage':
        return (
          <div className="w-full h-full bg-slate-900 text-white flex flex-col font-sans select-none overflow-hidden p-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-bold text-sm tracking-wide text-red-400">
                  RME TRIASE GAWAT DARURAT (IGD UGM HOSPITAL)
                </span>
              </div>
              <span className="text-xs bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded-sm">
                Pedoman Australasian Triage Scale (ATS)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 flex-1">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <h5 className="font-bold text-xs text-slate-300 mb-2">Tanda Vital Pasien (ABC)</h5>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-slate-900 rounded-lg flex justify-between items-center border border-slate-700">
                    <span className="text-slate-400">SpO2:</span>
                    <span className="font-mono font-bold text-red-400 text-sm">88% (Kritis)</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg flex justify-between items-center border border-slate-700">
                    <span className="text-slate-400">Laju Nadi:</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">118 bpm</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg flex justify-between items-center border border-slate-700">
                    <span className="text-slate-400">Tekanan Darah:</span>
                    <span className="font-mono font-bold text-slate-200">140/90 mmHg</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 col-span-2 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xs text-slate-300 mb-2">Penetapan Zona Triase</h5>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button className={`p-3 rounded-xl border font-bold text-xs text-center transition-all ${
                      currentStep.targetElement.includes('Merah')
                        ? 'bg-red-600 text-white ring-4 ring-red-400/40 scale-105 shadow-lg'
                        : 'bg-red-950/60 border-red-800 text-red-300'
                    }`}>
                      ZONA MERAH
                      <span className="block text-[10px] font-normal opacity-80">Resusitasi Segera (0 Menit)</span>
                    </button>
                    <button className="p-3 rounded-xl border border-amber-800 bg-amber-950/40 text-amber-300 font-bold text-xs text-center opacity-60">
                      ZONA KUNING
                      <span className="block text-[10px] font-normal opacity-80">Gawat Tidak Darurat (15 Menit)</span>
                    </button>
                    <button className="p-3 rounded-xl border border-emerald-800 bg-emerald-950/40 text-emerald-300 font-bold text-xs text-center opacity-60">
                      ZONA HIJAU
                      <span className="block text-[10px] font-normal opacity-80">Tidak Gawat Tidak Darurat (60 Menit)</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white shadow-md flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Kirim Sinyal Tim Medis Resusitasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pharmacy_system':
        return (
          <div className="w-full h-full bg-slate-50 flex flex-col font-sans select-none overflow-hidden p-4 text-slate-800">
            <div className="bg-emerald-800 text-white px-4 py-2 rounded-t-xl flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-300" />
                <span>Instalasi Farmasi Rumah Sakit • Telaah Resep 7 Benar</span>
              </div>
              <span className="bg-emerald-700 px-2 py-0.5 rounded text-[10px]">Apoteker: On-Duty</span>
            </div>

            <div className="bg-white rounded-b-xl border border-slate-200 p-4 flex-1 flex flex-col justify-between shadow-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-slate-700">Daftar Obat Elektronik (RME)</h5>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>1. Amlodipine 10mg Tab</span>
                      <span className="text-teal-700">1 x 1 Malam</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>2. Metformin 500mg Tab</span>
                      <span className="text-teal-700">3 x 1 dc</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-slate-700">Skrining Interaksi Obat &amp; Alergi</h5>
                  <div className={`p-2.5 rounded-lg border text-xs ${
                    currentStep.targetElement.includes('Interaksi')
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}>
                    <span className="font-bold text-amber-900 block">Hasil Drug Interaction Engine:</span>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Tidak ditemukan interaksi mayor kontraindikasi. Aman untuk diproses.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Prinsip: Tepat Pasien, Tepat Obat, Tepat Dosis, Tepat Rute</span>
                <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                  Cetak Etiket Aturan Pakai Pasien
                </button>
              </div>
            </div>
          </div>
        );

      case 'laboratory_lims':
        return (
          <div className="w-full h-full bg-slate-900 text-white flex flex-col font-sans select-none overflow-hidden p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                LIMS Hematology Analyzer • UGM Medical Lab
              </span>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded text-[10px]">
                Analyzer Sysmex XN-1000
              </span>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <span className="text-[11px] text-slate-400 block mb-1">Barcode Tabung Spesimen EDTA:</span>
                  <div className="font-mono text-cyan-300 font-bold text-sm bg-slate-950 p-2 rounded border border-cyan-900/60">
                    ||||||||||||||||||||||||||||||||| LAB-2026-9921
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <span className="text-[11px] text-slate-400 block mb-1">Hasil Uji Kritis:</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Hemoglobin (Hb):</span>
                    <span className="font-bold font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                      6.2 g/dL (KRITIS &lt; 7.0)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Protokol Nilai Kritis: Hubungi DPJP &lt; 15 Menit via SBAR</span>
                <button className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg">
                  Kirim &amp; Validasi ke Rekam Medis
                </button>
              </div>
            </div>
          </div>
        );

      case 'flowchart_logic':
      default:
        return (
          <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col font-sans select-none overflow-hidden p-4 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2 text-xs">
              <span className="font-bold text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Gama Logic Visualizer &amp; Pipeline Engine
              </span>
              <span className="text-slate-400 text-[11px]">Algoritma &amp; Arsitektur Konsep</span>
            </div>

            {/* Simulated Flowchart Nodes */}
            <div className="flex-1 flex flex-col items-center justify-around py-2 relative">
              {/* Node 1: Input / Initial */}
              <div className={`px-6 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
                currentStepIndex === 0
                  ? 'bg-teal-600 text-white border-teal-400 ring-4 ring-teal-400/30 scale-105'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                [Start / Input Parameter Node]
              </div>

              <div className="w-0.5 h-6 bg-slate-600"></div>

              {/* Node 2: Logic / Transformation */}
              <div className={`px-6 py-3 rounded-xl border text-xs font-bold transition-all shadow-md transform rotate-0 ${
                currentStepIndex === 1
                  ? 'bg-amber-600 text-white border-amber-400 ring-4 ring-amber-400/30 scale-105'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                &lt; Decision &amp; Processing Block &gt;
              </div>

              <div className="w-0.5 h-6 bg-slate-600"></div>

              {/* Node 3: Output / Resolution */}
              <div className={`px-6 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
                currentStepIndex >= 2
                  ? 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-400/30 scale-105'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                (Terminal Selesai / Validated Output)
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col ${className}`}>
      {/* Player Top Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></div>
          <span className="font-extrabold tracking-wide text-teal-300">
            Gama Animation Engine Player (GAE)
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 truncate max-w-[200px] sm:max-w-md font-medium">
            {tutorialTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switch: Try-It vs Auto Demo */}
          {setIsInteractiveMode && (
            <button
              onClick={() => setIsInteractiveMode(!isInteractiveMode)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                isInteractiveMode
                  ? 'bg-teal-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isInteractiveMode ? '🎯 Mode: Coba Sendiri (Try-It)' : '▶️ Mode: Auto Demo'}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundMuted(prev => !prev)}
            title={soundMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
            className="p-1 rounded text-slate-300 hover:text-white"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage / Screen Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full h-[360px] sm:h-[440px] bg-slate-950 overflow-hidden select-none"
      >
        {/* Render Backdrop */}
        {renderBackdropUI(currentStep.backdrop)}

        {/* Hotspot Pulsing Indicator */}
        {currentStep.hotspot && (
          <div
            onClick={handleHotspotClick}
            style={{
              left: `${currentStep.hotspot.x}%`,
              top: `${currentStep.hotspot.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-teal-500/30 hotspot-pulsing flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                  <MousePointer className="w-3.5 h-3.5 fill-white" />
                </div>
              </div>

              {/* Hotspot Floating Tooltip */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xl border border-teal-500/50 pointer-events-none z-30">
                {currentStep.hotspot.label}
                <div className="text-[9px] text-teal-300 font-normal">
                  {currentStep.hotspot.interactiveHint || 'Klik untuk melanjutkan aksi'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Instructional Callout Balloon */}
        {currentStep.callout && (
          <div
            style={{
              left: `${currentStep.callout.x}%`,
              top: `${currentStep.callout.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-25 max-w-[280px] pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95"
          >
            <div className={`p-3 rounded-xl shadow-2xl border backdrop-blur-md ${
              currentStep.callout.type === 'warning'
                ? 'bg-amber-900/90 text-amber-50 border-amber-500/60'
                : currentStep.callout.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-50 border-emerald-500/60'
                : 'bg-slate-900/90 text-white border-teal-500/60'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>{currentStep.callout.title}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-95">
                {currentStep.callout.text}
              </p>
            </div>
          </div>
        )}

        {/* Animated Flying Cursor Simulation */}
        <div
          style={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
            transition: 'left 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="absolute pointer-events-none z-35 -translate-x-1 -translate-y-1"
        >
          <div className="relative">
            <svg
              className="w-7 h-7 drop-shadow-lg text-teal-500 fill-teal-400 stroke-slate-900 stroke-2"
              viewBox="0 0 24 24"
            >
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
            <span className="absolute left-6 top-1 text-[10px] font-bold bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap">
              {currentStep.actionType.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Success Action Feedback Flash */}
        {successFlash && (
          <div className="absolute inset-0 bg-teal-500/20 backdrop-blur-[1px] flex items-center justify-center z-40 pointer-events-none animate-in fade-in zoom-in">
            <div className="bg-slate-900/90 text-teal-300 px-4 py-2 rounded-xl text-xs font-bold border border-teal-400 flex items-center gap-2 shadow-2xl">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Langkah Berhasil Dilakukan!
            </div>
          </div>
        )}

        {/* Try-It Mode Hint Bar */}
        {isInteractiveMode && !hasInteractedCurrentStep && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs px-3.5 py-1.5 rounded-full border border-teal-400/60 shadow-xl flex items-center gap-2 z-30 animate-bounce">
            <MousePointer className="w-3.5 h-3.5 text-teal-400" />
            <span>{currentStep.interactivePrompt || 'Klik pada area hotspot yang berkedip untuk melanjutkan'}</span>
          </div>
        )}
      </div>

      {/* Narration Script Bar */}
      <div className="bg-teal-950 text-white px-4 py-3 flex items-start gap-3 border-t border-teal-900">
        <div className="w-7 h-7 rounded-lg bg-teal-800 text-teal-200 flex items-center justify-center shrink-0 mt-0.5">
          <Volume2 className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
              Langkah {currentStep.stepNumber} dari {steps.length}: {currentStep.title}
            </span>
            <span className="text-[10px] bg-teal-900 text-teal-200 px-1.5 py-0.2 rounded font-mono">
              Target: {currentStep.targetElement}
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            "{currentStep.narration}"
          </p>
        </div>
      </div>

      {/* Progress Timeline Scrubber */}
      <div className="bg-slate-900 px-4 pt-2">
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setCurrentStepIndex(idx)}
              className="flex-1 h-full cursor-pointer border-r border-slate-900 last:border-r-0 relative group"
              title={`Langkah ${s.stepNumber}: ${s.title}`}
            >
              <div 
                className={`h-full transition-all ${
                  idx < currentStepIndex
                    ? 'bg-teal-500'
                    : idx === currentStepIndex
                    ? 'bg-teal-400'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                style={{
                  width: idx === currentStepIndex ? `${stepProgress}%` : '100%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Playback Controls Footer */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-slate-200">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center transition-all shadow-md"
            title={isPlaying ? 'Jeda' : 'Putar Otomatis'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-white" />}
          </button>

          {/* Reset */}
          <button
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Ulangi dari Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back / Next */}
          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`p-1.5 rounded-lg ${
                currentStepIndex === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Langkah Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-400">
              {currentStepIndex + 1} / {steps.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className={`p-1.5 rounded-lg ${
                currentStepIndex === steps.length - 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Langkah Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Kecepatan:</span>
          <div className="flex bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            {[0.75, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded-md text-[11px] transition-colors ${
                  playbackSpeed === speed
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
