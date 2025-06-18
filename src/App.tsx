import React, { useState } from 'react';
import { useEffect } from 'react';
import { SurveyWizard } from './components/SurveyWizard';
import { Dashboard } from './components/Dashboard';
import { SharedView } from './components/SharedView';
import { getShareDataFromUrl } from './utils/shareUtils';

type AppState = 'dashboard' | 'survey' | 'shared';

function App() {
  const [currentView, setCurrentView] = useState<AppState>('dashboard');
  const [sharedData, setSharedData] = useState(null);

  useEffect(() => {
    const shareData = getShareDataFromUrl();
    if (shareData) {
      setSharedData(shareData);
      setCurrentView('shared');
    }
  }, []);

  const handleStartSurvey = () => {
    setCurrentView('survey');
  };

  const handleSurveyComplete = () => {
    setCurrentView('dashboard');
  };

  const handleViewFullDashboard = () => {
    // Remove share parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url.toString());
    
    setCurrentView('dashboard');
    setSharedData(null);
  };

  const handleStartSurveyFromShared = () => {
    // Remove share parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url.toString());
    
    setCurrentView('survey');
    setSharedData(null);
  };

  return (
    <div className="App">
      {currentView === 'shared' && sharedData ? (
        <SharedView 
          shareData={sharedData} 
          onViewFullDashboard={handleViewFullDashboard}
          onStartSurvey={handleStartSurveyFromShared}
        />
      ) : currentView === 'dashboard' ? (
        <Dashboard onStartSurvey={handleStartSurvey} />
      ) : (
        <SurveyWizard onComplete={handleSurveyComplete} />
      )}
    </div>
  );
}

export default App;