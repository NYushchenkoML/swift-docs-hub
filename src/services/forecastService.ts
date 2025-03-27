
export interface ForecastSlots {
  "9-12": number;
  "12-15": number;
  "15-18": number;
  "18-21": number;
}

export interface ForecastItem {
  id: string;
  name: string;
  category: string;
  path: string;
  slots: ForecastSlots;
}

// Mock forecast data
const mockForecastData: ForecastItem[] = [
  {
    id: '1',
    name: 'Ролл Калифорния',
    category: 'Роллы',
    path: 'Роллы/Ролл Калифорния',
    slots: {
      "9-12": 5,
      "12-15": 8,
      "15-18": 6,
      "18-21": 12
    }
  },
  {
    id: '2',
    name: 'Ролл Филадельфия',
    category: 'Роллы',
    path: 'Роллы/Ролл Филадельфия',
    slots: {
      "9-12": 3,
      "12-15": 6,
      "15-18": 4,
      "18-21": 8
    }
  },
  {
    id: '3',
    name: 'Ролл Окинава',
    category: 'Роллы',
    path: 'Роллы/Ролл Окинава',
    slots: {
      "9-12": 2,
      "12-15": 4,
      "15-18": 3,
      "18-21": 5
    }
  },
  {
    id: '6',
    name: 'Пицца Пепперони',
    category: 'Пицца',
    path: 'Пицца/Пицца Пепперони',
    slots: {
      "9-12": 2,
      "12-15": 3,
      "15-18": 3,
      "18-21": 4
    }
  },
  {
    id: '7',
    name: 'Пицца Маргарита',
    category: 'Пицца',
    path: 'Пицца/Пицца Маргарита',
    slots: {
      "9-12": 1,
      "12-15": 2,
      "15-18": 2,
      "18-21": 3
    }
  },
  {
    id: '8',
    name: 'Солянка',
    category: 'Супы',
    path: 'Супы/Солянка',
    slots: {
      "9-12": 3,
      "12-15": 4,
      "15-18": 2,
      "18-21": 1
    }
  },
  {
    id: '10',
    name: 'Борщ',
    category: 'Супы',
    path: 'Супы/Борщ',
    slots: {
      "9-12": 2,
      "12-15": 3,
      "15-18": 1,
      "18-21": 0
    }
  }
];

// Get forecast data for a specific date
export const getForecastData = (date: Date): ForecastItem[] => {
  // In a real app, this would fetch data from a backend
  // For now, just return mock data with some randomization
  
  // Create a deterministic random factor based on the date
  const dateString = date.toISOString().split('T')[0];
  let randomFactor = 0;
  for (let i = 0; i < dateString.length; i++) {
    randomFactor += dateString.charCodeAt(i);
  }
  
  // Adjust quantities based on the day of the week
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1.0;
  
  return mockForecastData.map(item => {
    // Create a copy of the slots with adjusted values
    const adjustedSlots = { ...item.slots };
    
    // Adjust each time slot
    Object.keys(adjustedSlots).forEach(slot => {
      const baseValue = item.slots[slot as keyof ForecastSlots];
      // Apply some randomness and the weekend factor
      const adjustedValue = Math.round(
        baseValue * 
        weekendFactor * 
        (0.8 + (((randomFactor + slot.length) % 5) / 10))
      );
      adjustedSlots[slot as keyof ForecastSlots] = adjustedValue;
    });
    
    return {
      ...item,
      slots: adjustedSlots
    };
  });
};
