import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, MapPin, Phone, Globe, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function LibraryDetailPage({ params }: { params: { id: string } }) {
  // In a real app, this data would come from Supabase based on the ID
  const library = {
    id: params.id,
    name: "Biblioteca Central da Cidade",
    address: "Av. Principal, 123 - Centro",
    phone: "(11) 3456-7890",
    website: "https://bibliotecacentral.com.br",
    description: "A Biblioteca Central da Cidade é a maior biblioteca pública da região, com mais de 50 anos de história. Possui um acervo de mais de 15.000 livros, periódicos, documentos históricos e materiais digitais.",
    books: 15420,
  };

  // Sample books data
  const books = [
    {
      id: 1,
      title: "Dom Casmurro",
      author: "Machado de Assis",
      isbn: "978-85-359-0508-5",
      publishedDate: "1899",
      description: "Dom Casmurro é um romance escrito por Machado de Assis, publicado originalmente em 1899. É amplamente considerado um dos melhores romances brasileiros de todos os tempos.",
      coverImageUrl: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 2,
      title: "Memórias Póstumas de Brás Cubas",
      author: "Machado de Assis",
      isbn: "978-85-359-0498-9",
      publishedDate: "1881",
      description: "Memórias Póstumas de Brás Cubas é um romance escrito por Machado de Assis, publicado em 1881. É considerado o primeiro romance da fase realista da literatura brasileira.",
      coverImageUrl: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 3,
      title: "O Guarani",
      author: "José de Alencar",
      isbn: "978-85-359-0321-0",
      publishedDate: "1857",
      description: "O Guarani é um romance indianista escrito por José de Alencar, publicado em 1857. É uma das obras mais importantes da literatura brasileira do século XIX.",
      coverImageUrl: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 4,
      title: "Iracema",
      author: "José de Alencar",
      isbn: "978-85-359-0287-9",
      publishedDate: "1865",
      description: "Iracema é um romance indianista escrito por José de Alencar, publicado em 1865. A obra faz parte da trilogia indianista do autor, juntamente com O Guarani e Ubirajara.",
      coverImageUrl: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 5,
      title: "Vidas Secas",
      author: "Graciliano Ramos",
      isbn: "978-85-7232-604-2",
      publishedDate: "1938",
      description: "Vidas Secas é um romance escrito por Graciliano Ramos, publicado em 1938. A obra retrata a vida de uma família de retirantes no sertão nordestino.",
      coverImageUrl: "/placeholder.svg?height=200&width=150",
    },
    {
      id: 6,
      title: "O Cortiço",
      author: "Aluísio Azevedo",
      isbn: "978-85-7232-598-4",
      publishedDate: "1890",
      description: "O Cortiço é um romance escrito por Aluísio Azevedo, publicado em 1890. É uma das obras mais importantes do Naturalismo brasileiro.",
      coverImageUrl: "/placeholder.svg?height=200&width=150",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/libraries">← Voltar para Bibliotecas</Link>
        </Button>
      </div>

      {/* Library Header */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">{library.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {library.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{library.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={library.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {library.website}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4 text-muted-foreground" />
              <span>{library.books.toLocaleString('pt-BR')} livros</span>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">{library.description}</p>
        </CardContent>
      </Card>

      {/* Books Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Acervo da Biblioteca</h2>
          <p className="text-muted-foreground">Explore os livros disponíveis nesta biblioteca</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar livros..." 
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="bg-muted rounded-md flex items-center justify-center w-24 h-32 flex-shrink-0">
                  <Book className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{book.publishedDate}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>ISBN: {book.isbn}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild className="mt-3 w-full">
                    <Link href={`/books/${book.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}