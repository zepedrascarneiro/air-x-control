"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerSchema, type RegisterInput } from "@/lib/validators";
import { useToast } from "@/components/ui/toast-provider";

const ROLE_OPTIONS = [
  { value: "VIEWER", label: "Proprietário / Passageiro" },
  { value: "CONTROLLER", label: "Administrador / Comandante" },
  { value: "ADMIN", label: "Administrador / Comandante" },
  { value: "PILOT", label: "Copiloto" },
  { value: "CTM", label: "CTM" },
];

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "VIEWER",
    },
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit = handleSubmit(async (values: RegisterInput) => {
    try {
      setServerError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Não foi possível concluir o cadastro");
      }

      showToast({
        title: "Cadastro criado",
        description: "Bem-vindo! Você já pode acessar o painel.",
        variant: "success",
      });
      reset();
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível concluir o cadastro";
      setServerError(message);
      showToast({
        title: "Erro no cadastro",
        description: message,
        variant: "error",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-air-blue-100" htmlFor="name">
          Nome completo
        </label>
        <input
          id="name"
          type="text"
          className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-300 focus:outline-none"
          placeholder="Maria Andrade"
          {...register("name")}
        />
        {errors.name ? <p className="mt-1 text-sm text-red-200">{errors.name.message}</p> : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-air-blue-100" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-300 focus:outline-none"
          placeholder="voce@airx.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-200">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-air-blue-100" htmlFor="phone">
          Telefone (opcional)
        </label>
        <input
          id="phone"
          type="tel"
          className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-300 focus:outline-none"
          placeholder="(11) 99999-9999"
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="mt-1 text-sm text-red-200">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-air-blue-100" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-300 focus:outline-none"
            placeholder="********"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-red-200">{errors.password.message}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-air-blue-100" htmlFor="confirmPassword">
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-300 focus:outline-none"
            placeholder="********"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="mt-1 text-sm text-red-200">{errors.confirmPassword.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-air-blue-100" htmlFor="role">
          Perfil de acesso
        </label>
        <select
          id="role"
          className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-air-gold-300 focus:outline-none"
          {...register("role")}
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role.value} value={role.value} className="text-air-blue-900">
              {role.label}
            </option>
          ))}
        </select>
        {errors.role ? <p className="mt-1 text-sm text-red-200">{errors.role.message}</p> : null}
      </div>

      {serverError ? <p className="text-sm text-red-200">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-air-gold-400 px-4 py-3 text-center text-sm font-semibold text-air-blue-900 transition hover:bg-air-gold-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
