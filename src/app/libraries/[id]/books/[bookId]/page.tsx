"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Book, User, Tag, Calendar, FileText, Image as ImageIcon, Loader2, AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";

interface BookData {
  id: string;
  title: string;
  author: string | null;
  isbn: string | null;
  description: string | null;
  cover_image_url: string | null;
  published_date: string | null;
  library_id: string;
  libraries: {
    name: string;
  } | null;
}

type PageProps = {
  params: { id: string; bookId: string };
};

export default function BookDetailsPage({ params }: PageProps) {
  const [book, setBook] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("books")
          .select(`
            id,
            title,
            author,
            isbn,
            description,
            cover_image_url,
            published_date,
            library_id,
            libraries ( name )
          `)
          .eq("id", params.bookId)
          .eq("library_id", params.id)
          .single();

        if (error || !data) {
          if (error) console.error("Error fetching book details:", error);
          return notFound();
        }
        setBook(data);
      } catch (err: any) {
        setError("Não foi possível carregar os detalhes do livro.");
        console.error("Error fetching book data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [params.bookId, params.id]);

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center animate-in fade-in-0 duration-500">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Erro ao Carregar
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!book) {
    return notFound();
  }

  return (
    <div className="container py-8 animate-in fade-in-0 duration-500">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/libraries/${book.library_id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o Acervo
          </Link>
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto animate-in fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">{book.title}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {book.author ? `por ${book.author}` : "Autor desconhecido"}
          </CardDescription>
          {book.libraries?.name && (
            <p className="text-sm text-muted-foreground mt-1">
              Disponível em: <Link href={`/libraries/${book.library_id}`} className="text-primary hover:underline">{book.libraries.name}</Link>
            </p>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 flex justify-center">
            {book.cover_image_url ? (
              <img 
                src={book.cover_image_url} 
                alt={`Capa do livro ${book.title}`} 
                className="w-full max-w-[200px] h-auto rounded-lg shadow-md object-cover"
              />
            ) : (
              <div className="w-full max-w-[200px] aspect-[3/4] bg-muted rounded-lg flex items-center justify-center text-muted-foreground/50 shadow-md">
                <Book className="h-20 w-20" />
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-4">
            {book.description && (
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Descrição
                </h3>
                <p className="text-muted-foreground">{book.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {book.isbn && (
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    <Tag className="h-5 w-5 text-primary" />
                    ISBN
                  </h3>
                  <p className="text-muted-foreground">{book.isbn}</p>
                </div>
              )}
              {book.published_date && (
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Data de Publicação
                  </h3>
                  <p className="text-muted-foreground">{new Date(book.published_date).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}