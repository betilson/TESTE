import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, MapPin, Search, Library } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function LibrariesPage() {
  // In a real app, this data would come from Supabase
  const libraries = [
    {
      id: 1,
      name: "Biblioteca Central da Cidade",
      address: "Av. Principal, 123 - Centro",
      books: 15420,
    },
    {
      id: 2,
      name: "Biblioteca Universitária",
      address: "Campus Universitário, s/n - Universitário",
      books: 87350,
    },
    {
      id: 3,
      name: "Biblioteca Comunitária",
      address: "Rua das Flores, 456 - Vila Nova",
      books: 3250,
    },
    {
      id: 4,
      name: "Biblioteca Estadual",
      address: "Praça da Cultura, 789 - Centro",
      books: 42100,
    },
    {
      id: 5,
      name: "Biblioteca Infantil",
      address: "Rua da Alegria, 321 - Jardim das Crianças",
      books: 8750,
    },
    {
      id: 6,
      name: "Biblioteca Técnica",
      address: "Av. Tecnológica, 555 - Distrito Industrial",
      books: 12300,
    },
  ];

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraries.map((library) => (
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
                  <span>{library.books.toLocaleString('pt-BR')} livros</span>
                </div>
                <Button variant="outline" asChild size="sm">
                  <Link href={`/libraries/${library.id}`}>Ver Acervo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}