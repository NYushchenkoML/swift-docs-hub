
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getForecastData, ForecastItem } from '@/services/forecastService';
import { toast } from 'sonner';

const Forecast = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [cookedTimeSlots, setCookedTimeSlots] = useState<{ [key: string]: boolean }>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const data = getForecastData(date);
    setForecastData(data);
  }, [date]);

  const handleBack = () => {
    navigate('/');
  };

  const handlePrevDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  const handleCook = (timeSlot: string) => {
    if (cookedTimeSlots[timeSlot]) {
      toast.info("Блюда на это время уже приготовлены");
      return;
    }

    // Get items for the selected time slot
    const items = forecastData.map(item => {
      const quantity = item.slots[timeSlot as keyof typeof item.slots];
      if (quantity > 0) {
        return {
          id: item.id,
          name: item.name,
          category: item.category,
          path: item.path,
          quantity
        };
      }
      return null;
    }).filter(Boolean);

    // Save to local storage for automatic filling in ProductionAct
    localStorage.setItem('forecastItems', JSON.stringify(items));
    
    // Mark time slot as cooked
    setCookedTimeSlots(prev => ({ ...prev, [timeSlot]: true }));
    
    // Navigate to production act
    navigate('/production-act');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 border-b">
        <h1 className="text-2xl font-medium text-center">Прогноз</h1>
      </header>
      
      <div className="p-4 flex-1">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={handlePrevDay}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Пред. день
          </Button>
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="font-normal">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {formatDate(date)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar 
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    setCalendarOpen(false);
                  }
                }}
                className="rounded-md border shadow pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" onClick={handleNextDay}>
            След. день
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Название</TableHead>
                <TableHead>9-12</TableHead>
                <TableHead>12-15</TableHead>
                <TableHead>15-18</TableHead>
                <TableHead>18-21</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecastData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Нет данных для выбранной даты
                  </TableCell>
                </TableRow>
              ) : (
                forecastData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.slots["9-12"]}</TableCell>
                    <TableCell>{item.slots["12-15"]}</TableCell>
                    <TableCell>{item.slots["15-18"]}</TableCell>
                    <TableCell>{item.slots["18-21"]}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => handleCook("9-12")}
              disabled={cookedTimeSlots["9-12"]}
              className="w-full"
            >
              Готовить 9-12
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => handleCook("12-15")}
              disabled={cookedTimeSlots["12-15"]}
              className="w-full"
            >
              Готовить 12-15
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => handleCook("15-18")}
              disabled={cookedTimeSlots["15-18"]}
              className="w-full"
            >
              Готовить 15-18
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => handleCook("18-21")}
              disabled={cookedTimeSlots["18-21"]}
              className="w-full"
            >
              Готовить 18-21
            </Button>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
