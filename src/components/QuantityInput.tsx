import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item } from '@/services/itemsService';
import Numpad from '@/components/Numpad';

interface QuantityInputProps {
  isOpen: boolean;
  item: Item | null;
  onClose: () => void;
  onConfirm: (item: Item, quantity: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({ 
  isOpen, 
  item, 
  onClose, 
  onConfirm 
}) => {
  const [quantity, setQuantity] = useState<string>('1');
  const [useNumpad, setUseNumpad] = useState<boolean>(false);
  
  useEffect(() => {
    if (isOpen) {
      setQuantity('1');
    }
  }, [isOpen, item]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (item) {
      const parsedQuantity = parseFloat(quantity);
      if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
        onConfirm(item, parsedQuantity);
        setQuantity('1');
      }
    }
  };
  
  const handleNumberPress = (num: number) => {
    setQuantity(prev => {
      if (prev === '0' || prev === '') {
        return num.toString();
      }
      return prev + num.toString();
    });
  };
  
  const handleClearPress = () => {
    setQuantity('');
  };
  
  const handleConfirmPress = () => {
    if (item) {
      const parsedQuantity = parseFloat(quantity);
      if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
        onConfirm(item, parsedQuantity);
      }
    }
  };

  const toggleNumpad = () => {
    setUseNumpad(!useNumpad);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Укажите количество</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">
                {item?.name}
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full"
                  autoFocus
                />
                <Button type="button" variant="outline" onClick={toggleNumpad}>
                  {useNumpad ? "Скрыть" : "Клавиатура"}
                </Button>
              </div>
              
              {useNumpad && (
                <div className="mt-4">
                  <Numpad 
                    onNumberPress={handleNumberPress}
                    onClearPress={handleClearPress}
                    onConfirmPress={handleConfirmPress}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">
              Добавить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuantityInput;
