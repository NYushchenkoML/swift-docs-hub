
export interface Item {
  id: string;
  name: string;
  category: string;
  path: string;
}

export interface SelectedItem extends Item {
  quantity: number;
}

export const getItems = (): Item[] => {
  return [
    { id: '1', name: 'Ролл Калифорния', category: 'Роллы', path: 'Роллы/Ролл Калифорния' },
    { id: '2', name: 'Ролл Филадельфия', category: 'Роллы', path: 'Роллы/Ролл Филадельфия' },
    { id: '3', name: 'Ролл Окинава', category: 'Роллы', path: 'Роллы/Ролл Окинава' },
    { id: '4', name: 'Ролл Тамаго', category: 'Роллы', path: 'Роллы/Ролл Тамаго' },
    { id: '5', name: 'Пицца Маргарита', category: 'Пицца', path: 'Пицца/Пицца Маргарита' },
    { id: '6', name: 'Пицца Пепперони', category: 'Пицца', path: 'Пицца/Пицца Пепперони' },
    { id: '7', name: 'Борщ', category: 'Супы', path: 'Супы/Борщ' },
    { id: '8', name: 'Солянка', category: 'Супы', path: 'Супы/Солянка' },
    { id: '9', name: 'Цезарь с курицей', category: 'Салаты', path: 'Салаты/Цезарь с курицей' },
    { id: '10', name: 'Греческий салат', category: 'Салаты', path: 'Салаты/Греческий салат' }
  ];
};

export const getCategories = (): string[] => {
  const items = getItems();
  return [...new Set(items.map(item => item.category))];
};

export const getItemsByCategory = (category: string): Item[] => {
  return getItems().filter(item => item.category === category);
};
