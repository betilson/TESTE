"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, MapPin, Search, Library, AlertTriangle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Library {
  id: string;
  name: string;
  address: string;
  books: [{ count: number }];
}

export default function LibrariesPage() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("libraries")
        .select(`
          id,
          name,
          address,
          books ( count )
        `);

      if (error) {
        console.error("Error fetching libraries:", error);
        setError("Não foi possível carregar as bibliotecas. Tente novamente mais tarde.");
      } else {
        setLibraries(data as Library[]);
      }
      setLoading(false);
    };

    fetchLibraries();
  }, []);

  const filteredLibraries = libraries.filter(library =>
    library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    library.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Bibliotecas Participantes</h1>
          <p className="text-muted-foreground">Explore nossa coleção de bibliotecas cadastradas</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar por nome ou endereço..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold">Ocorreu um erro</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {!loading && !error && filteredLibraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibraries.map((library) => (
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
        !loading && !error && (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
            <Library className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">Nenhuma biblioteca encontrada</h2>
            <p className="text-muted-foreground">
              {searchTerm ? "Tente ajustar sua busca." : "Ainda não há bibliotecas cadastradas. Seja a primeira!"}
            </p>
            {!searchTerm && (
              <Button asChild className="mt-4">
                <Link href="/register">Registrar Biblioteca</Link>
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
}