"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginInput } from "@/lib/validators";
import { useToast } from "@/components/ui/toast-provider";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = handleSubmit(async (values: LoginInput) => {
    try {
      setServerError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Não foi possível autenticar");
      }

      showToast({
        title: "Login realizado",
        description: "Bem-vindo de volta ao painel.",
        variant: "success",
      });
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível autenticar";
      setServerError(message);
      showToast({
        title: "Falha no login",
        description: message,
        variant: "error",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
        <label className="block text-sm font-medium text-air-blue-100" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-300 focus:outline-none"
          placeholder="********"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-red-200">{errors.password.message}</p>
        ) : null}
        <div className="mt-2 text-right">
          <Link 
            href="/forgot-password" 
            className="text-sm text-air-gold-300 hover:text-air-gold-200 transition-colors"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>

      {serverError ? <p className="text-sm text-red-200">{serverError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-air-gold-400 px-4 py-3 text-center text-sm font-semibold text-air-blue-900 transition hover:bg-air-gold-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Entrando..." : "Acessar painel"}
      </button>
    </form>
  );
}
