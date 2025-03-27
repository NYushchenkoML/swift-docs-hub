
import React from 'react';

interface PinInputProps {
  value: string;
  maxLength?: number;
}

const PinInput: React.FC<PinInputProps> = ({ value, maxLength = 4 }) => {
  const digits = value.split('');
  const filledDigits = digits.length;
  const emptyDigits = Math.max(0, maxLength - filledDigits);
  
  return (
    <div className="flex justify-center space-x-3">
      {digits.map((digit, index) => (
        <div 
          key={`filled-${index}`} 
          className="pin-digit w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center"
        >
          <div className="w-3 h-3 rounded-full bg-primary"></div>
        </div>
      ))}
      
      {Array(emptyDigits).fill(0).map((_, index) => (
        <div 
          key={`empty-${index}`} 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary border-2 border-border flex items-center justify-center"
        />
      ))}
    </div>
  );
};

export default PinInput;
