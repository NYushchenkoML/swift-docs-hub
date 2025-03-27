
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getDocumentById, Document } from '@/services/documentsService';

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (id) {
      const doc = getDocumentById(id);
      setDocument(doc);
    }
  }, [id]);

  const handleBack = () => {
    navigate('/documents');
  };

  const handlePrint = () => {
    // Here we would send data to the TCP printer
    console.log('Printing document:', document);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Загрузка документа...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 border-b">
        <h1 className="text-2xl font-medium text-center">Документ #{document.id}</h1>
      </header>
      
      <div className="p-4 flex-1">
        <div className="bg-muted/20 p-4 rounded-md mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Тип документа</p>
              <p className="font-medium">{document.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Дата создания</p>
              <p className="font-medium">{formatDate(document.date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Статус</p>
              <p className="font-medium">{document.sent ? 'Отправлен' : 'Не отправлен'}</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-lg font-medium mb-4">Позиции</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Наименование</TableHead>
              <TableHead className="text-right">Количество</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {document.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Печать
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
