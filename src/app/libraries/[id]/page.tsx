"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Book, Library, Search, User, AlertTriangle, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

type Book = {
  id: string;
  title: string;
  author: string | null;
};

type LibraryData = {
  id: string;
  name: string;
  address: string;
  books: Book[];
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function LibraryDetailsPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const libraryId = unwrappedParams.id;
  
  const [library, setLibrary] = useState<LibraryData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("libraries")
        .select(`
          id,
          name,
          address,
          books ( id, title, author )
        `)
        .eq("id", libraryId)
        .single();

      if (error || !data) {
        if (error) console.error("Error fetching library details:", error);
        return notFound();
      }
      
      setLibrary(data);
      setLoading(false);
    };

    fetchLibrary();
  }, [libraryId]);

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!library) {
    return null; // or a custom not found component
  }

  const filteredBooks = library.books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container py-8 animate-in fade-in-0 duration-500">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/libraries">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Bibliotecas
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            {library.name}
          </h1>
          <p className="text-muted-foreground">{library.address}</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar por título ou autor..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Book className="h-6 w-6" />
          Acervo de Livros
        </h2>
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredBooks.map((book, index) => (
              <Card 
                key={book.id} 
                className="flex flex-col animate-in fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="p-0">
                  <div className="aspect-[3/4] bg-muted rounded-t-lg flex items-center justify-center">
                    <Book className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-base font-semibold leading-tight mb-1">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {book.author || "Autor desconhecido"}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" variant="secondary" size="sm" asChild>
                    <Link href={`/libraries/${library.id}/books/${book.id}`}>Ver Detalhes</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
            <Book className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Nenhum livro encontrado</h2>
            <p className="text-muted-foreground">
              {searchTerm ? "Tente uma busca diferente." : "Esta biblioteca ainda não cadastrou nenhum livro."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}