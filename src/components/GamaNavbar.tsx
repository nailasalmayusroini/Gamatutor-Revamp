import React from 'react';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  Users, 
  LayoutTemplate, 
  Trophy, 
  HelpCircle, 
  PlusCircle, 
  Volume2, 
  VolumeX,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types/gamatutor';

interface GamaNavbarProps {
  currentTab: 'teachback' | 'community' | 'templates' | 'challenges';
  setCurrentTab: (tab: 'teachback' | 'community' | 'templates' | 'challenges') => void;
  userProfile: UserProfile;
  audioNarrationEnabled: boolean;
  setAudioNarrationEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  onOpenQuickStart: () => void;
  onStartNewTeachBack: () => void;
}

export const GamaNavbar: React.FC<GamaNavbarProps> = ({
  currentTab,
  setCurrentTab,
  userProfile,
  audioNarrationEnabled,
  setAudioNarrationEnabled,
  onOpenQuickStart,
  onStartNewTeachBack
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Heritage */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('teachback')} 
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-teal-700 bg-clip-text text-transparent">
                    GamaTutor
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    GAE
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-tight">
                  Gama Animation Engine • UGM
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links with High Contrast */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-200/90 p-1.5 rounded-xl border border-slate-300">
            <button
              onClick={() => setCurrentTab('teachback')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentTab === 'teachback'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/20'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${currentTab === 'teachback' ? 'text-teal-200' : 'text-teal-700'}`} />
              <span>TeachBack Mode</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                currentTab === 'teachback' ? 'bg-teal-800 text-teal-100 border border-teal-600' : 'bg-teal-100 text-teal-900 border border-teal-300'
              }`}>
                Inti
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('community')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentTab === 'community'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/20'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              <Users className={`w-4 h-4 ${currentTab === 'community' ? 'text-teal-200' : 'text-slate-600'}`} />
              <span>Community Hub</span>
            </button>

            <button
              onClick={() => setCurrentTab('templates')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentTab === 'templates'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/20'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              <LayoutTemplate className={`w-4 h-4 ${currentTab === 'templates' ? 'text-teal-200' : 'text-slate-600'}`} />
              <span>Templates &amp; Kits</span>
            </button>

            <button
              onClick={() => setCurrentTab('challenges')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentTab === 'challenges'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/20'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              <Trophy className={`w-4 h-4 ${currentTab === 'challenges' ? 'text-amber-300' : 'text-amber-600'}`} />
              <span>Tantangan &amp; XP</span>
            </button>
          </nav>

          {/* User Status, Audio Toggle, Quick Start & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Start Tour Button */}
            <button
              onClick={onOpenQuickStart}
              title="Panduan Cepat GamaTutor"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Quick Start</span>
            </button>

            {/* Audio Voiceover Toggle */}
            <button
              onClick={() => setAudioNarrationEnabled(prev => !prev)}
              title={audioNarrationEnabled ? 'Suara Narasi Aktif' : 'Suara Narasi Dinonaktifkan'}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                audioNarrationEnabled
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {audioNarrationEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* XP & Streak Pills with Rich Contrast */}
            <div className="hidden lg:flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs">
              <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200" title="Streak Belajar Aktif">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{userProfile.streakDays} Hari</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200" title="Experience Points">
                <Trophy className="w-3.5 h-3.5 text-teal-600" />
                <span>{userProfile.xp} XP</span>
              </div>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-teal-500 shadow-xs"
              />
            </div>

            {/* Start TeachBack Action */}
            <button
              onClick={onStartNewTeachBack}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Mulai Mengajar</span>
              <span className="sm:hidden">Baru</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100">
          <button
            onClick={() => setCurrentTab('teachback')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-bold ${
              currentTab === 'teachback' ? 'text-teal-700' : 'text-slate-500'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>TeachBack</span>
          </button>
          <button
            onClick={() => setCurrentTab('community')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-bold ${
              currentTab === 'community' ? 'text-teal-700' : 'text-slate-500'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community</span>
          </button>
          <button
            onClick={() => setCurrentTab('templates')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-bold ${
              currentTab === 'templates' ? 'text-teal-700' : 'text-slate-500'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>Templates</span>
          </button>
          <button
            onClick={() => setCurrentTab('challenges')}
            className={`flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-bold ${
              currentTab === 'challenges' ? 'text-teal-700' : 'text-slate-500'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tantangan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
