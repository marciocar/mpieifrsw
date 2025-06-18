import React, { useState } from 'react';
import { SurveyWizard } from './components/SurveyWizard';
import { Dashboard } from './components/Dashboard';

type AppState = 'dashboard' | 'survey';

function App() {
  const [currentView, setCurrentView] = useState<AppState>('dashboard');

  const handleStartSurvey = () => {
    setCurrentView('survey');
  };

  const handleSurveyComplete = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="App">
      {currentView === 'dashboard' ? (
        <Dashboard onStartSurvey={handleStartSurvey} />
      ) : (
        <SurveyWizard onComplete={handleSurveyComplete} />
      )}
    </div>
  );
}

export default App;