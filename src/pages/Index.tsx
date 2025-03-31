
import { useState, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";

enum AppState {
  LOADING,
  LOGIN,
  MAIN
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);

  const handleLoadComplete = () => {
    setAppState(AppState.LOGIN);
  };

  const handleLoginSuccess = () => {
    setAppState(AppState.MAIN);
  };

  const handleLogout = () => {
    setAppState(AppState.LOGIN);
  };

  const handleLock = () => {
    setAppState(AppState.LOGIN);
  };

  // Render the appropriate screen based on app state
  const renderScreen = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingScreen onLoadComplete={handleLoadComplete} />;
      case AppState.LOGIN:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case AppState.MAIN:
        return <MainPage onLogout={handleLogout} onLock={handleLock} />;
      default:
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
    </div>
  );
};

export default Index;
