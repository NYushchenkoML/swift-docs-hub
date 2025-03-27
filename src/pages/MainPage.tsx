
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BarChart2, Sliders, Lock, LogOut, Files } from 'lucide-react';
import { toast } from 'sonner';

interface MainPageProps {
  onLogout: () => void;
  onLock: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout, onLock }) => {
  const navigate = useNavigate();
  
  const handleNewDocument = () => {
    navigate('/document-types');
  };

  const handleDocuments = () => {
    navigate('/documents');
  };

  const handleForecast = () => {
    navigate('/forecast');
  };

  const handleCalibration = () => {
    toast.info("Функция 'Калибровка' в разработке");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background p-4 animate-fade-in">
      <header className="py-4 mb-6">
        <h1 className="text-2xl font-medium text-center">Главная</h1>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "0ms" }}
            onClick={handleNewDocument}
          >
            <FileText className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Новый документ</span>
          </button>
          
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "50ms" }}
            onClick={handleDocuments}
          >
            <Files className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Документы</span>
          </button>
          
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "100ms" }}
            onClick={handleForecast}
          >
            <BarChart2 className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Прогноз</span>
          </button>
          
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "150ms" }}
            onClick={handleCalibration}
          >
            <Sliders className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Калибровка</span>
          </button>
          
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "200ms" }}
            onClick={onLock}
          >
            <Lock className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Заблокировать</span>
          </button>
          
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "250ms" }}
            onClick={onLogout}
          >
            <LogOut className="w-10 h-10 text-destructive" />
            <span className="text-sm font-medium">Выход</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
