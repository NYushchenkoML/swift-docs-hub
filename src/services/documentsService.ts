
import { Item } from './itemsService';

export interface SelectedItem extends Item {
  quantity: number;
}

export interface Document {
  id: string;
  date: string;
  type: string;
  items: SelectedItem[];
  sent: boolean;
}

// Mock data for documents
const mockDocuments: Document[] = [
  {
    id: '1',
    date: '2023-06-10T14:30:00',
    type: 'Акт приготовления',
    items: [
      { id: '1', name: 'Ролл Калифорния', category: 'Роллы', path: 'Роллы/Ролл Калифорния', quantity: 5 },
      { id: '2', name: 'Ролл Филадельфия', category: 'Роллы', path: 'Роллы/Ролл Филадельфия', quantity: 3 }
    ],
    sent: true
  },
  {
    id: '2',
    date: '2023-06-09T12:15:00',
    type: 'Акт приготовления',
    items: [
      { id: '6', name: 'Пицца Пепперони', category: 'Пицца', path: 'Пицца/Пицца Пепперони', quantity: 2 },
      { id: '7', name: 'Пицца Маргарита', category: 'Пицца', path: 'Пицца/Пицца Маргарита', quantity: 1 }
    ],
    sent: true
  }
];

// Mock data for unsent documents
const mockUnsentDocuments: Document[] = [
  {
    id: '3',
    date: '2023-06-11T09:45:00',
    type: 'Акт приготовления',
    items: [
      { id: '8', name: 'Солянка', category: 'Супы', path: 'Супы/Солянка', quantity: 4 },
      { id: '10', name: 'Борщ', category: 'Супы', path: 'Супы/Борщ', quantity: 2 }
    ],
    sent: false
  }
];

// Stored documents
let documents: Document[] = [...mockDocuments];
let unsentDocuments: Document[] = [...mockUnsentDocuments];

// Get all documents
export const getDocuments = (): Document[] => {
  return documents;
};

// Get all unsent documents
export const getUnsentDocuments = (): Document[] => {
  return unsentDocuments;
};

// Get document by ID
export const getDocumentById = (id: string): Document | null => {
  const doc = documents.find(d => d.id === id) || unsentDocuments.find(d => d.id === id);
  return doc || null;
};

// Save new document
export const saveDocument = (items: SelectedItem[]): Document => {
  const newDocument: Document = {
    id: (documents.length + unsentDocuments.length + 1).toString(),
    date: new Date().toISOString(),
    type: 'Акт приготовления',
    items: [...items],
    sent: false
  };
  
  // Try to send to backend
  const sendSuccess = sendToBackend(newDocument);
  
  if (sendSuccess) {
    documents = [...documents, { ...newDocument, sent: true }];
    return { ...newDocument, sent: true };
  } else {
    unsentDocuments = [...unsentDocuments, newDocument];
    return newDocument;
  }
};

// Mock function to send document to backend
const sendToBackend = (document: Document): boolean => {
  // Simulate 80% success rate
  return Math.random() > 0.2;
};

// Send document to TCP printer
export const sendToPrinter = (document: Document): boolean => {
  // Mock implementation
  console.log('Sending to printer:', document);
  return true;
};

// Try to send unsent document
export const trySendDocument = (id: string): boolean => {
  const docIndex = unsentDocuments.findIndex(d => d.id === id);
  if (docIndex >= 0) {
    const doc = unsentDocuments[docIndex];
    const sendSuccess = sendToBackend(doc);
    
    if (sendSuccess) {
      documents = [...documents, { ...doc, sent: true }];
      unsentDocuments = unsentDocuments.filter(d => d.id !== id);
      return true;
    }
  }
  return false;
};
