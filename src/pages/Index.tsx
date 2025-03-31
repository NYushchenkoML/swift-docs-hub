  import { useState, useEffect } from "react";
  import LoadingScreen from "../components/LoadingScreen";
  import LoginPage from "./LoginPage";
  import MainPage from "./MainPage";
  import { electronService } from "../services/electronService"; // Добавьте этот импорт


  enum AppState {
    LOADING,
    LOGIN,
    MAIN
  }

  const Index = () => {
    // Инициализируем состояние из localStorage, если оно есть
    const [appState, setAppState] = useState<AppState>(() => {
      const savedState = localStorage.getItem('appState');
      return savedState ? parseInt(savedState) : AppState.LOADING;
    });

    // Сохраняем состояние при его изменении
    useEffect(() => {
      localStorage.setItem('appState', appState.toString());
    }, [appState]);

    const handleLoadComplete = () => {
      setAppState(AppState.LOGIN);
    };

    const handleLoginSuccess = () => {
      setAppState(AppState.MAIN);
    };

    const handleLogout = async () => {
      // Проверяем, запущены ли мы в Electron
      if (electronService.isElectron && electronService.electronAPI?.quitApp) {
        // Если да, вызываем метод для выхода из приложения
        await electronService.electronAPI.quitApp();
      } else {
        // Если нет (например, в веб-версии), просто переходим на экран логина
        setAppState(AppState.LOGIN);
      }
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
