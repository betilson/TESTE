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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const { session, profile, signOut } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    if (session?.user?.email) {
      return session.user.email[0].toUpperCase();
    }
    return "U";
  };

  const NavLinks = () => (
    <>
      <Link
        href="/libraries"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        onClick={() => setIsSheetOpen(false)}
      >
        Bibliotecas
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold">BiblioDigital</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-4">
          <NavLinks />
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
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
            <div className="hidden md:flex items-center gap-2">
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

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center space-x-2" onClick={() => setIsSheetOpen(false)}>
                      <BookOpen className="h-6 w-6" />
                      <span className="font-bold">BiblioDigital</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 py-6">
                  <NavLinks />
                  {session && (
                    <>
                      {profile?.role === 'library_admin' && (
                        <Button variant="ghost" asChild className="justify-start">
                          <Link href="/dashboard" onClick={() => setIsSheetOpen(false)}>
                            <Library className="mr-2 h-4 w-4" />
                            Meu Painel
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/profile" onClick={() => setIsSheetOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Perfil
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => { signOut(); setIsSheetOpen(false); }} className="justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  )}
                  {!session && (
                    <>
                      <Button variant="outline" asChild>
                        <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Entrar
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register" onClick={() => setIsSheetOpen(false)}>Registrar Biblioteca</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}