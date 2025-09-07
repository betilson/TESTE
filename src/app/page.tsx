import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Library, Users } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20 md:py-32 text-center">
          <div className="flex flex-col items-center space-y-8">
            <div className="inline-flex items-center rounded-lg bg-muted px-4 py-1 text-sm font-medium animate-fade-in-up">
              <BookOpen className="mr-2 h-4 w-4" />
              Plataforma Digital de Bibliotecas
            </div>
            
            <div className="space-y-4 animate-fade-in-up animation-delay-200">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Conectando Leitores às
                <span className="block animated-gradient-text mt-2">Bibliotecas do Brasil</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Uma plataforma moderna para bibliotecas registrarem suas coleções e oferecerem acesso público a livros online.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up animation-delay-400">
              <Button size="lg" asChild className="text-base transition-transform transform hover:scale-105">
                <Link href="/libraries">
                  <Library className="mr-2 h-5 w-5" />
                  Explorar Bibliotecas
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-xl bg-card border shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Library className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bibliotecas Participantes</h3>
                <p className="text-muted-foreground">
                  Descubra bibliotecas de todo o país e explore suas coleções digitais.
                </p>
              </div>
              
              <div className="text-center p-8 rounded-xl bg-card border shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coleções Digitais</h3>
                <p className="text-muted-foreground">
                  Acesse milhares de livros digitalizados de diversas categorias e autores.
                </p>
              </div>
              
              <div className="text-center p-8 rounded-xl bg-card border shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fácil Registro</h3>
                <p className="text-muted-foreground">
                  Bibliotecas podem se registrar facilmente e começar a compartilhar seus acervos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
}