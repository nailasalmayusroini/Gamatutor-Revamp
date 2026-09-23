import React from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  CheckCircle2, 
  Zap, 
  ShieldAlert, 
  MessageSquareText, 
  Sparkles, 
  GraduationCap, 
  Star, 
  TrendingUp, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { LearningChallenge, UserProfile } from '../types/gamatutor';

interface ChallengesViewProps {
  challenges: LearningChallenge[];
  userProfile: UserProfile;
  onStartTeaching: () => void;
  onExploreCommunity: () => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  userProfile,
  onStartTeaching,
  onExploreCommunity
}) => {
  const getChallengeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'ShieldAlert': return ShieldAlert;
      case 'MessageSquareText': return MessageSquareText;
      case 'Award': return Award;
      default: return Trophy;
    }
  };

  const nextLevelXP = 1200;
  const levelProgress = Math.min(100, Math.round((userProfile.xp / nextLevelXP) * 100));

  const allBadges = [
    {
      id: 'badge-gae-pioneer',
      title: 'UGM GAE Pioneer',
      description: 'Menyelesaikan tutorial pertama berbasis Gama Animation Engine.',
      unlocked: true,
      date: '12 Sep 2026',
      icon: GraduationCap
    },
    {
      id: 'badge-feynman-disciple',
      title: 'Feynman Disciple',
      description: 'Mencapai peningkatan pemahaman > 25% pada Teach-Back Check.',
      unlocked: true,
      date: '18 Sep 2026',
      icon: Sparkles
    },
    {
      id: 'badge-rme-specialist',
      title: 'RME Workflow Master',
      description: 'Merancang simulasi alur rekam medis elektronik rumah sakit secara presisi.',
      unlocked: true,
      date: '21 Sep 2026',
      icon: Award
    },
    {
      id: 'badge-peer-mentor',
      title: 'Peer Review Mentor',
      description: 'Memberikan 10 ulasan konstruktif pada tutorial rekan pembelajar.',
      unlocked: false,
      date: 'Terkunci (7/10 Ulasan)',
      icon: MessageSquareText
    },
    {
      id: 'badge-streak-legend',
      title: '7-Day Teaching Flame',
      description: 'Mempertahankan streak mengajar 7 hari berturut-turut.',
      unlocked: false,
      date: 'Terkunci (6/7 Hari)',
      icon: Flame
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Gamification Profile Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{userProfile.name}</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40">
                  Level {userProfile.level}
                </span>
              </div>
              <p className="text-xs text-teal-200">{userProfile.levelTitle} • {userProfile.institution}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-teal-950/60 p-3 rounded-2xl border border-teal-800">
            <div className="text-center px-2">
              <span className="text-[10px] text-teal-300 uppercase font-bold block">Streak Belajar</span>
              <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-lg">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{userProfile.streakDays} Hari</span>
              </div>
            </div>
            <div className="text-center px-2 border-l border-teal-800">
              <span className="text-[10px] text-teal-300 uppercase font-bold block">Total XP</span>
              <div className="text-teal-300 font-extrabold text-lg">
                {userProfile.xp} XP
              </div>
            </div>
            <div className="text-center px-2 border-l border-teal-800">
              <span className="text-[10px] text-teal-300 uppercase font-bold block">Tutorial Dibuat</span>
              <div className="text-white font-extrabold text-lg">
                {userProfile.tutorialsCreated}
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-5 border-t border-teal-800">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-teal-200">
            <span>Kemajuan Level {userProfile.level} ➔ Level {userProfile.level + 1} (Gama Master Tutor)</span>
            <span className="font-mono">{userProfile.xp} / {nextLevelXP} XP ({levelProgress}%)</span>
          </div>
          <div className="w-full bg-teal-950 h-2.5 rounded-full overflow-hidden border border-teal-800">
            <div
              className="bg-gradient-to-r from-teal-500 to-amber-400 h-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Challenges & Badges Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Learning Challenges */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Tantangan Belajar Aktif (Learning Challenges)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Rutin Mengajar = Penguasaan Mendalam
            </span>
          </div>

          <div className="space-y-3">
            {challenges.map(ch => {
              const Icon = getChallengeIcon(ch.iconName);
              const isDone = ch.completed || ch.progress >= ch.target;
              const progressPct = Math.min(100, Math.round((ch.progress / ch.target) * 100));

              return (
                <div
                  key={ch.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isDone 
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs' 
                      : 'bg-white border-slate-300 shadow-xs hover:border-teal-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-emerald-200 text-emerald-800' : 'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {ch.title}
                          </h4>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                            ch.type === 'daily'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : ch.type === 'weekly'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {ch.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                          {ch.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-black text-amber-900 shrink-0 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-xl shadow-2xs">
                      +{ch.xpReward} XP
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <div className="w-2/3 bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                      <div
                        className={`h-full ${isDone ? 'bg-emerald-600' : 'bg-teal-600'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {ch.progress} / {ch.target} ({isDone ? 'Selesai' : `${progressPct}%`})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-teal-100/70 rounded-2xl border-2 border-teal-300 flex items-center justify-between text-xs">
            <span className="text-teal-950 font-bold">
              Selesaikan tantangan dengan membuat tutorial baru atau memberikan umpan balik pada rekan.
            </span>
            <button
              onClick={onStartTeaching}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold shrink-0 ml-2 shadow-xs transition-colors"
            >
              Mulai TeachBack
            </button>
          </div>
        </div>

        {/* Right: Badges Showcase & Feynman Principle */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            Lencana Prestasi (Badges)
          </h3>

          <div className="bg-white rounded-2xl p-4 border-2 border-slate-300 shadow-xs space-y-3">
            {allBadges.map(badge => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-colors ${
                    badge.unlocked
                      ? 'bg-teal-50 border-teal-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.unlocked ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {badge.unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-xs text-slate-900">{badge.title}</h5>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{badge.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug mt-0.5 font-medium">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Philosophy Card */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 p-5 rounded-2xl text-white space-y-2 shadow-md">
            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
              Prinsip Pedagogis GamaTutor
            </span>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              "Jika Anda tidak dapat menjelaskannya dengan sederhana, Anda belum memahaminya dengan cukup baik."
            </p>
            <span className="text-[11px] text-teal-400 font-bold block text-right">
              — Richard Feynman
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
