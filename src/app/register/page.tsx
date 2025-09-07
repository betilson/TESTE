"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Library, MapPin, Phone, Globe, FileText } from "lucide-react";

const librarySchema = z.object({
  name: z.string().min(1, "Nome da biblioteca é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  phone: z.string().optional(),
  website: z.string().url("Por favor, insira uma URL válida").optional().or(z.literal("")),
  description: z.string().optional(),
});

type LibraryFormValues = z.infer<typeof librarySchema>;

export default function RegisterLibraryPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LibraryFormValues>({
    resolver: zodResolver(librarySchema),
  });

  const onSubmit = async (data: LibraryFormValues) => {
    try {
      // In a real app, this would connect to Supabase
      console.log("Library registration data:", data);
      
      // Show success message
      toast.success("Biblioteca registrada com sucesso!");
      
      // Reset form
      reset();
    } catch (error) {
      toast.error("Falha ao registrar biblioteca. Por favor, tente novamente.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Registre sua Biblioteca</h1>
        <p className="text-muted-foreground mt-2">
          Junte-se à nossa plataforma para disponibilizar o acervo da sua biblioteca online
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Library className="h-5 w-5 text-primary" />
            </div>
            Informações da Biblioteca
          </CardTitle>
          <CardDescription>
            Preencha os dados abaixo para registrar sua instituição em nossa plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                Nome da Biblioteca *
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Digite o nome completo da biblioteca"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço Completo *
              </Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Ex: Rua das Flores, 123 - Centro - Cidade/UF"
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone de Contato
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="(00) 00000-0000"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Site Oficial
              </Label>
              <Input
                id="website"
                {...register("website")}
                placeholder="https://www.suabiblioteca.org.br"
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrição
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Conte-nos sobre sua biblioteca, sua história, missão e serviços oferecidos..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? "Registrando..." : "Registrar Biblioteca"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}