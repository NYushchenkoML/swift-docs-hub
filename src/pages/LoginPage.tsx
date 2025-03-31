
import { useState } from 'react';
import { toast } from 'sonner';
import Numpad from '../components/Numpad';
import PinInput from '../components/PinInput';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const maxPinLength = 4;
  
  const handleNumberPress = (num: number) => {
    if (pin.length < maxPinLength) {
      setPin(prev => prev + num);
    }
  };
  
  const handleClearPress = () => {
    setPin('');
  };
  
  const handleConfirmPress = async () => {
    // No need to check if pin is incomplete
    if (pin.length < maxPinLength) {
      toast.error("Введите полный ПИН-код");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate verification delay
    setTimeout(() => {
      // Here we would check against the database
      // For now, just check against the default pin
      if (pin === "0000") {
        toast.success("Авторизация успешна");
        onLoginSuccess();
      } else {
        toast.error("Неверный ПИН-код");
        setPin('');
      }
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-sm border border-border/50">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-2xl font-medium mb-2">Авторизация</h1>
          <p className="text-muted-foreground">Введите ваш ПИН-код для входа</p>
        </div>
        
        <div className="mb-8 animate-slide-up">
          <PinInput value={pin} maxLength={maxPinLength} />
        </div>
        
        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <Numpad 
            onNumberPress={handleNumberPress}
            onClearPress={handleClearPress}
            onConfirmPress={handleConfirmPress}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
