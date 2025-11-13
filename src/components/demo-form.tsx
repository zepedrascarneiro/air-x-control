"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  demoRequestSchema,
  type DemoRequestFormInput,
} from "@/lib/validators";
import { useToast } from "@/components/ui/toast-provider";

export function DemoForm() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<DemoRequestFormInput>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      preferredDate: "",
      message: "",
    },
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit = async (values: DemoRequestFormInput) => {
    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          preferredDate:
            values.preferredDate && values.preferredDate !== ""
              ? values.preferredDate
              : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar solicitação de demonstração");
      }

      reset();
      showToast({
        title: "Solicitação enviada",
        description: "Nossa equipe entrará em contato em breve.",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao enviar sua solicitação. Tente novamente.";
      showToast({
        title: "Erro ao enviar",
        description: message,
        variant: "error",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl bg-white/10 p-8 text-white backdrop-blur"
    >
      <h3 className="text-3xl font-semibold">Peça uma demonstração</h3>
      <p className="text-air-blue-100">
        Nossa equipe retornará em até 24 horas para agendar a apresentação completa do
        sistema Air X.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="name">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-400 focus:outline-none"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-sm text-red-300">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="email">
            E-mail corporativo
          </label>
          <input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-400 focus:outline-none"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-sm text-red-300">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="phone">
            Telefone ou WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-400 focus:outline-none"
            {...register("phone")}
          />
          {errors.phone && (
            <span className="text-sm text-red-300">{errors.phone.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" htmlFor="company">
            Empresa
          </label>
          <input
            id="company"
            type="text"
            placeholder="Nome da empresa"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-400 focus:outline-none"
            {...register("company")}
          />
          {errors.company && (
            <span className="text-sm text-red-300">{errors.company.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2 md:flex-row md:items-end md:gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="preferredDate">
              Data ideal
            </label>
            <input
              id="preferredDate"
              type="date"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-400 focus:outline-none"
              {...register("preferredDate")}
            />
            {errors.preferredDate && (
              <span className="text-sm text-red-300">
                {errors.preferredDate.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-air-gold-400 px-6 py-3 font-semibold text-air-blue-900 transition-all hover:bg-air-gold-300 disabled:cursor-not-allowed disabled:opacity-70 md:mt-0"
          >
            {isSubmitting ? "Enviando…" : "Agendar demonstração"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="message">
          Observações adicionais
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Conte-nos um pouco sobre sua operação."
          className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-air-blue-200 focus:border-air-gold-400 focus:outline-none"
          {...register("message")}
        />
        {errors.message && (
          <span className="text-sm text-red-300">{errors.message.message}</span>
        )}
      </div>

    </form>
  );
}
