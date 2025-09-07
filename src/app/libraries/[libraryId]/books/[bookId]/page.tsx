"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, User, Calendar, Hash, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookType {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  coverImageUrl: string;
  publishedDate: string;
  category: string;
}

export default function BookDetailPage({ 
  params 
}: { 
  params: { libraryId: string; bookId: string } 
}) {
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando carregamento de dados
    // Em uma aplicação real, isso viria do Supabase
    const fetchBookData = () => {
      // Dados de exemplo
      const mockBook: BookType = {
        id: parseInt(params.bookId),
        title: "Dom Casmurro",
        author: "Machado de Assis",
        isbn: "978-85-359-0504-5",
        description: "Dom Casmurro é um romance escrito por Machado de Assis, publicado originalmente em 1899. É amplamente considerado um dos melhores romances brasileiros de todos os tempos. A obra é narrada em primeira pessoa por Bento Santiago, que relembra sua infância, adolescência e juventude, especialmente seu relacionamento com Capitu, sua grande paixão. A narrativa explora temas como ciúmes, memória, percepção e a dificuldade de se conhecer a verdade sobre os outros e sobre si mesmo. A ambiguidade moral do narrador e a famosa frase final - 'Capitu, ao recebê-lo, voltou para mim os olhos, mas já não sei se era o gesto habitual ou novo, se me transmitia só isto ou mais alguma coisa' - são elementos centrais da obra que geram discussões até hoje.",
        coverImageUrl: "/placeholder-book-cover.jpg",
        publishedDate: "1899-01-01",
        category: "Ficção Clássica"
      };
      
      setBook(mockBook);
      setLoading(false);
    };

    fetchBookData();
  }, [params.bookId]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Livro não encontrado</h1>
          <p className="mt-2">O livro que você procura não existe ou foi removido.</p>
          <Button asChild className="mt-4">
            <Link href={`/libraries/${params.libraryId}`}>Voltar para Biblioteca</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button asChild variant="outline" className="mb-6">
        <Link href={`/libraries/${params.libraryId}`}>← Voltar para Biblioteca</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Capa do Livro */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-[2/3] bg-muted rounded-lg flex items-center justify-center mb-4">
                <Book className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  {book.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Livro */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-xl p-6">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <div className="flex items-center gap-2 mb-6 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-lg">{book.author}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">ISBN</div>
                  <div className="font-medium">{book.isbn}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Publicação</div>
                  <div className="font-medium">
                    {new Date(book.publishedDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Sinopse</h2>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="#">Solicitar Empréstimo</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#">Salvar nos Favoritos</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}