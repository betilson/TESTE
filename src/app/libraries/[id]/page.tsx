"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, MapPin, Phone, Globe, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Tipos para nossos dados
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

interface LibraryType {
  id: number;
  name: string;
  address: string;
  phone: string;
  website: string;
  description: string;
  books: BookType[];
}

export default function LibraryDetailPage({ params }: { params: { id: string } }) {
  const [library, setLibrary] = useState<LibraryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando carregamento de dados
    // Em uma aplicação real, isso viria do Supabase
    const fetchLibraryData = () => {
      // Dados de exemplo
      const mockLibrary: LibraryType = {
        id: parseInt(params.id),
        name: "Biblioteca Central da Cidade",
        address: "Av. Principal, 123 - Centro, São Paulo - SP",
        phone: "(11) 3456-7890",
        website: "https://bibliotecacentral.sp.gov.br",
        description: "A Biblioteca Central da Cidade é a maior biblioteca pública do estado, com mais de 15.000 volumes em sua coleção. Fundada em 1952, oferece serviços de empréstimo, pesquisa e eventos culturais para a comunidade.",
        books: [
          {
            id: 1,
            title: "Dom Casmurro",
            author: "Machado de Assis",
            isbn: "978-85-359-0504-5",
            description: "Dom Casmurro é um romance escrito por Machado de Assis, publicado originalmente em 1899. É amplamente considerado um dos melhores romances brasileiros de todos os tempos.",
            coverImageUrl: "/placeholder-book-cover.jpg",
            publishedDate: "1899-01-01",
            category: "Ficção Clássica"
          },
          {
            id: 2,
            title: "O Alquimista",
            author: "Paulo Coelho",
            isbn: "978-85-7665-320-9",
            description: "O Alquimista é um romance do escritor brasileiro Paulo Coelho, publicado em 1988. É uma das obras mais traduzidas da história da literatura.",
            coverImageUrl: "/placeholder-book-cover.jpg",
            publishedDate: "1988-01-01",
            category: "Ficção Contemporânea"
          },
          {
            id: 3,
            title: "1984",
            author: "George Orwell",
            isbn: "978-85-359-1488-7",
            description: "1984 é um romance distópico escrito por George Orwell e publicado em 1949. É uma crítica ao totalitarismo e à vigilância governamental.",
            coverImageUrl: "/placeholder-book-cover.jpg",
            publishedDate: "1949-06-08",
            category: "Ficção Distópica"
          },
          {
            id: 4,
            title: "O Pequeno Príncipe",
            author: "Antoine de Saint-Exupéry",
            isbn: "978-85-359-1489-4",
            description: "O Pequeno Príncipe é uma novela do escritor, aviador e ilustrador francês Antoine de Saint-Exupéry, publicada em 1943. É uma das obras mais traduzidas da literatura mundial.",
            coverImageUrl: "/placeholder-book-cover.jpg",
            publishedDate: "1943-04-06",
            category: "Literatura Infantil"
          },
          {
            id: 5,
            title: "Memórias Póstumas de Brás Cubas",
            author: "Machado de Assis",
            isbn: "978-85-359-0505-2",
            description: "Memórias Póstumas de Brás Cubas é um romance escrito por Machado de Assis, publicado em 1881. É considerado o primeiro romance psicológico da literatura brasileira.",
            coverImageUrl: "/placeholder-book-cover.jpg",
            publishedDate: "1881-01-01",
            category: "Ficção Clássica"
          },
          {
            id: 6,
            title: "O Senhor dos Anéis",
            author: "J.R.R. Tolkien",
            isbn: "978-85-359-0506-9",
            description: "O Senhor dos Anéis é uma trilogia de livros de alta fantasia escrita pelo filólogo e escritor britânico J.R.R. Tolkien.",
            coverImageUrl: "/placeholder-book-cover.jpg",
            publishedDate: "1954-07-29",
            category: "Fantasia"
          }
        ]
      };
      
      setLibrary(mockLibrary);
      setLoading(false);
    };

    fetchLibraryData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!library) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Biblioteca não encontrada</h1>
          <p className="mt-2">A biblioteca que você procura não existe ou foi removida.</p>
          <Button asChild className="mt-4">
            <Link href="/libraries">Voltar para Bibliotecas</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/libraries">← Voltar para Bibliotecas</Link>
      </Button>

      {/* Cabeçalho da Biblioteca */}
      <div className="bg-card border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">{library.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{library.address}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href={`/libraries/${library.id}/register-book`}>Adicionar Livro</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {library.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{library.phone}</span>
            </div>
          )}
          {library.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={library.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {library.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <span>{library.books.length} livros no acervo</span>
          </div>
        </div>

        {library.description && (
          <p className="mt-4 text-muted-foreground">{library.description}</p>
        )}
      </div>

      {/* Lista de Livros */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Acervo da Biblioteca</h2>
          <div className="text-sm text-muted-foreground">
            Mostrando {library.books.length} livros
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {library.books.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {book.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{book.category}</Badge>
                  <Button asChild size="sm">
                    <Link href={`/libraries/${library.id}/books/${book.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}