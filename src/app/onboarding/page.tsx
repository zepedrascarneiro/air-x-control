import { redirect } from "next/navigation";
import { Plane, Plus, Users, ArrowRight } from "lucide-react";

import { getCurrentUser, getCurrentOrganization } from "@/lib/auth";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  // Se já tem organização, vai para o dashboard
  const organization = await getCurrentOrganization();
  if (organization) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-blue-200">
            Configure sua conta para começar a usar o Air X Control
          </p>
        </div>

        {/* Options */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <OnboardingForm userName={user.name} />
        </div>

        {/* Help text */}
        <p className="text-center text-blue-200/60 text-sm mt-6">
          Dúvidas? Entre em contato com o suporte em{" "}
          <a href="mailto:suporte@airxcontrol.com" className="text-blue-400 hover:underline">
            suporte@airxcontrol.com
          </a>
        </p>
      </div>
    </div>
  );
}
