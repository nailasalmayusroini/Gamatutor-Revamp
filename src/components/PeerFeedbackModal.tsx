import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ThumbsUp,
  HelpCircle,
  Award
} from 'lucide-react';
import { PeerFeedback, Tutorial } from '../types/gamatutor';

interface PeerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial;
  onSubmitFeedback: (feedback: PeerFeedback) => void;
  currentUserName: string;
  currentUserRole: string;
  currentUserAvatar: string;
}

export const PeerFeedbackModal: React.FC<PeerFeedbackModalProps> = ({
  isOpen,
  onClose,
  tutorial,
  onSubmitFeedback,
  currentUserName,
  currentUserRole,
  currentUserAvatar
}) => {
  const [rating, setRating] = useState<number>(5);
  const [easyPart, setEasyPart] = useState('');
  const [confusingPart, setConfusingPart] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!easyPart.trim()) return;

    const newFeedback: PeerFeedback = {
      id: `fb-${Date.now()}`,
      tutorialId: tutorial.id,
      tutorialTitle: tutorial.title,
      authorName: currentUserName,
      authorRole: currentUserRole,
      authorAvatar: currentUserAvatar,
      clarityRating: rating,
      easyToUnderstandPart: easyPart,
      confusingOrMissingPart: confusingPart || 'Penjelasan sudah cukup lengkap dan sistematis.',
      suggestion: suggestion || 'Pertahankan gaya animasi interaktifnya!',
      timestamp: 'Baru saja',
      helpfulVotes: 0,
      creatorReplied: false
    };

    onSubmitFeedback(newFeedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Beri Umpan Balik Rekan (Peer Feedback)
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">
                Untuk: {tutorial.title}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200/80 text-xs text-teal-900 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              Umpan balik yang spesifik membantu kreator mengenali apakah penjelasannya benar-benar dipahami oleh orang lain. Anda akan mendapatkan <strong>+35 XP</strong> setelah mengirimkan ulasan!
            </span>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tingkat Kejelasan Tutorial (1 - 5 Bintang):
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="p-1 transition-transform hover:scale-115 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoveredStar !== null ? star <= hoveredStar : star <= rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-slate-600 ml-2">
                {rating === 5 ? 'Sangat Jelas & Runtut' : rating === 4 ? 'Jelas' : rating === 3 ? 'Cukup' : 'Kurang Jelas'}
              </span>
            </div>
          </div>

          {/* What was clear */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bagian yang Paling Mudah Dipahami:
            </label>
            <textarea
              rows={2}
              required
              value={easyPart}
              onChange={e => setEasyPart(e.target.value)}
              placeholder="Contoh: Penjelasan tahapan verifikasi NIK dan tombol bridging BPJS sangat runtut dan gamblang..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* What was confusing */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bagian yang Masih Membingungkan / Perlu Penjelasan Tambahan:
            </label>
            <textarea
              rows={2}
              value={confusingPart}
              onChange={e => setConfusingPart(e.target.value)}
              placeholder="Contoh: Bagian jika pasien tidak membawa KTP masih agak cepat penjelasannya..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Saran Perbaikan untuk Kreator:
            </label>
            <textarea
              rows={2}
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              placeholder="Contoh: Bisa ditambahkan durasi 2 detik pada langkah kedua agar pembelajar sempat mencatat..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold">
              <Award className="w-4 h-4 text-amber-500" />
              <span>+35 XP Reward</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Feedback
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
