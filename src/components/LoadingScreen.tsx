
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [loadingSteps, setLoadingSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Simulating initialization steps
  useEffect(() => {
    const steps = [
      "Инициализация приложения...",
      "Проверка базы данных...",
      "Загрузка компонентов...",
      "Настройка интерфейса...",
      "Подготовка завершена"
    ];
    
    setLoadingSteps(steps);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Wait a moment before completing
          setTimeout(() => {
            onLoadComplete();
          }, 1000);
          return prev;
        }
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, [onLoadComplete]);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 animate-fade-in">
      <div className="w-full max-w-md px-8 py-12">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
            <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
            <div className="w-3 h-3 rounded-full bg-primary loading-dot"></div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-sm border border-border/50">
          <h1 className="text-2xl font-medium text-center mb-6">Загрузка</h1>
          
          <div className="space-y-4">
            {loadingSteps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 transition-opacity duration-300 ${
                  index <= currentStep ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center 
                  ${index < currentStep 
                    ? 'bg-primary/10 text-primary' 
                    : index === currentStep 
                      ? 'bg-primary/10 text-primary animate-pulse' 
                      : 'bg-muted'
                  }`}
                >
                  {index < currentStep && (
                    <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
