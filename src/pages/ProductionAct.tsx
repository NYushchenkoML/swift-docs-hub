
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Printer } from 'lucide-react';
import { getCategories, getItemsByCategory, Item, SelectedItem } from '@/services/itemsService';
import { saveDocument, sendToPrinter } from '@/services/documentsService';
import QuantityInput from '@/components/QuantityInput';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { toast } from 'sonner';

const ProductionAct = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryItems, setCategoryItems] = useState<Item[]>([]);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  useEffect(() => {
    const fetchedCategories = getCategories();
    setCategories(fetchedCategories);
    if (fetchedCategories.length > 0) {
      setSelectedCategory(fetchedCategories[0]);
    }

    // Check if we have forecast items in localStorage
    const forecastItemsStr = localStorage.getItem('forecastItems');
    if (forecastItemsStr) {
      try {
        const forecastItems = JSON.parse(forecastItemsStr);
        if (Array.isArray(forecastItems) && forecastItems.length > 0) {
          setSelectedItems(forecastItems);
          // Clear localStorage after use
          localStorage.removeItem('forecastItems');
          toast.info(`Загружено ${forecastItems.length} позиций из прогноза`);
        }
      } catch (error) {
        console.error("Failed to parse forecast items:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const items = getItemsByCategory(selectedCategory);
      setCategoryItems(items);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setQuantityDialogOpen(true);
  };

  const handleQuantityConfirm = (item: Item, quantity: number) => {
    setQuantityDialogOpen(false);
    
    // Check if item already exists in selected items
    const existingItemIndex = selectedItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity = quantity;
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      setSelectedItems([...selectedItems, { ...item, quantity }]);
    }
  };

  const handleBackClick = () => {
    if (selectedItems.length > 0) {
      setConfirmationDialogOpen(true);
    } else {
      navigate('/document-types');
    }
  };

  const handleConfirmBack = () => {
    setConfirmationDialogOpen(false);
    navigate('/document-types');
  };

  const handleSaveAndPrint = () => {
    if (selectedItems.length === 0) {
      toast.error("Не выбрано ни одной позиции");
      return;
    }
    
    // Save document
    const savedDoc = saveDocument(selectedItems);
    
    // Send to printer
    sendToPrinter(savedDoc);
    
    toast.success("Документ успешно сохранен и отправлен на печать");
    console.log("Saving items:", selectedItems);
    
    // Navigate back to document types
    navigate('/documents');
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 border-b">
        <h1 className="text-2xl font-medium text-center">Акт приготовления</h1>
      </header>
      
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left panel - Selected items */}
        <div className="flex flex-col w-full md:w-1/2 p-4 border-r">
          <h2 className="text-lg font-medium mb-4">Выбранные позиции</h2>
          
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Наименование</TableHead>
                  <TableHead className="text-right">Количество</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Список пуст. Выберите позиции из правой панели.
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive h-6"
                          onClick={() => removeItem(item.id)}
                        >
                          ×
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Right panel - Menu categories and items */}
        <div className="flex flex-col w-full md:w-1/2 p-4">
          <h2 className="text-lg font-medium mb-4">Номенклатура</h2>
          
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Items */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 gap-2">
              {categoryItems.map((item) => (
                <button
                  key={item.id}
                  className="flex items-center p-3 rounded-md text-left bg-white border border-border hover:bg-accent"
                  onClick={() => handleItemClick(item)}
                >
                  <span>{item.name}</span>
                  {selectedItems.some(i => i.id === item.id) && (
                    <span className="ml-auto text-sm text-muted-foreground">
                      Добавлено
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Footer buttons */}
          <div className="flex justify-between mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleBackClick}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            
            <Button 
              onClick={handleSaveAndPrint}
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить и напечатать
            </Button>
          </div>
        </div>
      </div>
      
      {/* Quantity input dialog */}
      <QuantityInput 
        isOpen={quantityDialogOpen} 
        item={selectedItem} 
        onClose={() => setQuantityDialogOpen(false)}
        onConfirm={handleQuantityConfirm}
      />
      
      {/* Confirmation dialog */}
      <ConfirmationDialog 
        isOpen={confirmationDialogOpen} 
        onConfirm={handleConfirmBack} 
        onCancel={() => setConfirmationDialogOpen(false)}
        title="Вы уверены?"
        description="Все несохраненные данные будут потеряны. Вы хотите продолжить?"
      />
    </div>
  );
};

export default ProductionAct;
