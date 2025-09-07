import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Book, Library, Search, User } from "lucide-react";
import { notFound } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

type PageProps = {
  params: { id: string };
};

export default async function LibraryDetailsPage({ params }: PageProps) {
  const { data: library, error } = await supabase
    .from("libraries")
    .select(`
      id,
      name,
      address,
      books ( id, title, author )
    `)
    .eq("id", params.id)
    .single();

  if (error || !library) {
    if (error) console.error("Error fetching library details:", error);
    notFound();
  }

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
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            {library.name}
          </h1>
          <p className="text-muted-foreground">{library.address}</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar no acervo..." 
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Book className="h-6 w-6" />
          Acervo de Livros
        </h2>
        {library.books && library.books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(library.books as any[]).map((book) => (
              <Card key={book.id} className="flex flex-col transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                <CardHeader className="p-0">
                  <div className="aspect-[3/4] bg-muted rounded-t-lg flex items-center justify-center">
                    <Book className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-lg font-semibold leading-tight mb-1">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {book.author}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" variant="secondary">Ver Detalhes</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
            <Book className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Acervo Vazio</h2>
            <p className="text-muted-foreground">Esta biblioteca ainda não cadastrou nenhum livro.</p>
          </div>
        )}
      </div>
    </div>
  );
}