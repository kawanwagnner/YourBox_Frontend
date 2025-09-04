// Página de login — versão polida
import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "./login.schema";
import { useAuthStore } from "../state/auth.store";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function LoginPage() {
  const { login, loading, error, token } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (token) navigate("/spaces");
  }, [token, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      if (import.meta.env.MODE === "development")
        console.debug("[login.page] form submit", data);
      await login(data.email, data.password);
      if (import.meta.env.MODE === "development") {
        const token = useAuthStore.getState().token;
        console.debug("[login.page] store token after login:", token);
      }
    } catch {
      /* erros já vêm do store */
    }
  };

  const disabled = loading || isSubmitting;

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md px-4">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-6 text-white">
            <h1 className="text-2xl font-extrabold tracking-tight">Entrar</h1>
            <p className="mt-1 text-sm text-white/80">
              Acesse sua conta para continuar.
            </p>
          </div>

          {/* Form */}
          <form
            className="login-form flex flex-col gap-4 px-6 py-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Bloco de erro geral */}
            {(error || errors.email || errors.password) && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
              >
                {error ? (
                  <p className="font-medium">{error}</p>
                ) : (
                  <p className="font-medium">
                    Verifique os campos destacados abaixo.
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="email"
                placeholder="seu@email.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-rose-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-xs font-medium text-slate-600 underline-offset-4 hover:underline focus:outline-none"
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-rose-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Opções */}
            <div className="mt-1 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                  // opcional: registrar se quiser persistir login
                  // {...register("remember")}
                />
                Lembrar-me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              loading={disabled}
              disabled={disabled}
              className="mt-2"
            >
              {disabled ? "Entrando..." : "Entrar"}
            </Button>

            {/* Divisor */}
            <div className="my-2 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-500">ou</span>
              <div className="h-px flex-1 bg-slate-2 00" />
            </div>

            {/* Ações secundárias (placeholders, remova se não usar OAuth) */}
            <div className="grid grid-cols-1 gap-2">
              <Button type="button" disabled title="Em breve">
                Entrar com Google
              </Button>
              <Button type="button" disabled title="Em breve">
                Entrar com GitHub
              </Button>
            </div>
          </form>

          {/* Rodapé */}
          <div className="border-t border-slate-200 px-6 py-4 text-center text-sm text-slate-600">
            Não tem conta?{" "}
            <Link
              to="/register"
              className="font-semibold text-slate-800 underline-offset-4 hover:underline"
            >
              Criar agora
            </Link>
          </div>
        </div>

        {/* Info de ambiente dev */}
        <p
          aria-live="polite"
          className="mt-4 text-center text-xs text-slate-500"
        >
          {loading ? "Validando credenciais..." : "\u00A0"}
        </p>
      </div>
    </AuthLayout>
  );
}
