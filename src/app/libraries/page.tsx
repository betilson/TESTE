import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, MapPin, Search, Library, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export default async function LibrariesPage() {
  const { data: libraries, error } = await supabase
    .from("libraries")
    .select(`
      id,
      name,
      address,
      books ( count )
    `);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bibliotecas Participantes</h1>
          <p className="text-muted-foreground">Explore nossa coleção de bibliotecas cadastradas</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar bibliotecas..." 
            className="pl-10"
          />
        </div>
      </div>
      
      {error && (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold">Ocorreu um erro</h2>
          <p className="text-muted-foreground">Não foi possível carregar as bibliotecas. Tente novamente mais tarde.</p>
        </div>
      )}

      {!error && libraries && libraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraries.map((library: any) => (
            <Card key={library.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Library className="h-5 w-5 text-primary" />
                  </div>
                  {library.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {library.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Book className="h-4 w-4" />
                    <span>{library.books[0]?.count || 0} livros</span>
                  </div>
                  <Button variant="outline" asChild size="sm">
                    <Link href={`/libraries/${library.id}`}>Ver Acervo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !error && (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
            <Library className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Nenhuma biblioteca encontrada</h2>
            <p className="text-muted-foreground">Ainda não há bibliotecas cadastradas. Seja a primeira!</p>
            <Button asChild className="mt-4">
              <Link href="/register">Registrar Biblioteca</Link>
            </Button>
          </div>
        )
      )}
    </div>
  );
}