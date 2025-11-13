"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ToastVariant = "success" | "error" | "info";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastRecord = ToastOptions & {
  id: string;
  createdAt: number;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4000;

function generateId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [mounted, setMounted] = useState(false);

  const clearAllTimers = useCallback(() => {
    Object.values(timers.current).forEach((timer) => {
      clearTimeout(timer);
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    ({ title, description, variant = "info", duration = DEFAULT_DURATION }: ToastOptions) => {
      const id = generateId();
      setToasts((prev) => [
        ...prev,
        {
          id,
          title,
          description,
          variant,
          duration,
          createdAt: Date.now(),
        },
      ]);

      timers.current[id] = setTimeout(() => dismissToast(id), duration);
      return id;
    },
    [dismissToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      dismissToast,
    }),
    [showToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <ToastViewport toasts={toasts} onDismiss={dismissToast} />,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-6 z-[1000] flex flex-col items-center gap-3 px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
}) {
  const { id, title, description, variant } = toast;
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border px-4 py-3 shadow-lg transition",
        variant === "success" &&
          "border-emerald-400/30 bg-emerald-500/15 text-emerald-50 backdrop-blur-md",
        variant === "error" &&
          "border-red-400/40 bg-red-500/15 text-red-50 backdrop-blur-md",
        variant === "info" && "border-white/20 bg-white/10 text-white backdrop-blur",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {title ? <p className="text-sm font-semibold leading-tight">{title}</p> : null}
          {description ? (
            <p className="mt-1 text-sm leading-snug text-white/80">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="rounded-full border border-white/20 bg-white/5 p-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white"
          aria-label="Fechar aviso"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  }
  return context;
}
