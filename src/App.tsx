  import { useState, useEffect } from "react";
  import { Toaster } from "@/components/ui/toaster";
  import { Toaster as Sonner } from "@/components/ui/sonner";
  import { TooltipProvider } from "@/components/ui/tooltip";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { Routes, Route, Navigate } from "react-router-dom";
  import Index from "./pages/Index";
  import NotFound from "./pages/NotFound";
  import DocumentTypes from "./pages/DocumentTypes";
  import ProductionAct from "./pages/ProductionAct";
  import Documents from "./pages/Documents";
  import DocumentDetail from "./pages/DocumentDetail";
  import Forecast from "./pages/Forecast";
  import { electronService } from "./services/electronService";
  import React from "react";
  import SettingPage from './pages/SettingPage';
  // Добавляем импорт UpdateNotification
  import UpdateNotification from './components/UpdateNotification';

  interface PlatformContextType {
    platform: 'electron' | 'capacitor' | 'web';
    isElectron: boolean;
    isCapacitor: boolean;
    isWeb: boolean;
  }

  export const PlatformContext = React.createContext<PlatformContextType>({
    platform: 'web',
    isElectron: false,
    isCapacitor: false,
    isWeb: true
  });

  const queryClient = new QueryClient();

  const App = () => {
    const [platformInfo, setPlatformInfo] = useState<PlatformContextType>({
      platform: 'web',
      isElectron: false,
      isCapacitor: false,
      isWeb: true
    });

    useEffect(() => {
      // Detect platform on component mount
      const platform = electronService.getPlatform(); // Используйте функцию из объекта
      setPlatformInfo({
        platform: platform as 'electron' | 'capacitor' | 'web',
        isElectron: platform === 'electron',
        isCapacitor: platform === 'capacitor',
        isWeb: platform === 'web'
      });
    }, []);

    return (
      <PlatformContext.Provider value={platformInfo}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-center" />
          
            {/* Добавляем компонент уведомления об обновлениях */}
            <UpdateNotification />
          
            {/* Добавляем маршрутизацию */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/document-types" element={<DocumentTypes />} />
              <Route path="/production-act" element={<ProductionAct />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/:id" element={<DocumentDetail />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/settings" element={<SettingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>          
            <style>
              {`
              .numpad-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                font-size: 1.25rem;
                border-radius: 0.375rem;
                background-color: hsl(var(--secondary));
                color: hsl(var(--secondary-foreground));
                transition: all 0.2s;
                touch-action: manipulation;
              }
            
              .numpad-btn:hover {
                background-color: hsl(var(--secondary) / 0.8);
              }
            
              .numpad-btn:active {
                transform: scale(0.98);
              }
            
              .main-nav-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                padding: 1.5rem;
                border-radius: 0.5rem;
                background-color: hsl(var(--card));
                border: 1px solid hsl(var(--border));
                transition: all 0.2s;
                touch-action: manipulation;
              }
            
              .main-nav-btn:hover, .main-nav-btn:focus {
                background-color: hsl(var(--accent));
                border-color: hsl(var(--accent-foreground) / 0.2);
              }
            
              .main-nav-btn:active {
                transform: scale(0.98);
              }
            
              .animate-fade-in {
                animation: fadeIn 0.5s ease-out;
              }
            
              .animate-slide-up {
                animation: slideUp 0.5s ease-out forwards;
                opacity: 0;
                transform: translateY(20px);
              }
            
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            
              @keyframes slideUp {
                from { 
                  opacity: 0;
                  transform: translateY(20px);
                }
                to { 
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            
              /* Touch-friendly styles for mobile devices */
              @media (max-width: 768px) {
                .numpad-btn {
                  padding: 1.5rem;
                  font-size: 1.5rem;
                }
              
                button, 
                [role="button"] {
                  min-height: 44px;
                  min-width: 44px;
                }
              
                input, 
                select {
                  font-size: 16px; /* Prevents zoom on iOS */
                }
              }
              `}
            </style>
          </TooltipProvider>
        </QueryClientProvider>
      </PlatformContext.Provider>
    );
  };

  export default App;
