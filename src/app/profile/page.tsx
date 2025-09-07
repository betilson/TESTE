"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User as UserIcon, Loader2, Save } from "lucide-react";
import Link from "next/link";

const profileSchema = z.object({
  first_name: z.string().min(1, "Primeiro nome é obrigatório").optional().or(z.literal("")),
  last_name: z.string().min(1, "Sobrenome é obrigatório").optional().or(z.literal("")),
  avatar_url: z.string().url("URL do avatar inválida").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { session, user, profile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    if (!authLoading) {
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
        if (profile) {
          reset({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            avatar_url: profile.avatar_url || "",
          });
        }
      }
    }
  }, [session, profile, authLoading, router, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      // Força uma re-renderização do AuthContext para atualizar o perfil
      router.refresh(); 
    } catch (error: any) {
      toast.error("Falha ao atualizar perfil. Tente novamente.");
      console.error("Error updating profile:", error.message);
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  if (authLoading || loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null; // Should be redirected by useEffect
  }

  return (
    <div className="container py-8 max-w-2xl animate-in fade-in-0 duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e configurações da conta.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Informações do Usuário
          </CardTitle>
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url || ''} alt="Avatar do Usuário" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email} disabled className="bg-muted" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Primeiro Nome</Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  placeholder="Seu primeiro nome"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  placeholder="Seu sobrenome"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">URL do Avatar</Label>
              <Input
                id="avatar_url"
                {...register("avatar_url")}
                placeholder="https://exemplo.com/seu-avatar.jpg"
              />
              {errors.avatar_url && (
                <p className="text-sm text-red-500 mt-1">{errors.avatar_url.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Configurações da Conta</CardTitle>
          <CardDescription>
            Opções relacionadas à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Sair da sua conta.</p>
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}