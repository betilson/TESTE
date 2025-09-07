"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Library, LogIn, LogOut, User, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function Navbar() {
  const { session, profile, signOut } = useAuth();

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    if (session?.user?.email) {
      return session.user.email[0].toUpperCase();
    }
    return "U";
  };

  const navLinks = (
    <>
      <Link
        href="/libraries"
        className="text-lg md:text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Bibliotecas
      </Link>
      {/* Adicione mais links aqui se necessário */}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold">BiblioDigital</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6">
          {navLinks}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-1 justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <div className="flex flex-col h-full p-4">
                <div className="flex flex-col space-y-4 text-center mt-8">
                  <SheetClose asChild>{navLinks}</SheetClose>
                </div>
                <div className="mt-auto">
                  {!session && (
                     <div className="flex flex-col gap-2">
                       <SheetClose asChild>
                         <Button variant="ghost" asChild>
                           <Link href="/login">
                             <LogIn className="mr-2 h-4 w-4" />
                             Entrar
                           </Link>
                         </Button>
                       </SheetClose>
                       <SheetClose asChild>
                         <Button asChild>
                           <Link href="/register">Registrar Biblioteca</Link>
                         </Button>
                       </SheetClose>
                     </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* User Auth Section */}
        <div className="hidden md:flex items-center justify-end space-x-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || ''} alt="Avatar" />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.first_name || session.user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profile?.role === 'library_admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Library className="mr-2 h-4 w-4" />
                      <span>Meu Painel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrar Biblioteca</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}