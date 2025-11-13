import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/register-form";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const allowSelfSignup = process.env.ALLOW_SELF_SIGNUP !== "false";
  if (!allowSelfSignup) {
    redirect("/login?signup=disabled");
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-air-blue-900">
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/10 p-10 text-white shadow-xl backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex w-fit items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/airx-logo.svg"
                alt="Logotipo Air X Control"
                fill
                sizes="3rem"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight text-left">
              <span className="text-xl font-semibold text-white">Air X</span>
              <span className="text-xs uppercase tracking-[0.35em] text-air-blue-200">
                Control
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-semibold">Criar conta Air X</h1>
          <p className="mt-3 text-air-blue-100">
            Configure seu acesso inicial ao portal Air X e convide sua equipe para acompanhar os
            indicadores da frota.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-8 text-center text-sm text-air-blue-100">
          Já possui uma conta?
          {" "}
          <Link href="/login" className="font-semibold text-air-gold-300 hover:text-air-gold-100">
            Fazer login
          </Link>
        </p>
      </div>
    </section>
  );
}
