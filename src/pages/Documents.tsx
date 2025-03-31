import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDocuments, getUnsentDocuments, Document } from '@/services/documentsService';

const Documents = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>(getDocuments());
  const [unsentDocuments, setUnsentDocuments] = useState<Document[]>(getUnsentDocuments());

  const handleBack = () => {
    navigate('/');
  };

  const handleViewDocument = (id: string) => {
    navigate(`/documents/${id}`);
  };

  const formatDate = (date: any) => {
    try {
      // Проверяем, является ли date строкой или объектом Date
      if (date instanceof Date) {
        return date.toLocaleString();
      }
      
      // Если date - это строка, пробуем создать из неё объект Date
      if (typeof date === 'string') {
        return new Date(date).toLocaleString();
      }
      
      // Если date - это число (timestamp), преобразуем его в Date
      if (typeof date === 'number') {
        return new Date(date).toLocaleString();
      }
      
      // Если ничего не подошло, возвращаем заглушку
      return 'Недопустимая дата';
    } catch (error) {
      console.error('Ошибка при форматировании даты:', date, error);
      return 'Ошибка даты';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 border-b">
        <h1 className="text-2xl font-medium text-center">Документы</h1>
      </header>
      
      <div className="p-4 flex-1">
        <Tabs defaultValue="sent" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sent">Отправленные</TabsTrigger>
            <TabsTrigger value="unsent">Неотправленные</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sent" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Позиций</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Нет документов
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id} className="cursor-pointer" onClick={() => handleViewDocument(doc.id)}>
                      <TableCell>{doc.id}</TableCell>
                      <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.items.length}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          →
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="unsent" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Позиций</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unsentDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Нет неотправленных документов
                    </TableCell>
                  </TableRow>
                ) : (
                  unsentDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.id}</TableCell>
                      <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.items.length}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleViewDocument(doc.id)}>
                          Просмотр
                        </Button>
                        <Button size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Отправить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        
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

export default Documents;
