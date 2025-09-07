"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Book, Library, PlusCircle, Loader2, AlertTriangle, BookPlus } from "lucide-react";
import AddBookDialog from "@/components/AddBookDialog";

// Definindo tipos para os dados
type Book = {
  id: string;
  title: string;
  author: string | null;
  isbn: string | null;
};

type Library = {
  id: string;
  name: string;
  books: Book[];
};

export default function DashboardPage() {
  const { profile, loading: authLoading, session } = useAuth();
  const router = useRouter();
  const [library, setLibrary] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLibraryData = useCallback(async () => {
    if (!profile) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("libraries")
        .select(`
          id,
          name,
          books ( id, title, author, isbn )
        `)
        .eq("profile_id", profile.id)
        .single();

      if (error) throw error;
      if (data) {
        // Ordena os livros por título
        data.books.sort((a, b) => a.title.localeCompare(b.title));
        setLibrary(data as Library);
      }
    } catch (err: any) {
      setError("Falha ao carregar os dados da biblioteca.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading) {
      if (!session || profile?.role !== "library_admin") {
        router.push("/");
      } else {
        fetchLibraryData();
      }
    }
  }, [authLoading, session, profile, router, fetchLibraryData]);

  if (authLoading || loading) {
    return (
      <div className="container flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Ocorreu um Erro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={fetchLibraryData} className="mt-4">Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!library) {
    return (
      <div className="container py-8 text-center">
        <p>Nenhuma biblioteca encontrada para este perfil.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
      <p className="text-muted-foreground mb-8">Gerencie o acervo da sua biblioteca: {library.name}</p>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Acervo de Livros
            </CardTitle>
            <CardDescription>Adicione e gerencie os livros da sua biblioteca.</CardDescription>
          </div>
          <AddBookDialog libraryId={library.id} onBookAdded={fetchLibraryData} />
        </CardHeader>
        <CardContent>
          {library.books.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {library.books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author || "N/A"}</TableCell>
                    <TableCell>{book.isbn || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <BookPlus className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Nenhum livro cadastrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece a construir seu acervo digital.
              </p>
              <div className="mt-6">
                <AddBookDialog libraryId={library.id} onBookAdded={fetchLibraryData} isFirstBook={true} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}