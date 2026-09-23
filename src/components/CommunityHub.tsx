import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Play, 
  MessageSquare, 
  Heart, 
  Eye, 
  Sparkles, 
  Trophy, 
  ArrowUpRight, 
  Share2, 
  Users, 
  CheckCircle2, 
  Star, 
  ThumbsUp, 
  CornerDownRight, 
  Plus,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { Tutorial, PeerFeedback, UserProfile } from '../types/gamatutor';
import { GamaAnimationPlayer } from './GamaAnimationPlayer';
import { PeerFeedbackModal } from './PeerFeedbackModal';

interface CommunityHubProps {
  tutorials: Tutorial[];
  feedbacks: PeerFeedback[];
  userProfile: UserProfile;
  onAddFeedback: (feedback: PeerFeedback) => void;
  onStartTeaching: () => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({
  tutorials,
  feedbacks,
  userProfile,
  onAddFeedback,
  onStartTeaching
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeTutorialForPlayer, setActiveTutorialForPlayer] = useState<Tutorial | null>(null);
  const [activeTutorialForFeedback, setActiveTutorialForFeedback] = useState<Tutorial | null>(null);
  const [expandedFeedbackTutId, setExpandedFeedbackTutId] = useState<string | null>(null);
  const [likedTutorialIds, setLikedTutorialIds] = useState<Record<string, boolean>>({});

  const categories = [
    'Semua',
    'Rekam Medis Elektronik',
    'Kedokteran & Farmasi',
    'Sains Data & AI',
    'Logika Pemrograman'
  ];

  // Filter tutorials
  const filteredTutorials = tutorials.filter(tut => {
    const matchesSearch = 
      tut.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tut.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tut.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'Semua' || tut.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleLike = (id: string) => {
    setLikedTutorialIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Community Hero Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Siklus Belajar Antar Rekan (Peer Learning Loop)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Community Animation Hub
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Eksplorasi tutorial animasi interaktif yang dibuat oleh sesama pembelajar.
            <br />
            <strong>Siklus Kolaboratif:</strong> User A Belajar ➔ User A Mengajar ➔ User A Membuat Tutorial ➔ User B Belajar &amp; Memberi Umpan Balik.
          </p>
        </div>

        <button
          onClick={onStartTeaching}
          className="shrink-0 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-102"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buat Tutorial TeachBack Anda</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari tutorial, RME, topik, atau pembuat..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border-2 border-slate-300 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 bg-white font-medium text-slate-900 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900 border border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTutorials.map(tut => {
          const isLiked = likedTutorialIds[tut.id];
          const tutFeedbacks = feedbacks.filter(f => f.tutorialId === tut.id);
          const hasExpandedFeedback = expandedFeedbackTutId === tut.id;

          return (
            <div
              key={tut.id}
              className="bg-white rounded-3xl border-2 border-slate-300 shadow-sm hover:border-teal-600 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Card Top Header */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-teal-800 text-teal-100 border border-teal-700">
                      {tut.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {tut.createdAt}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 line-clamp-2 hover:text-teal-700 transition-colors">
                    {tut.title}
                  </h3>
                  <p className="text-xs text-slate-700 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                    {tut.description}
                  </p>

                  {/* TeachBack Mastery Jump Badge */}
                  {tut.teachBackScores && (
                    <div className="mt-3.5 p-2.5 rounded-xl bg-teal-50 border border-teal-300 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-teal-950 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                        <span>Lonjakan Penguasaan:</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-slate-500 font-semibold">{tut.teachBackScores.before}%</span>
                        <span className="text-slate-400">➔</span>
                        <span className="font-extrabold text-teal-950">{tut.teachBackScores.after}%</span>
                        <span className="text-emerald-800 font-black bg-emerald-200 px-2 py-0.5 rounded-md border border-emerald-300">
                          +{tut.teachBackScores.delta}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Author Info */}
                <div className="px-5 py-3 bg-slate-100/90 border-y border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={tut.author.avatar}
                      alt={tut.author.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-teal-600 shadow-2xs"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block text-xs leading-tight">
                        {tut.author.name}
                      </span>
                      <span className="text-[10px] text-slate-600 font-semibold">
                        {tut.author.role} • {tut.author.badge}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    {tut.scenes.length} Langkah Adegan
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {tut.views}
                    </span>
                    <button
                      onClick={() => toggleLike(tut.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiked ? 'text-red-500 font-bold' : 'hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
                      {tut.likes + (isLiked ? 1 : 0)}
                    </button>
                    <button
                      onClick={() => setExpandedFeedbackTutId(hasExpandedFeedback ? null : tut.id)}
                      className="flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {tutFeedbacks.length} Feedback
                    </button>
                  </div>

                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                    {tut.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTutorialForPlayer(tut)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Putar Interaktif</span>
                  </button>

                  <button
                    onClick={() => setActiveTutorialForFeedback(tut)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                    <span>Beri Feedback</span>
                  </button>
                </div>

                {/* Expanded Peer Feedback Drawer */}
                {hasExpandedFeedback && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                        Umpan Balik Rekan Pembelajar ({tutFeedbacks.length})
                      </h5>
                      <button
                        onClick={() => setActiveTutorialForFeedback(tut)}
                        className="text-[11px] font-bold text-teal-700 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Tulis Feedback
                      </button>
                    </div>

                    {tutFeedbacks.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        Belum ada umpan balik untuk tutorial ini. Jadilah yang pertama memberikan feedback konstruktif!
                      </p>
                    ) : (
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {tutFeedbacks.map(fb => (
                          <div key={fb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={fb.authorAvatar}
                                  alt={fb.authorName}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span className="font-bold text-slate-800">{fb.authorName}</span>
                                <span className="text-[10px] text-slate-400">({fb.authorRole})</span>
                              </div>
                              <div className="flex items-center text-amber-500">
                                {[...Array(fb.clarityRating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-700">
                              <strong className="text-teal-800">Mudah dipahami:</strong> {fb.easyToUnderstandPart}
                            </p>
                            <p className="text-[11px] text-slate-600">
                              <strong className="text-amber-800">Saran/Celah:</strong> {fb.confusingOrMissingPart}
                            </p>

                            {fb.creatorReplied && fb.creatorReplyText && (
                              <div className="mt-1 pl-2.5 border-l-2 border-teal-500 bg-teal-50/50 p-1.5 rounded-r-lg text-[10px] text-teal-900 flex items-start gap-1">
                                <CornerDownRight className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="font-bold">Respon Kreator:</strong> {fb.creatorReplyText}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal Player */}
      {activeTutorialForPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-sm truncate max-w-md">
                  {activeTutorialForPlayer.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTutorialForPlayer(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Tutup
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              <GamaAnimationPlayer
                steps={activeTutorialForPlayer.scenes}
                tutorialTitle={activeTutorialForPlayer.title}
                category={activeTutorialForPlayer.category}
                isInteractiveMode={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Peer Feedback Submission Modal */}
      {activeTutorialForFeedback && (
        <PeerFeedbackModal
          isOpen={true}
          onClose={() => setActiveTutorialForFeedback(null)}
          tutorial={activeTutorialForFeedback}
          onSubmitFeedback={onAddFeedback}
          currentUserName={userProfile.name}
          currentUserRole={userProfile.role}
          currentUserAvatar={userProfile.avatar}
        />
      )}
    </div>
  );
};
