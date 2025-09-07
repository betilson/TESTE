import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, Calendar, User, Hash, FileText } from "lucide-react";

export default function BookDetailPage({ params }: { params: { id: string } }) {
  // In a real app, this data would come from Supabase based on the ID
  const book = {
    id: params.id,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    isbn: "978-85-359-0508-5",
    publishedDate: "1899",
    description: "Dom Casmurro é um romance escrito por Machado de Assis, publicado originalmente em 1899. É amplamente considerado um dos melhores romances brasileiros de todos os tempos. A obra é narrada em primeira pessoa por Bento Santiago, que relembra sua infância, adolescência e juventude, especialmente seu relacionamento com Capitu, sua grande paixão. A narrativa explora temas como ciúmes, memória, percepção e a dificuldade de se conhecer a verdade sobre os outros e sobre si mesmo.",
    coverImageUrl: "/placeholder.svg?height=400&width=300",
    publisher: "Editora Globo",
    pages: 256,
    language: "Português",
    genre: "Ficção Literária",
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="javascript:history.back()">← Voltar</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{book.title}</CardTitle>
          <CardDescription className="text-lg">por {book.author}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-muted rounded-lg aspect-[3/4] flex items-center justify-center">
                <Book className="h-32 w-32 text-muted-foreground" />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">ISBN</p>
                    <p className="font-medium">{book.isbn}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ano de Publicação</p>
                    <p className="font-medium">{book.publishedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Páginas</p>
                    <p className="font-medium">{book.pages}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Editora</p>
                    <p className="font-medium">{book.publisher}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Sinopse</h3>
                <p className="text-muted-foreground">{book.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button size="lg">Solicitar Empréstimo</Button>
                <Button variant="outline" size="lg">Adicionar aos Favoritos</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}