import React, { useState } from 'react';
import { 
  INITIAL_USER_PROFILE, 
  INITIAL_COMMUNITY_TUTORIALS, 
  INITIAL_PEER_FEEDBACKS, 
  INITIAL_CHALLENGES 
} from './data/mockData';
import { 
  Tutorial, 
  PeerFeedback, 
  TemplateStarterKit, 
  UserProfile 
} from './types/gamatutor';
import { GamaNavbar } from './components/GamaNavbar';
import { TeachBackWizard } from './components/TeachBackWizard';
import { CommunityHub } from './components/CommunityHub';
import { TemplatesView } from './components/TemplatesView';
import { ChallengesView } from './components/ChallengesView';
import { GamaTutorQuickStartModal } from './components/GamaTutorQuickStartModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'teachback' | 'community' | 'templates' | 'challenges'>('teachback');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [tutorials, setTutorials] = useState<Tutorial[]>(INITIAL_COMMUNITY_TUTORIALS);
  const [feedbacks, setFeedbacks] = useState<PeerFeedback[]>(INITIAL_PEER_FEEDBACKS);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStarterKit | null>(null);
  const [audioNarrationEnabled, setAudioNarrationEnabled] = useState(true);

  // When a tutorial is published from TeachBack Mode
  const handleTutorialPublished = (newTutorial: Tutorial) => {
    setTutorials(prev => [newTutorial, ...prev]);
    setCurrentTab('community');
  };

  // When a peer feedback is submitted
  const handleAddFeedback = (newFeedback: PeerFeedback) => {
    setFeedbacks(prev => [newFeedback, ...prev]);

    // Award +35 XP and update peer challenge
    setUserProfile(prev => ({
      ...prev,
      xp: prev.xp + 35,
      feedbacksGiven: prev.feedbacksGiven + 1
    }));

    setChallenges(prev => 
      prev.map(ch => {
        if (ch.id === 'ch-weekly-1') {
          const nextProg = ch.progress + 1;
          return {
            ...ch,
            progress: nextProg,
            completed: nextProg >= ch.target
          };
        }
        return ch;
      })
    );
  };

  // When user selects a starter kit from Templates
  const handleSelectTemplate = (tpl: TemplateStarterKit) => {
    setSelectedTemplate(tpl);
    setCurrentTab('teachback');
  };

  const handleStartNewTeachBack = () => {
    setSelectedTemplate(null);
    setCurrentTab('teachback');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#edf2f7] via-[#f1f5f9] to-[#e2e8f0] text-slate-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <GamaNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userProfile={userProfile}
        audioNarrationEnabled={audioNarrationEnabled}
        setAudioNarrationEnabled={setAudioNarrationEnabled}
        onOpenQuickStart={() => setIsQuickStartOpen(true)}
        onStartNewTeachBack={handleStartNewTeachBack}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'teachback' && (
          <TeachBackWizard
            key={selectedTemplate?.id || 'fresh-teachback'}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onTutorialPublished={handleTutorialPublished}
            onBrowseTemplates={() => setCurrentTab('templates')}
            initialTemplate={selectedTemplate}
          />
        )}

        {currentTab === 'community' && (
          <CommunityHub
            tutorials={tutorials}
            feedbacks={feedbacks}
            userProfile={userProfile}
            onAddFeedback={handleAddFeedback}
            onStartTeaching={handleStartNewTeachBack}
          />
        )}

        {currentTab === 'templates' && (
          <TemplatesView
            onSelectTemplate={handleSelectTemplate}
            onOpenQuickStart={() => setIsQuickStartOpen(true)}
          />
        )}

        {currentTab === 'challenges' && (
          <ChallengesView
            challenges={challenges}
            userProfile={userProfile}
            onStartTeaching={handleStartNewTeachBack}
            onExploreCommunity={() => setCurrentTab('community')}
          />
        )}
      </main>

      {/* Quick Start Walkthrough Modal */}
      <GamaTutorQuickStartModal
        isOpen={isQuickStartOpen}
        onClose={() => setIsQuickStartOpen(false)}
        onStartTeaching={() => {
          setIsQuickStartOpen(false);
          setCurrentTab('teachback');
        }}
        onBrowseTemplates={() => {
          setIsQuickStartOpen(false);
          setCurrentTab('templates');
        }}
      />

      {/* High Contrast Anchor Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm tracking-tight">GamaTutor</span>
            <span className="text-teal-400">•</span>
            <span className="text-slate-300 font-semibold">Gama Animation Engine (GAE)</span>
            <span className="text-teal-400">•</span>
            <span className="text-teal-300 font-bold">Universitas Gadjah Mada (UGM)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Metode Belajar dengan Mengajar (Learning by Teaching)</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Simulasi RME &amp; Labeling Alur</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
