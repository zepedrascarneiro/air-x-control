import Image from "next/image";

import { DemoForm } from "@/components/demo-form";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-air-blue-900 via-air-blue-700 to-air-blue-500 py-20">
      <section className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/10 p-12 text-white backdrop-blur">
          <div className="mx-auto mb-8 flex w-fit items-center gap-4">
            <div className="relative h-14 w-14">
              <Image
                src="/airx-logo.svg"
                alt="Logotipo Air X Control"
                fill
                sizes="3.5rem"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-semibold text-white">Air X</span>
              <span className="text-xs uppercase tracking-[0.35em] text-air-blue-200">
                Control
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold">Solicite uma demonstração personalizada</h1>
          <p className="mt-4 text-lg text-air-blue-100">
            Preencha os dados abaixo e nossa equipe retornará rapidamente para apresentar todos os
            recursos do Air X.
          </p>
          <div className="mt-10">
            <DemoForm />
          </div>
        </div>
      </section>
    </main>
  );
}
