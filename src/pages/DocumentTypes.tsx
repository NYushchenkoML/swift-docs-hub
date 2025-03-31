
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ClipboardList, Utensils } from 'lucide-react';
import { toast } from 'sonner';

const DocumentTypes = () => {
  const navigate = useNavigate();

  const handleInventory = () => {
    toast.info("Функция 'Инвентаризация' в разработке");
  };

  const handleWriteOff = () => {
    toast.info("Функция 'Акт списания' в разработке");
  };

  const handleProductionAct = () => {
    navigate('/production-act');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background p-4 animate-fade-in">
      <header className="py-4 mb-6">
        <h1 className="text-2xl font-medium text-center">Выбор типа документа</h1>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "0ms" }}
            onClick={handleInventory}
          >
            <ClipboardList className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Инвентаризация</span>
          </button>
          
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "50ms" }}
            onClick={handleWriteOff}
          >
            <FileText className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Акт списания</span>
          </button>
          
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "100ms" }}
            onClick={handleProductionAct}
          >
            <Utensils className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Акт приготовления</span>
          </button>
          
          <button 
            className="main-nav-btn animate-slide-up" 
            style={{ animationDelay: "150ms" }}
            onClick={handleBack}
          >
            <ArrowLeft className="w-10 h-10 text-primary" />
            <span className="text-sm font-medium">Назад</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default DocumentTypes;
