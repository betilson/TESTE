"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Book, Library, PlusCircle, Loader2, AlertTriangle, BookOpenCheck, Trash2 } from "lucide-react";
import Link from "next/link";

// Define types for our data
interface Book {
  id: string;
  title: string;
  author: string | null;
  created_at: string;
}

interface LibraryData {
  id: string;
  name: string;
  address: string;
  books: Book[];
}

// Zod schema for the book form
const bookSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  author: z.string().optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

export default function DashboardPage() {
  const { session, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [library, setLibrary] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  });

  const fetchLibraryData = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("libraries")
        .select(`
          id,
          name,
          address,
          books ( id, title, author, created_at )
        `)
        .eq("profile_id", userId)
        .single();

      if (error) throw error;
      if (data) {
        // Sort books by creation date, newest first
        data.books.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setLibrary(data);
      }
    } catch (err: any) {
      setError("Não foi possível carregar os dados da biblioteca.");
      console.error("Error fetching library data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!session) {
        router.push("/login");
      } else if (profile && profile.role !== 'library_admin') {
        setLoading(false);
      } else if (profile) {
        fetchLibraryData(profile.id);
      }
    }
  }, [session, profile, authLoading, router]);

  const onSubmit = async (data: BookFormValues) => {
    if (!library) return;

    try {
      const { data: newBook, error } = await supabase
        .from("books")
        .insert([{ ...data, library_id: library.id }])
        .select()
        .single();

      if (error) throw error;

      toast.success(`Livro "${newBook.title}" adicionado com sucesso!`);
      reset();
      setLibrary(prev => prev ? { ...prev, books: [newBook, ...prev.books] } : null);
    } catch (error: any) {
      toast.error("Falha ao adicionar livro. Tente novamente.");
      console.error("Error adding book:", error.message);
    }
  };

  const deleteBook = async (bookId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este livro?")) return;

    try {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", bookId);

      if (error) throw error;

      toast.success("Livro excluído com sucesso!");
      setLibrary(prev => prev ? { ...prev, books: prev.books.filter(b => b.id !== bookId) } : null);
    } catch (error: any) {
      toast.error("Falha ao excluir livro. Tente novamente.");
      console.error("Error deleting book:", error.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session || (profile && profile.role !== 'library_admin')) {
    return (
      <div className="container py-8 text-center animate-in fade-in-0 duration-500">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Acesso Negado
            </CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Esta área é reservada para administradores de bibliotecas.</p>
            <Button asChild>
              <Link href="/">Voltar para a Página Inicial</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500 animate-in fade-in-0 duration-500">{error}</div>
    );
  }

  if (!library) {
    return (
      <div className="container py-8 text-center animate-in fade-in-0 duration-500">
        <p>Nenhuma biblioteca encontrada para seu perfil.</p>
        <Button asChild className="mt-4">
          <Link href="/register">Registrar sua Biblioteca</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-in fade-in-0 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-3">
          <Library className="h-8 w-8 text-primary" />
          Painel da Biblioteca: {library.name}
        </h1>
        <p className="text-muted-foreground">{library.address}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="animate-in fade-in-up" style={{ animationDelay: '0s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Adicionar Novo Livro
              </CardTitle>
              <CardDescription>
                Preencha os dados para incluir um novo título no acervo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input id="title" {...register("title")} placeholder="O Senhor dos Anéis" />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <Label htmlFor="author">Autor</Label>
                  <Input id="author" {...register("author")} placeholder="J.R.R. Tolkien" />
                </div>
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" {...register("isbn")} placeholder="978-3-16-148410-0" />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" {...register("description")} placeholder="Uma breve sinopse do livro..." />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar Livro"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="animate-in fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5" />
                Acervo da Biblioteca
              </CardTitle>
              <CardDescription>
                Total de {library.books.length} livro(s) cadastrado(s).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {library.books.length > 0 ? (
                <ul className="space-y-3">
                  {library.books.map((book, index) => (
                    <li 
                      key={book.id} 
                      className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors group animate-in fade-in-0 slide-in-from-top-2 duration-300"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-sm text-muted-foreground">{book.author || "Autor desconhecido"}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteBook(book.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Excluir livro</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum livro cadastrado ainda.</p>
                  <p className="text-sm text-muted-foreground">Use o formulário ao lado para começar.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}