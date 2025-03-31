
import React from 'react';

interface NumpadProps {
  onNumberPress: (num: number) => void;
  onClearPress: () => void;
  onConfirmPress: () => void;
}

const Numpad: React.FC<NumpadProps> = ({ onNumberPress, onClearPress, onConfirmPress }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button
          key={num}
          className="numpad-btn"
          onClick={() => onNumberPress(num)}
          aria-label={`Number ${num}`}
        >
          {num}
        </button>
      ))}
      <button
        className="numpad-btn text-destructive"
        onClick={onClearPress}
        aria-label="Clear"
      >
        C
      </button>
      <button
        className="numpad-btn"
        onClick={() => onNumberPress(0)}
        aria-label="Number 0"
      >
        0
      </button>
      <button
        className="numpad-btn bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80"
        onClick={onConfirmPress}
        aria-label="OK"
      >
        OK
      </button>
    </div>
  );
};

export default Numpad;
