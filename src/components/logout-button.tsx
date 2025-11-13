"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  variant?: "default" | "ghost";
};

export function LogoutButton({ className, label = "Encerrar sessão", variant = "default" }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setError(null);
      setIsPending(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? "Falha ao encerrar sessão");
      }

      router.replace("/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao encerrar sessão");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-end gap-2", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
          variant === "default"
            ? "border border-white/30 bg-white/10 hover:bg-white/20"
            : "border border-white/10 hover:border-white/40 hover:bg-white/10",
          isPending && "cursor-not-allowed opacity-70",
        )}
      >
        {isPending ? "Saindo..." : label}
      </button>
      {error ? <span className="text-xs text-red-200">{error}</span> : null}
    </div>
  );
}
