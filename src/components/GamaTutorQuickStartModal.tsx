import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  HelpCircle, 
  BrainCircuit, 
  Clapperboard, 
  Sliders, 
  CheckCircle2, 
  Share2,
  GraduationCap,
  ArrowRight
} from 'lucide-react';

interface GamaTutorQuickStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTeaching: () => void;
  onBrowseTemplates: () => void;
}

export const GamaTutorQuickStartModal: React.FC<GamaTutorQuickStartModalProps> = ({
  isOpen,
  onClose,
  onStartTeaching,
  onBrowseTemplates
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      step: 1,
      badge: 'Prinsip Inti',
      title: 'Selamat Datang di GamaTutor',
      tagline: 'Learning-by-Teaching: Berubah dari Penonton Menjadi Pembelajar Aktif',
      icon: GraduationCap,
      color: 'teal',
      description: 'GamaTutor berakar dari Gama Animation Engine (GAE) yang awalnya dikembangkan di Universitas Gadjah Mada (UGM) untuk merekam dan melabeli alur Rekam Medis Elektronik (RME). Di versi modern ini, filosofinya diperkuat dengan metode Feynman: cara terbaik menguasai sesuatu adalah dengan mempersiapkan diri untuk mengajarkannya kepada orang lain.',
      keyTakeaways: [
        'Bukan sekadar pasif menonton video tutorial',
        'Mengonstruksi pemahaman sendiri melalui media animasi interaktif',
        'Siklus: Pahami → Uji Celah → Animasi → Ajar Kembali → Feedback Rekan'
      ]
    },
    {
      step: 2,
      badge: 'Tahap 1: Inisiasi',
      title: 'Pilih Topik & Tuliskan Pemahaman Awal Anda',
      tagline: 'Gunakan Kata-kata Anda Sendiri, Tanpa Takut Salah',
      icon: BrainCircuit,
      color: 'indigo',
      description: 'Mulailah dengan memilih keterampilan atau prosedur yang sedang Anda pelajari (misalnya: Pendaftaran RME, Triase IGD, atau Backpropagation AI). Tuliskan atau rekam apa yang saat ini sudah Anda pahami dengan bahasa lugas Anda sendiri.',
      keyTakeaways: [
        'Tersedia Starter Kits & Template jika Anda tidak ingin memulai dari kanvas kosong',
        'Mendukung input teks dan perekaman suara',
        'Menjadi tolok ukur (baseline) pemahaman sebelum tutorial dirancang'
      ]
    },
    {
      step: 3,
      badge: 'Tahap 2: Evaluasi Cerdas',
      title: 'AI Knowledge Gap Detection',
      tagline: 'Temukan Apa yang Belum Anda Sadari Bahwa Anda Belum Tahu',
      icon: Sparkles,
      color: 'amber',
      description: 'Kecerdasan Buatan GamaTutor menganalisis penjelasan awal Anda secara kritis. AI tidak langsung memberikan contekan jawaban, melainkan membedah konsep mana yang masih rancu, hilang, atau dangkal—lalu memberikan pertanyaan penuntun (Socratic questions).',
      keyTakeaways: [
        'Mendeteksi missing critical steps (misal: verifikasi NIK ganda di SIMRS)',
        'Klasifikasi celah keparahan tinggi, sedang, hingga rendah',
        'Mengarahkan Anda melakukan review terarah sebelum lanjut ke animasi'
      ]
    },
    {
      step: 4,
      badge: 'Tahap 3: Sintesis Otomatis',
      title: 'AI Script-to-Animation',
      tagline: 'Dari Pemikiran Menjadi Rancangan Adegan Interaktif',
      icon: Clapperboard,
      color: 'cyan',
      description: 'Setelah celah pengetahuan diperbaiki, fitur AI Script-to-Animation mengubah penjelasan Anda menjadi draf storyboard animasi langkah-demi-langkah: membagi adegan, menetapkan narasi audio, posisi callout, dan target aksi interaktif.',
      keyTakeaways: [
        'Menghasilkan struktur adegan siap pakai (Scenes)',
        'Pemilihan backdrop otomatis (SIMRS Khanza, Triase, Farmasi, Lab LIMS, Flowchart)',
        'Draf ini adalah titik awal yang bebas Anda ubah dan kembangkan'
      ]
    },
    {
      step: 5,
      badge: 'Tahap 4: Studio Produksi',
      title: 'Gama Animation Studio (GAE Editor & Player)',
      tagline: 'Atur Hotspot Interaktif, Narasi, dan Callout Balon Bicara',
      icon: Sliders,
      color: 'teal',
      description: 'Buka editor visual GAE untuk menyempurnakan tutorial Anda. Anda dapat menggeser posisi hotspot pulsing, mengatur arah kursor, memilih mode "Coba Sendiri (Try-It Mode)", hingga menambahkan kuis interaktif di setiap langkah.',
      keyTakeaways: [
        'Simulasi antarmuka klinis nyata (RME Rumah Sakit)',
        'Pengaturan durasi tiap langkah dan kecepatan pemutaran (0.5x - 2x)',
        'Pratinjau langsung dengan narasi suara otomatis'
      ]
    },
    {
      step: 6,
      badge: 'Tahap 5: Penguasaan & Komunitas',
      title: 'Teach-Back Check & Community Hub',
      tagline: 'Buktikan Penguasaan & Dapatkan Umpan Balik Rekan Sebaya',
      icon: CheckCircle2,
      color: 'emerald',
      description: 'Di akhir proses, Anda diminta mengajarkan kembali topik tersebut dari memori tanpa membaca naskah. GamaTutor membandingkan skor sebelum dan sesudah untuk mengukur lonjakan pemahaman Anda, kemudian mempublikasikannya ke Community Hub untuk dinilai rekan pembelajar.',
      keyTakeaways: [
        'Verifikasi penguasaan konsep nyata (+25% hingga +40% retention jump)',
        'Peer Feedback terstruktur: Apa yang jelas vs Apa yang membingungkan',
        'Koleksi XP, lencana (badges), dan pertahankan streak belajar Anda!'
      ]
    }
  ];

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-100 text-teal-700">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                GamaTutor Quick Start Walkthrough
              </h3>
              <p className="text-xs text-slate-500">
                Langkah {currentSlide + 1} dari {slides.length}: {current.badge}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-teal-600 h-1.5 transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-xs">
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100/70 text-teal-800 mb-1">
                {current.badge}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {current.title}
              </h2>
              <p className="text-xs font-semibold text-teal-700 mt-0.5">
                {current.tagline}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {current.description}
          </p>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Poin Kunci &amp; Cara Kerjanya:
            </h4>
            <ul className="space-y-2">
              {current.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentSlide === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-200 bg-white border border-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-teal-600' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onBrowseTemplates();
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
              >
                Pilih Template
              </button>
              <button
                onClick={() => {
                  onClose();
                  onStartTeaching();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
              >
                Mulai TeachBack
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
