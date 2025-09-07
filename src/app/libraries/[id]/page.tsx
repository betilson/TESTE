"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Book, Search, User, Library, MapPin, Phone, Globe } from "lucide-react";
import Link from "next/link";

// Dados mocados - em uma aplicação real, viriam do Supabase
const libraryDetails: { [key: number]: any } = {
    1: { name: "Biblioteca Central da Cidade", address: "Av. Principal, 123 - Centro", phone: "(11) 1234-5678", website: "https://bibliotecacentral.org.br" },
    2: { name: "Biblioteca Universitária", address: "Campus Universitário, s/n - Universitário", phone: "(21) 9876-5432", website: "https://bibliotecauni.edu.br" },
    3: { name: "Biblioteca Comunitária", address: "Rua das Flores, 456 - Vila Nova", phone: "(31) 5555-4444", website: "https://bibliotecacomunitaria.net" },
    4: { name: "Biblioteca Estadual", address: "Praça da Cultura, 789 - Centro", phone: "(41) 2222-3333", website: "https://bibliotecaestadual.gov.br" },
    5: { name: "Biblioteca Infantil", address: "Rua da Alegria, 321 - Jardim das Crianças", phone: "(51) 7777-8888", website: "https://biblioinfantil.com" },
    6: { name: "Biblioteca Técnica", address: "Av. Tecnológica, 555 - Distrito Industrial", phone: "(61) 1111-9999", website: "https://bibliotecatecnica.ind.br" },
};

const booksData: { [key: number]: any[] } = {
    1: [
        { id: 101, title: "Dom Casmurro", author: "Machado de Assis" },
        { id: 102, title: "O Cortiço", author: "Aluísio Azevedo" },
        { id: 103, title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis" },
        { id: 104, title: "Vidas Secas", author: "Graciliano Ramos" },
        { id: 105, title: "A Hora da Estrela", author: "Clarice Lispector" },
        { id: 106, title: "Capitães da Areia", author: "Jorge Amado" },
    ],
    2: [{ id: 201, title: "O Alquimista", author: "Paulo Coelho" }],
    3: [{ id: 301, title: "Ensaio sobre a Cegueira", author: "José Saramago" }],
    4: [{ id: 401, title: "Grande Sertão: Veredas", author: "João Guimarães Rosa" }],
    5: [{ id: 501, title: "O Menino Maluquinho", author: "Ziraldo" }],
    6: [{ id: 601, title: "1984", author: "George Orwell" }],
};

export default function LibraryDetailsPage({ params }: { params: { id: string } }) {
  const libraryId = parseInt(params.id, 10);
  const library = libraryDetails[libraryId];
  const books = booksData[libraryId] || [];
  
  const [searchTerm, setSearchTerm] = useState("");

  if (!library) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Biblioteca não encontrada</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/libraries">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista de bibliotecas
          </Link>
        </Button>
      </div>
    );
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/libraries">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card className="mb-8 bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Library className="h-8 w-8 text-primary" />
            {library.name}
          </CardTitle>
          <CardDescription className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-2">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {library.address}</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {library.phone}</span>
            {library.website && (
              <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> <a href={library.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{library.website}</a></span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Acervo de Livros</h2>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por título ou autor..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] bg-muted flex items-center justify-center">
                     <Book className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                  <div className="p-4 border-t">
                    <h3 className="font-semibold truncate group-hover:text-primary">{book.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 pt-1">
                      <User className="h-3 w-3" />
                      {book.author}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Nenhum livro encontrado com o termo "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
}