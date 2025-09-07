"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

const bookSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  author: z.string().optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
  cover_image_url: z.string().url("URL da imagem de capa inválida").optional().or(z.literal("")),
  published_date: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface AddBookDialogProps {
  libraryId: string;
  onBookAdded: () => void;
  isFirstBook?: boolean;
}

export default function AddBookDialog({ libraryId, onBookAdded, isFirstBook = false }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  });

  const onSubmit = async (data: BookFormValues) => {
    try {
      const { error } = await supabase.from("books").insert([
        {
          ...data,
          library_id: libraryId,
          published_date: data.published_date || null, // Garante que seja nulo se vazio
        },
      ]);

      if (error) throw error;

      toast.success("Livro adicionado com sucesso!");
      onBookAdded(); // Atualiza a lista de livros no painel
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error("Falha ao adicionar livro.", {
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isFirstBook ? (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Primeiro Livro
          </Button>
        ) : (
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Livro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Livro</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para adicionar um livro ao acervo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título *
            </Label>
            <div className="col-span-3">
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Autor
            </Label>
            <Input id="author" {...register("author")} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isbn" className="text-right">
              ISBN
            </Label>
            <Input id="isbn" {...register("isbn")} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="published_date" className="text-right">
              Publicação
            </Label>
            <Input id="published_date" type="date" {...register("published_date")} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cover_image_url" className="text-right">
              URL da Capa
            </Label>
            <Input id="cover_image_url" {...register("cover_image_url")} className="col-span-3" />
             {errors.cover_image_url && <p className="col-start-2 col-span-3 text-sm text-red-500 mt-1">{errors.cover_image_url.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea id="description" {...register("description")} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Livro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}